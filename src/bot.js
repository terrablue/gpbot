import irc from "irc-upd";
import {config} from "dotenv";
import run from "./run.js";
import gpt from "./gpt.js";

config();

const {irc_network, irc_user, irc_channels, open_ai_key} = process.env;
const channels = irc_channels.split(";");

const client = new irc.Client(irc_network, irc_user, {channels});

const commands = [",", "."];

const onMessage = async (from, to, message) => {
  // only react if in channel
  if (!channels.includes(to)) {
    return;
  }

  if (message.startsWith("!gpt")) {
    client.say(to, await gpt(open_ai_key, message.slice(4).trim()));
    return;
  }

  if (!message.includes(">") && !commands.some(c => c === message)) {
    return;
  }

  const lines = await run(message);
  lines.forEach(line => client.say(to, line));
};

client.addListener("message", onMessage);
