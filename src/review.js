import {Configuration, OpenAIApi} from "openai";

const preprompt = "Review the following code.";

const getRaw = url => url.includes("dpaste.com") ? `${url}.txt` : `${url}/raw`;

export default async (apiKey, message, config) => {
  const openai = new OpenAIApi(new Configuration({apiKey}));
  const [, url, ...postprompt] = message.split(" ");
  try {
    const code = await (await fetch(getRaw(url))).text();
    const prompt = `${preprompt} ${postprompt.join(" ")}\n\n${code}`;
    const content = (await openai.createCompletion({
      ...config,
      prompt,
    })).data.choices[0].text;
    return content;
  } catch (error) {
    console.log(error);
    return "(error) couldn't fetch given url";
  }
};
