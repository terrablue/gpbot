import {Configuration, OpenAIApi} from "openai";

const preprompt = language => `Explain the following ${language} code:`;

export default async (apiKey, language, code, config) => {
  const openai = new OpenAIApi(new Configuration({apiKey}));
  try {
    const prompt = `${preprompt(language)} ${code}`;
    const content = (await openai.createCompletion({
      ...config,
      prompt,
    })).data.choices[0].text;
    return `(gpt) ${content.replaceAll("\n", "")}`;
  } catch (error) {
    console.log(error);
    return "(error) accessing openai api";
  }
};
