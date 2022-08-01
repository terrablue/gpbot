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
  const command = "ghci";
  const result = spawnSync(command, {input});
  return format(result, result.stderr.toString().length === 0 ? "ok" : "err");
};
