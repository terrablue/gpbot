import {Test} from "debris";
import hs from "./run.js";

const test = new Test();

test.case("success", assert => {
  assert(hs("0 + 1")).equals("(ok) 1");
});

test.case("failure", assert => {
  assert(hs("0 + !")).equals("(err) SyntaxError: invalid syntax");
});

export default test;
