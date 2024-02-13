import { string, primary, date } from "@primate/types";
import crypto from "rcompat/crypto";

const length = 8;

const schema = {
  id: primary,
  target: string,
  source: string,
  created: date,
};

export const actions = Link => {
  return {
    async shorten(target) {
      await Link.schema.create(schema);
      const source = crypto.randomUUID().slice(0, length);
      await Link.insert({ target, source, created: new Date() });
      return source;
    },
  };
};

export default schema;
