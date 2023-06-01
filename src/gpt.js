import {Configuration, OpenAIApi} from "openai";

export default async (apiKey, config) => {
  const openai = new OpenAIApi(new Configuration({apiKey}));
  try {
    return (await openai.createCompletion(config)).data.choices[0].text;
  } catch (error) {
    return `(err) openai API unavailable (${error.response.statusText})`;
  }
};
