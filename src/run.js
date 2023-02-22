import {Path} from "runtime-compat/filesystem";
import {run} from "./docker.js";

const interpreters = new Path(import.meta.url).directory.join("interpreters");

const format = ({source, output}, result) =>
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

const langs = {
  erl: "Erlang",
  hs: "Haskell",
  js: "JavaScript",
  ml: "OCaml",
  py: "Python",
  rs: "Rust",
  ts: "TypeScript",
};

const parse = async message => {
  const [command, ...rest] = message.split(">");
  const explain = command.endsWith("?");
  const interpreter = explain ? command.slice(0, -1) : command;
  const syntax = rest.join(">");

  const {file} = interpreters.join(interpreter, "run.js");
  const output = [];
  if (await file.exists) {
    try {
      const {ok, err, sanitize} = await import(file.path);
      const handlers = {ok, err};
      const code = sanitize(syntax);
      const result = run(interpreter, code);
      const errored = result.stderr.toString().length === 0;
      const status = errored ? "ok" : "err";
      const lines = asArray(format(handlers[status], result));
      memory = lines.length > limit + 1 ? lines.slice(limit + 1) : [];
      return {
        lines: prepare([`(${status}) ${lines.at(0)}`, ...lines.slice(1, limit)]),
        language: langs[interpreter],
        code,
        explain,
      };
    } catch (error) {
      // ignore
    }
  }

  return {lines: []};
};

export default async message => commands[message]?.() ?? parse(message);
