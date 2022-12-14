import irc from "irc-upd";
import {config} from "dotenv";
import run from "./run.js";

config();

const {irc_network, irc_user, irc_channels} = process.env;
const channels = irc_channels.split(";");

const client = new irc.Client(irc_network, irc_user, {channels});

const commands = [",", "."];

const onMessage = async (from, to, message) => {
  if (!message.includes(">") && !commands.some(c => c === message)) {
    return;
  }

  // only react if in channel
  if (channels.includes(to)) {
    const lines = await run(message);
    lines.forEach(line => client.say(to, line));
  }
};

client.addListener("message", onMessage);
