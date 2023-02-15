import {Configuration, OpenAIApi} from "openai";

const config = {
  model: "text-davinci-003",
  temperature: 0,
  max_tokens: 50,
};

export default async (apiKey, prompt) => {
  const openai = new OpenAIApi(new Configuration({apiKey}));
  const completion = await openai.createCompletion({...config, prompt});
  return completion.data.choices[0].text;
};
