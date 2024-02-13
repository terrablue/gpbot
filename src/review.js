import OpenAI from "openai";

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
  const openai = new OpenAI({ apiKey });
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
    const chat_completion = await openai.chat.completions.create({
      ...config,
      messages: [{
        role: "assistant", content: `${prompt}`,
      }],
    });
    const { choices: [{ message: { content } }] } = chat_completion;
    return content;
  } catch (error) {
    console.log(error);
    return "(error) couldn't fetch given url";
  }
};
