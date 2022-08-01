import {Test} from "debris";
import rs from "./run.js";

const test = new Test();

test.case("success", assert => {
  assert(rs("0 + 1")).equals("(ok) 1");
  assert(rs("1 > 0")).equals("(ok) true");
  assert(rs("let guess = \"secret\"; guess")).equals("(ok) \"secret\"");
  assert(rs("let guess = \"secret\"; guess;")).equals("(ok) \"secret\"");
});

test.case("failure", assert => {
  const err1 = "(err) expected expression, found `}`";
  assert(rs("0 + !")).equals(err1);
  const err2 = "(err) [E0277]: cannot multiply `{integer}` by `{float}`";
  assert(rs("10 + 20*4.5")).equals(err2);
});

export default test;
