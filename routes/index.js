import {Path} from "runtime-compat/fs";
import crypto from "runtime-compat/crypto";
import {Response, Status} from "runtime-compat/http";
import {valmap, from, to} from "runtime-compat/object";
import {assert} from "runtime-compat/dyndef";

const conf = await new Path(import.meta.url).up(2).join("conf.json").json();
const encoder = new TextEncoder("utf-8");
const encode = what => encoder.encode(what);
const hash = "SHA-256";
const algorithm = {name: "HMAC", hash};

const secrets = valmap(conf.github, ({secret}) => secret);
const keys = from(await Promise.all(to(secrets).map(async ([key, value]) =>
  [key, await crypto.subtle.importKey("raw", encode(value), algorithm, false,
    ["verify"])])));
const channels = valmap(conf.github, ({channels}) => channels);
const colors = valmap(conf.github, ({color}) => color);
const {baseuri} = conf;

const htia = string =>
  new Uint8Array(string.match(/[\dA-F]{2}/gui).map(hex => parseInt(hex, 16)));

const verify = (body, signature) => {
  const result = to(keys).find(([, key]) =>
    crypto.subtle.verify(algorithm.name, key, htia(signature), encode(body))
  );
  return result?.[0];
};

const preface = (repository, color) => `\x03${color},01${repository}\x03 ::`;
const bold = message => `\x02${message}\x02`;

const events = {
  async issues({action, issue}, Link) {
    if (action === "opened") {
      const {html_url, user: {login}} = issue;
      const target = `${baseuri}/${await Link.shorten(html_url)}`;
      return `${bold(login)} opened issue [${target}]`;
    }
  },
  push({commits}, Link) {
    return Promise.all(commits.map(async commit => {
      const {author: {name}, message, url} = commit;
      const target = `${baseuri}/${await Link.shorten(url)}`;
      return `${bold(name)} commited ${bold(message)} [${target}]`;
    }));
  },
  async commit_comment({action, comment}, Link) {
    if (action === "created") {
      const {html_url, commit_id, user: {login}} = comment;
      const target = `${baseuri}/${await Link.shorten(html_url)}`;
      const cid = bold(commit_id.slice(0, 8));
      return `${bold(login)} commented on commit ${cid} [${target}]`;
    }
  },
};

export default {
  async post(request) {
    const body = request.body.get();
    const signature = request.headers.get("x-hub-signature-256");
    const repository = await verify(JSON.stringify(body),
      signature.slice(hash.length));
    if (repository !== undefined) {
      const {repository: {full_name}} = body;
      assert(repository === full_name, `
        repository in event data must match repository by secret
        repository by secret: ${repository}
        repository in event data: ${full_name}
      `);
      const event = request.headers.get("x-github-event");
      const name = preface(repository, colors[repository] ?? "14");
      const {Link} = request.store;
      const result = await events[event](body, Link);
      if (result !== undefined) {
        const messages = (Array.isArray(result) ? result : [result])
          .map(message => `${name} ${message}`);

        channels[repository].forEach(channel =>
          messages.forEach(message =>
            request.say(channel, message)));
      }
      return new Response(null, {status: Status.OK});
    }
    return new Response(null, {status: Status.BadRequest});
  },
};
