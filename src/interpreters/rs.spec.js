import {Test} from "debris";
import rs from "./rs.js";

const test = new Test();

test.case("success", assert => {
  assert(rs("0 + 1")).equals("(ok) 1");
});

test.case("failure", assert => {
  const err1 = "(err) expected expression, found end of macro arguments";
  assert(rs("0 + !")).equals(err1);
  const err2 = "(err) [E0277]: cannot multiply `{integer}` by `{float}`";
  assert(rs("10 + 20*4.5")).equals(err2);
});

export default test;

