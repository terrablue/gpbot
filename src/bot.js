import irc from "irc-upd";
import {config} from "dotenv";
import {Path} from "runtime-compat/filesystem";

config();

const {irc_network, irc_user, irc_channels} = process.env;
const channels = irc_channels.split(";");

const interpreters = new Path(import.meta.url).directory.join("interpreters");

const client = new irc.Client(irc_network, irc_user, {channels});

const run = async (interpreter, syntax, recipient) => {
  const {file} = interpreters.join(interpreter, "run.js");
  if (await file.exists) {
    try {
      const handler = (await import(file.path)).default;
      client.say(recipient, handler(syntax));
    } catch (error) {
      // ignore
    }
  }
};

const onMessage = (from, to, message) => {
  if (!message.includes(">")) {
    return;
  }

  const [interpreter, ...rest] = message.split(">");
  const syntax = rest.join(">");
  // only react if in channel
  if (channels.includes(to)) {
    run(interpreter, syntax, to);
  }
};

client.addListener("message", onMessage);
