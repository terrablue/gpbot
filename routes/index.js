import { File } from "rcompat/fs";
import crypto from "rcompat/crypto";
import { Response, Status } from "rcompat/http";
import { valmap, from, to } from "rcompat/object";

const conf = await new File(import.meta.url).up(3).join("conf.json").json();
const encoder = new TextEncoder("utf-8");
const encode = what => encoder.encode(what);
const hash = "SHA-256";
const algorithm = { name: "HMAC", hash };

const secrets = valmap(conf.github, ({ secret }) => secret);
const keys = from(await Promise.all(to(secrets).map(async ([key, value]) =>
  [key, await crypto.subtle.importKey("raw", encode(value), algorithm, false,
    ["verify"])])));
const channels = valmap(conf.github, ({ channels }) => channels);
const colors = valmap(conf.github, ({ color }) => color);
const branches = valmap(conf.github, ({ branches }) => branches);
const { baseuri } = conf;

const htia = string =>
  new Uint8Array(string.match(/[\dA-F]{2}/gui).map(hex => parseInt(hex, 16)));

const verify = (body, signature, repository) =>
  crypto.subtle.verify(algorithm.name, keys[repository], htia(signature),
    encode(body));

const preface = (repository, color) => `\x03${color},99${repository}\x03 ::`;
const bold = message => `\x02${message}\x02`;
const grey = text => `\x0314,01${text}\x03`;

const events = {
  async release({ release: { html_url, name }, sender: { login } }, Link) {
    const target = `${baseuri}/${await Link.shorten(html_url)}`;
    return `${bold(login)} released ${bold(name)} | ${target}`;
  },
  async issues({ action, issue: { html_url, title }, sender: { login } }, Link) {
    if (["opened", "closed"].includes(action)) {
      const target = `${baseuri}/${await Link.shorten(html_url)}`;
      return `${bold(login)} ${action} issue ${bold(title)} | ${target}`;
    }
  },
  push({ commits, ref }, Link, repository) {
    const branch = ref.split("/").at(-1);
    const repository_branches = branches[repository];
    if (repository_branches !== undefined && !repository_branches.includes(branch)) {
      return [];
    }
    const $branch = grey(branch);
    return Promise.all(commits.map(async commit => {
      const { author: { username }, message, url } = commit;
      const target = `${baseuri}/${await Link.shorten(url)}`;
      return `${$branch} ${bold(username)} committed ${bold(message)} | ${target}`;
    }));
  },
  async commit_comment({ action, comment }, Link) {
    if (action === "created") {
      const { html_url, commit_id, user: { login } } = comment;
      const target = `${baseuri}/${await Link.shorten(html_url)}`;
      const cid = bold(commit_id.slice(0, 8));
      return `${bold(login)} commented on commit ${cid} | ${target}`;
    }
  },
  ping() {
    return "ok";
  },
};

export default {
  get() {
    return `
      This is the homepage of gpbot, an IRC bot for great programmers.

      https://github.com/terrablue/gpbot
    `;
  },
  async post(request) {
    const { body } = request;
    const signature = request.headers.get("x-hub-signature-256");
    const repository = body.repository.full_name;
    const verified = await verify(JSON.stringify(body),
      signature.slice(hash.length), repository);
    if (verified) {
      const event = request.headers.get("x-github-event");
      const name = preface(repository, colors[repository] ?? "14");
      const { Link } = request.store;
      const result = await events[event](body, Link, repository);
      if (result !== undefined) {
        const messages = (Array.isArray(result) ? result : [result])
          .map(message => `${name} ${message}`);

        channels[repository].forEach(channel =>
          messages.forEach(message =>
            request.say(channel, message)));
      }
      return new Response(null, { status: Status.OK });
    }
    return new Response(null, { status: Status.BadRequest });
  },
};
