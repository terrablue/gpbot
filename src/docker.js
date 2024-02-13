import { spawnSync } from "node:child_process";

const command = "docker";
export const run = (name, input) => spawnSync(command,
  [
    "run",
    "-i",
    "--rm",
    `--name=${name}`,
    "--net=none",
    `gpbot/${name}`,
  ],
  { input });
