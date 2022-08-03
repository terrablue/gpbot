import irc from "irc-upd";
import {config} from "dotenv";
import run from "./run.js";

config();

const {irc_network, irc_user, irc_channels} = process.env;
const channels = irc_channels.split(";");

const client = new irc.Client(irc_network, irc_user, {channels});

const onMessage = async (from, to, message) => {
  if (!message.includes(">")) {
    return;
  }

  // only react if in channel
  if (channels.includes(to)) {
    client.say(to, await run(message));
  }
};

client.addListener("message", onMessage);
