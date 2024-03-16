import { File } from "rcompat/fs";
import { run } from "./docker.js";
import languages from "./languages.js";

const interpreters = new File(import.meta.url).up(1).join("interpreters");

const format = ({ source, output }, result) =>
  output(result[source].toString().split("\n").filter(l => l !== ""));

const asArray = maybe => Array.isArray(maybe) ? maybe : [maybe];
const limit = 6;

let memory = [];

const prepare = lines => lines.map(line => line.replace("\t", "  "));

const commands = {
  // continuation
  ",": () => prepare(memory.length > 0 ? memory.splice(0, limit) : []),
  // abort
  ".": () => {
    memory = [];
    return memory;
  },
};

const parse = async message => {
  const [command, ...rest] = message.split(">");
  const explain = command.endsWith("?");
  const interpreter = explain ? command.slice(0, -1) : command;
  const syntax = rest.join(">");

  const file = interpreters.join(interpreter, "run.js");

  if (await file.exists()) {
    try {
      const { ok, err, sanitize } = await file.import();
      const handlers = { ok, err };
      const code = sanitize(syntax);
      const result = run(interpreter, code.trim());
      const errored = result.stderr.toString().length === 0;
      const status = errored ? "ok" : "err";
      const lines = asArray(format(handlers[status], result));
      memory = lines.length > limit + 1 ? lines.slice(limit + 1) : [];
      return {
        lines: prepare([`(${status}) ${lines.at(0)}`,
          ...lines.slice(1, limit)]),
        language: languages[interpreter],
        code: syntax,
        explain,
      };
    } catch (error) {
      // ignore
    }
  }

  return { lines: [] };
};

export default async message => commands[message]?.() ?? parse(message);
