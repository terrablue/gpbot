import irc from "irc-upd";
import {config} from "dotenv";
import {File, Path} from "runtime-compat/filesystem";

config();

const {irc_network, irc_user, irc_channels} = process.env;
const channels = irc_channels.split(";");

const {directory} = new Path(import.meta.url);

const client = new irc.Client(irc_network, irc_user, {channels});

const run = async (interpreter, syntax) => {
  const file = new File(directory.join("interpreters", `${interpreter}.js`));
  if (await file.exists) {
    try {
      const handler = (await import(file.path)).default;
      client.say(channels[0], handler(syntax));
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
  run(interpreter, syntax);
};

client.addListener("message", onMessage);
