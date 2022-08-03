import {Path} from "runtime-compat/filesystem";
import {run} from "./docker.js";

const interpreters = new Path(import.meta.url).directory.join("interpreters");

const format = ({source, output}, result) =>
  output(result[source].toString().split("\n").filter(l => l !== ""));

const asArray = maybe => Array.isArray(maybe) ? maybe : [maybe];
const limit = 6;

let memory = [];

const prepare = lines => lines.map(line => line.replace("\t", "  "));

const more = () => prepare(memory.length > 0 ? memory.splice(0, limit) : []);

const parse = async message => {
  const [interpreter, ...rest] = message.split(">");
  const syntax = rest.join(">");

  const {file} = interpreters.join(interpreter, "run.js");
  if (await file.exists) {
    try {
      const {ok, err, sanitize} = await import(file.path);
      const handlers = {ok, err};
      const result = run(interpreter, sanitize(syntax));
      const errored = result.stderr.toString().length === 0;
      const status = errored ? "ok" : "err";
      const lines = asArray(format(handlers[status], result));
      memory = lines.length > limit + 1 ? lines.slice(limit + 1) : [];
      return prepare([`(${status}) ${lines.at(0)}`, ...lines.slice(1, limit)]);
    } catch (error) {
      // ignore
    }
  }

  return [];
};

export default async message => message === "." ? more() : parse(message);
