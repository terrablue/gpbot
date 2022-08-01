import {spawnSync} from "node:child_process";

const types = {
  ok: {
    source: "stdout",
    from: 6,
  },
  err: {
    source: "stderr",
    from: 14,
  },
};

const format = (result, type) => {
  const {source, from} = types[type];
  return `(${type}) ${result[source].toString().split("\n").at(1).slice(from)}`;
};

export default input => {
  const command = "docker";
  const args = ["run", "-i", "--rm", "--name=hs", "--net=none", "gpbot/hs"];
  const options = {input: `${input}`};
  const result = spawnSync(command, args, options);
  return format(result, result.stderr.toString().length === 0 ? "ok" : "err");
};