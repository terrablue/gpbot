import {Path} from "runtime-compat/filesystem";
import {run} from "./docker.js";

const interpreters = new Path(import.meta.url).directory.join("interpreters");

const format = ({source, output}, result) =>
  output(result[source].toString().split("\n").filter(l => l !== ""));

const asArray = maybe => Array.isArray(maybe) ? maybe : [maybe];
const limit = 6;

let memory = [];

export default async message => {
  const [interpreter, ...rest] = message.split(">");
  const syntax = rest.join(">");

  const {file} = interpreters.join(interpreter, "run.js");
  if (await file.exists) {
    try {
      if (message === "more" && memory !== undefined) {
        return memory.splice(0, limit);
      }
      const {ok, err, sanitize} = await import(file.path);
      const result = run(interpreter, sanitize(syntax));
      const handler = result.stderr.toString().length === 0 ? ok : err;
      const status = result.stderr.toString().length === 0 ? "ok" : "err";
      const lines = asArray(format(handler, result));
      if (lines.length > limit + 1) {
        memory = lines.slice(limit + 1);
      } else {
        memory = [];
      }
      return [`(${status}) ${lines.at(0)}`, ...lines.slice(1, limit)];
    } catch (error) {
      // ignore
    }
  }
};
