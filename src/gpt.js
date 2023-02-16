import {Configuration, OpenAIApi} from "openai";

export default async (apiKey, config) => {
  const openai = new OpenAIApi(new Configuration({apiKey}));
  return (await openai.createCompletion(config)).data.choices[0].text;
};
