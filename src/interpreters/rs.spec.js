import {Test} from "debris";
import rs from "./rs.js";

const test = new Test();

test.case("success", assert => {
  assert(rs("0 + 1")).equals("(ok) 1");
});

test.case("failure", assert => {
  const err = "(err) expected expression, found end of macro arguments";
  assert(rs("0 + !")).equals(err);
});

export default test;

