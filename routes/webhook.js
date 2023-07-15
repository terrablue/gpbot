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

const htia = string =>
  new Uint8Array(string.match(/[\dA-F]{2}/gui).map(hex => parseInt(hex, 16)));

const verify = (body, signature) => {
  const result = to(keys).find(([, key]) =>
    crypto.subtle.verify(algorithm.name, key, htia(signature), encode(body))
  );
  return result?.[0];
};

const events = {
  push(data, say) {

  },
  commit_comment(data) {
    const {action, repository, comment} = data;
    if (action === "created") {
      return `${repository.full_name} :: ${comment.user.login} commented on ${comment.commit_id}`;
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
        repositry in event data: ${full_name}
      `);
      const event = request.headers.get("x-github-event");
      const message = events[event](body);
      if (message !== undefined) {
        channels.forEach(channel => request.say(channel, message));
      }
      return new Response(null, Status.OK);
    }
    return new Response(null, Status.BadRequest);
  },
};
