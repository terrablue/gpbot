import {Configuration, OpenAIApi} from "openai";

const preprompt = "Review the following code.";

const gh = "github.com";
const rgh = "raw.githubusercontent.com";

const domains = {
  "dpaste.com": url => `${url}.txt`,
  "dpaste.org": url => `${url}/raw`,
  [rgh]: url => url,
  [gh]: url => url.replace("/blob/", "/").replace(gh, rgh),
};

export default async (apiKey, message, config) => {
  const openai = new OpenAIApi(new Configuration({apiKey}));
  const [, url, ...postprompt] = message.split(" ");
  const domain = Object.entries(domains).find(([key]) =>
    url.startsWith(`https://${key}`));
  if (domain === undefined) {
    return "(error) unsupported paste domain";
  }
  const [, getRaw] = domain;
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
