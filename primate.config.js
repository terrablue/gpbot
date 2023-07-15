import bot from "./src/bot.js";

export default {
  modules: [
    (_ => {
      let client;
      return {
        name: "bot",
        init() {
          client = bot();
        },
        route(request, next) {
          return next({...request, say: client.say});
        },
      };
    })(),
  ],
};
