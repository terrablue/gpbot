import irc from "./src/irc.js";
import { default as store, sqlite } from "@primate/store";

export default {
  http: {
    port: 8181,
  },
  modules: [
    store({ driver: sqlite({ filename: "data.db" }) }),
    (_ => {
      const clients = {};
      return {
        name: "bot",
        init(app, next) {
          clients.irc = irc();
          return next(app);
        },
        route(request, next) {
          return next({ ...request, say: (channel, message) => {
            clients.irc.say(channel, message);
          } });
        },
      };
    })(),
  ],
};
