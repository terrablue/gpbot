import irc from "irc-upd";
import {config} from "dotenv";
import {File, Path} from "runtime-compat/filesystem";

config();

const {irc_network, irc_user, irc_channels} = process.env;
const channels = irc_channels.split(";");

const {directory} = new Path(import.meta.url);

const client = new irc.Client(irc_network, irc_user, {channels});

const run = async (interpreter, syntax, recipient) => {
  const path = directory.join("interpreters", interpreter, "run.js");
  if (await new File(path).exists) {
    try {
      const handler = (await import(path)).default;
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
  const syntax = rest.join("");
  // if message sent directly to bot, reply to from, otherwise to to
  const recipient = to === irc_user ? from : to;
  run(interpreter, syntax, recipient);
};

client.addListener("message", onMessage);
