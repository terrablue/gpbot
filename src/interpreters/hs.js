import {execSync} from "node:child_process";

const command_length = 6;

export default syntax => {
  const output = execSync(`ghci <<< '${syntax}'`).toString("utf8");
  return output.split("\n").at(1).slice(command_length);
};
