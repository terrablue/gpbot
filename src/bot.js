import irc_udp from "irc-upd";
import run from "./run.js";
import review from "./review.js";
import explain from "./explain.js";
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

  if (openai?.api_key !== undefined) {
    if (message.match(re)) {
      client.say(to, await review(openai.api_key, message, openai.review));
      return;
    }
  }

  if (!message.includes(">") && !commands.some(c => c === message)) {
    return;
  }

  const {lines, language, code, explain: _explain} = await run(message);
  lines.forEach(line => client.say(to, line));
  if (openai?.api_key !== undefined && _explain) {
    const {api_key, review} = openai;
    client.say(to, await explain(api_key, language, code, review));
  }
};

client.addListener("message", onMessage);
