import bot from "./src/bot.js";

export default {
  modules: [
    {
      name: "bot",
      init() {
        bot();
      },
    },
  ],
};
