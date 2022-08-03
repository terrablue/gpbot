import {Path} from "runtime-compat/filesystem";

const interpreters = new Path(import.meta.url).directory.join("interpreters");

export default async message => {
  const [interpreter, ...rest] = message.split(">");
  const syntax = rest.join(">");

  const {file} = interpreters.join(interpreter, "run.js");
  if (await file.exists) {
    try {
      return (await import(file.path)).default(syntax);
    } catch (error) {
      // ignore
    }
  }
};
