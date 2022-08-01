import {Test} from "debris";
import hs from "./run.js";

const test = new Test();

test.case("success", assert => {
  assert(hs("0 + 1")).equals("(ok) 1");
  assert(hs("1 > 0")).equals("(ok) True");
});

test.case("failure", assert => {
  assert(hs("0 + !")).equals("(err) 1:5: error: parse error on input ‘!’");
});

export default test;
