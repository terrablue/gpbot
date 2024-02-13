import { File } from "rcompat/fs";
import { execSync } from "node:child_process";

const interpreters = File.resolve().join("src", "interpreters");

for (const { directory } of await interpreters.file.collect("Dockerfile")) {
  const command = "docker";
  const args = ["build", "-t", `gpbot/${directory.name}`, directory.path];
  const cmd = [command, ...args].join(" ");
  console.info(cmd);
  execSync(cmd, directory.path);
}
