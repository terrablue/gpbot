import {string, primary, date} from "@primate/types";
import crypto from "runtime-compat/crypto";

const length = 8;

export const actions = (_, store) => {
  return {
    async shorten(target) {
      const {driver} = store.config;
      if (!driver.exists("link")) {
        driver.create("link", {
          id: "primary",
          target: "string",
          source: "string",
          created: "datetime",
        });
      }
      const source = crypto.randomUUID().slice(0, length);
      await store.insert({target, source, created: new Date()});
      return source;
    },
  };
};

export default {
  id: primary,
  target: string,
  source: string,
  created: date,
};
