import {Test} from "debris";
import py from "./run.js";

const test = new Test();

test.case("success", assert => {
  assert(py("0 + 1")).equals("(ok) 1");
  assert(py("1; 1")).equals("(ok) 1");
  assert(py("'hello world'")).equals("(ok) hello world");
  assert(py("\"hello world\"")).equals("(ok) hello world");
});

test.case("failure", assert => {
  const error = "[eval].ts(1,6): error TS1109: Expression expected.";
  assert(py("0 + !")).equals(`(err) ${error}`);
});

export default test;
