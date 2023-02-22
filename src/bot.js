import irc_udp from "irc-upd";
import run from "./run.js";
import gpt from "./gpt.js";
import review from "./review.js";
import conf from "../conf.json" assert {type: "json"};

const {irc, openai} = conf;
const channels = irc.channels.split(";");

const client = new irc_udp.Client(irc.network, irc.user, {channels});

const commands = [",", "."];

const re= /^!review (https:\/\/)?(dpaste\.com|dpaste\.org)\/.*$/;

const onMessage = async (from, to, message) => {
  // only react if in channel
  if (!channels.includes(to)) {
    return;
  }

  if (openai.api_key !== undefined) {
    if (message.startsWith("!gpt")) {
      client.say(to, await gpt(openai.api_key, {
        ...openai.completion,
        prompt: message.slice(4).trim(),
      }));
      return;
    }
    if (message.match(re)) {
      client.say(to, await review(openai.api_key, message, openai.review));
      return;
    }
  }

  if (!message.includes(">") && !commands.some(c => c === message)) {
    return;
  }

  const lines = await run(message);
  lines.forEach(line => client.say(to, line));
};

client.addListener("message", onMessage);
