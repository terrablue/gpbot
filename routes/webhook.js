import {Path} from "runtime-compat/fs";
import crypto from "runtime-compat/crypto";

const conf = await new Path(import.meta.url).up(2).join("conf.json").json();
const {token} = conf.github;

const encoder = new TextEncoder("utf-8");
const encode = what => encoder.encode(what);

const algorithm = {name: "HMAC", hash: "SHA-256"};
const key = await crypto.subtle
  .importKey("raw", encode(token), algorithm, false, ["sign", "verify"]);
const {btoa} = globalThis;

const verify = async (body, target_signature) => {
  const signature = await crypto.subtle.sign(algorithm.name, key, encode(body));
  const digest = btoa(String.fromCharCode(...new Uint8Array(signature)));
  return digest === target_signature;
};

export default {
  post(request) {
    console.log("request", request);
  },
};
