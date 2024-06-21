import { file } from "rcompat/fs";
import irc_udp from "irc-upd";
import run from "./run.js";
import gpt from "./gpt.js";
import review from "./review.js";
import explain from "./explain.js";
const conf = await file(import.meta.url).up(2).join("conf.json").json();

const { irc, openai } = conf;
const { channels } = irc;
const commands = [",", "."];

const gpt_command = "!gpt";

const encoder = new TextEncoder();
const truncate = (string, limit) => encoder.encode(string).length > limit
  ? truncate(string.slice(0, -1), limit)
  : string;

export default _ => {
  const client = new irc_udp.Client(irc.network, irc.user, {
    channels: Object.keys(channels),
    password: irc.password,
  });

  const say = (to, message) => {
    const sanitized = message.split("\r").join("\\r\\n");
    const ellipsis = " [truncated]";
    const max_length = client.maxLineLength - to.length - ellipsis.length;
    const truncated = truncate(sanitized, max_length);
    client.say(to, truncated === sanitized
      ? sanitized
      : `${truncated}${ellipsis}`);
  };

  const onMessage = async (_, to, message) => {
    const channel = channels[to];

    // only react if in channel
    if (channel === undefined) {
      return;
    }

    if (openai?.api_key !== undefined) {
      if (channel.gpt && message.startsWith(gpt_command)) {
        const config = { ...openai.completion };
        const content = message.slice(gpt_command.length).trim();
        say(to, await gpt(openai.api_key, config, content));
        return;
      }
      if (channel.review && message.startsWith("!review")) {
        say(to, await review(openai.api_key, message, openai.review));
        return;
      }
    }

    if (!message.includes(">") && !commands.some(c => c === message)) {
      return;
    }

    const { lines, language, code, explain: _explain } = await run(message);
    lines?.forEach(line => say(to, line));
    if (openai?.api_key !== undefined && _explain) {
      const { api_key, review } = openai;
      say(to, await explain(api_key, language, code, review));
    }
  };

  client.addListener("message", onMessage);

  return client;
};
