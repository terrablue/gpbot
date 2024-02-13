import OpenAI from "openai";

const ok = "\x0303,99✓\x03";
const err = "\x0304,99✗\x03";
const bold = message => `\x02${message}\x02`;

const commands = {
  async models(openai) {
    const models = (await openai.listModels()).data.data
      .filter(({ owned_by }) => owned_by === "openai")
      .filter(({ id }) => id.startsWith("gpt"))
      .map(model => model.id)
      .join(" ");
    return `${ok} ${models}`;
  },
  config(_, config) {
    const options = Object.entries(config)
      .map(([key, value]) => `${key}=${value}`)
      .join(", ");
    return `${ok} ${options}`;
  },
  notfound() {
    return `${err} command not found`;
  },
  async chat(openai, config) {
    try {
      const chat_completion = await openai.chat.completions.create({ ...config });
      const { choices: [{ role, message: { content } }] } = chat_completion;
      return `${ok} [${role}] ${content}`;
    } catch (error) {
      return `${err} ${error.response?.data?.error.message ?? error.message}`;
    }
  },
};

export default async (apiKey, config, message) => {
  const openai = new OpenAI({ apiKey });
  if (message.startsWith(".")) {
    // commands
    const [, command] = message.split(".");
    return (commands[command] ?? commands.notfound)(openai, config);
  }
  if (message.startsWith("[")) {
    const exec = /^\[model=(?<model>[\w.-]+)\](?<content>.*)?$/u.exec(message);
    if (exec === null || exec.groups.content === null) {
      return `${err} use ${bold("!gpt[model=$model_name] $message")}`;
    }
    const { model, content } = exec.groups;
    return commands.chat(openai, { ...config, model, messages: [
      { role: "user", content },
    ] });
  }
  return commands.chat(openai, { ...config, messages: [
    { role: "user", content: message },
  ] });
};
