import OpenAI from "openai";

const preprompt = language => `Explain the following ${language} code:`;

export default async (apiKey, language, code, config) => {
  const openai = new OpenAI({ apiKey });
  try {
    const prompt = `${preprompt(language)} ${code}`;
    const chat_completion = (await openai.chat.completions.create({
      ...config,
      messages: [{
        role: "assistant", content: `${prompt}`,
      }],
    }));
    const { choices: [{ message: { content } }] } = chat_completion;
    return `(gpt) ${content.replaceAll("\n", "")}`;
  } catch (error) {
    console.log(error);
    return "(error) accessing openai api";
  }
};
