import {Test} from "debris";
import run from "./run.js";

const test = new Test();

test.case("success", async assert => {
  assert(await run("hs> 0 + 1")).equals("(ok) 1");
  assert(await run("rs> 0 + 1")).equals("(ok) 1");
  assert(await run("py> 0 + 1")).equals("(ok) 1");
  assert(await run("ts> 0 + 1")).equals("(ok) 1");
});

test.case("failure", async assert => {
  assert(await run("js> 0 + 1")).throws();
  assert(await run("0 + 1")).throws();
});

export default test;
