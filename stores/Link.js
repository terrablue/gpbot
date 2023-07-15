import {string, primary} from "@primate/types";
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
        });
      }
      const source = crypto.randomUUID().slice(0, length);
      await store.insert({target, source});
      return source;
    },
  };
};

export default {
  id: primary,
  target: string,
  source: string,
};