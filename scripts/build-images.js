import {Path, File} from "runtime-compat/filesystem";
import {spawnSync} from "node:child_process";

const interpreters = Path.resolve().join("src", "interpreters");

for (const {directory} of await File.collect(interpreters, "Dockerfile")) {
  const command = "docker";
  const args = ["build", "-t", `gpbot/${directory.name}`, "."];
  const options = {cwd: directory.path};
  spawnSync(command, args, options);
}
