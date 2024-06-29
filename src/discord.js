import { file } from "rcompat/fs";
import { Client, GatewayIntentBits } from "discord.js";
const conf = await file(import.meta.url).up(2).join("conf.json").json();
const { token } = conf.discord;

export default () => {
// Create a new client instance
  const intents = [
    GatewayIntentBits.MessageContent,
  ];
  const client = new Client({ intents });
  client.on("messageCreate", async message => {
    console.log(message);
  });
  client.login(token);
  return {

  };
};
