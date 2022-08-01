import {spawnSync} from "node:child_process";

const last = -1;
const types = {
  ok: {
    source: "stdout",
    output: lines => lines.join(" "),
  },
  err: {
    source: "stderr",
    output: lines => lines.at(last),
  },
};

const format = (result, type) => {
  const {source, output} = types[type];
  const lines = result[source].toString().split("\n").filter(l => l !== "");
  return `(${type}) ${output(lines)}`;
};

const sanitize = input => input.replaceAll("\"", "\\\"");

export default input => {
  const command = "docker";
  const args = ["run", "-i", "--rm", "--name=py", "--net=none", "gpbot/py"];
  const options = {input: `${sanitize(input)}`};
  const result = spawnSync(command, args, options);
  return format(result, result.stderr.toString().length === 0 ? "ok" : "err");
};
