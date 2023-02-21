import {Configuration, OpenAIApi} from "openai";

const POST_URL = "https://dpaste.com/api/";
const preprompt = "Review the following code."

export default async (apiKey, message, config) => {
  const openai = new OpenAIApi(new Configuration({apiKey}));
  const [, url, ...postprompt] = message.split(" ");
  try {
    const code = await (await fetch(`${url}.txt`)).text();
    const prompt = `${preprompt} ${postprompt.join(" ")}\n\n${code}`;
    const content = (await openai.createCompletion({
      ...config,
      prompt,
    })).data.choices[0].text;
    const response = await fetch(POST_URL, {
      method: "POST" ,
      headers: {"Content-Type": "application/x-www-form-urlencoded"},
      body: `content=${encodeURIComponent(content)}`,
    });
    return `Code review at ${response.headers.get("location")}#wrap`;
  } catch (error) {
    console.log(error);
    return "(error) couldn't fetch given url";
  }
};
