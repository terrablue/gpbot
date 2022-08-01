import {spawnSync} from "node:child_process";

const types = {
  ok: {
    source: "stdout",
    from: 0,
    line: 0,
  },
  err: {
    source: "stderr",
    from: 0,
    line: 3,
  },
};

const format = (result, type) => {
  const {source, from, line} = types[type];
  return `(${type}) ${result[source].toString().split("\n").at(line).slice(from)}`;
};

export default input => {
  const command = "docker";
  const args = ["run", "-i", "--rm", "--name=py", "--net=none", "gpbot/py"];
  const options = {input: `${input}`};
  const result = spawnSync(command, args, options);
  return format(result, result.stderr.toString().length === 0 ? "ok" : "err");
};
