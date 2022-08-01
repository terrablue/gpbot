import {spawnSync} from "node:child_process";

const types = {
  ok: {
    source: "stdout",
    from: 0,
  },
  err: {
    source: "stderr",
    from: 5,
  },
};

const criticalSlice = 2;
const formatError = message =>
  message.startsWith("[") ? message : message.slice(criticalSlice);

const format = (result, type) => {
  const {source, from} = types[type];
  const message = result[source].toString().split("\n").at(0).slice(from);
  return `(${type}) ${type === "ok" ? message : formatError(message)}`;
};

const last = -1;
const parse = input => input.endsWith(";") ? input.slice(0, last) : input;

export default input => {
  const command = "docker";
  const args = ["run", "-i", "--rm", "--name=rs", "--net=none", "gpbot/rs"];
  const options = {input: `{${parse(input)}}`};
  const result = spawnSync(command, args, options);
  return format(result, result.stderr.toString().length === 0 ? "ok" : "err");
};
