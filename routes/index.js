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
const {baseuri} = conf;

const htia = string =>
  new Uint8Array(string.match(/[\dA-F]{2}/gui).map(hex => parseInt(hex, 16)));

const verify = (body, signature) => {
  const result = to(keys).find(([, key]) =>
    crypto.subtle.verify(algorithm.name, key, htia(signature), encode(body))
  );
  return result?.[0];
};

const preface = repository => `\x0312,01${repository}\x03 ::`;

const events = {
  push(data, say) {

  },
  async commit_comment(data, Link) {
    const {action, repository, comment} = data;
    if (action === "created") {
      const {html_url, commit_id, user: {login}} = comment;
      const name = preface(repository.full_name);
      const target = `${baseuri}/${await Link.shorten(html_url)}`;
      const cid = commit_id.slice(0, 8);
      return `${name} ${login} commented on commit ${cid} [${target}]`;
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
      const message = await events[event](body, request.store.Link);
      if (message !== undefined) {
        channels[repository].forEach(channel => request.say(channel, message));
      }
      return new Response(null, {status: Status.OK});
    }
    return new Response(null, {status: Status.BadRequest});
  },
};
