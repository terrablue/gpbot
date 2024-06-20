import { File } from "rcompat/fs";
import { execSync } from "node:child_process";

const interpreters = File.resolve().join("src", "interpreters");

const command = "docker";
// make sure the latest superarch/minarch image is pulled
execSync(`${command} pull superarch/minarch`, { stdio: "inherit" });

for (const { directory } of await interpreters.collect("Dockerfile")) {
  const args = ["build", "-t", `gpbot/${directory.name}`, directory.path];
  const cmd = [command, ...args].join(" ");
  execSync(cmd, { cwd: directory.path, stdio: "inherit" });
}
