import {Test} from "debris";
import py from "./run.js";

const test = new Test();

test.case("success", assert => {
  assert(py("0 + 1")).equals("(ok) 1");
  assert(py("1 > 0")).equals("(ok) True");
  assert(py("1; 1")).equals("(ok) 1 1");
  const r = "(ok) 'foobar'";
  assert(py("foo = lambda x: f'foo{x}'; foo('bar')")).equals(r);
  assert(py("foo = lambda x: f\"foo{x}\"; foo(\"bar\")")).equals(r);
});

test.case("failure", assert => {
  assert(py("0 + !")).equals("(err) SyntaxError: invalid syntax");
});

export default test;
