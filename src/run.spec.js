import {Test} from "debris";
import run from "./run.js";

const test = new Test();

const hs = syntax => run(`hs> ${syntax}`);
const rs = syntax => run(`rs> ${syntax}`);
const py = syntax => run(`py> ${syntax}`);
const ts = syntax => run(`ts> ${syntax}`);

test.case("0 + 1", async assert => {
  const result = ["(ok) 1"];
  assert(await hs("0 + 1")).equals(result);
  assert(await run("rs> 0 + 1")).equals(result);
  assert(await run("py> 0 + 1")).equals(result);
  assert(await run("ts> 0 + 1")).equals(result);
});

test.case("1 > 0", async assert => {
  const result = {true: ["(ok) true"], True: ["(ok) True"]};
  assert(await run("hs> 1 > 0")).equals(result.True);
  assert(await run("rs> 1 > 0")).equals(result.true);
  assert(await run("py> 1 > 0")).equals(result.True);
  assert(await run("ts> 1 > 0")).equals(result.true);
});

test.case("1; 1", async assert => {
  assert(await run("py> 1; 1")).equals(["(ok) 1 1"]);

  assert(await run("ts> 1; 1")).equals(["(ok) 1"]);
});

test.case("0 + !", async assert => {
  const errorHS = ["(err) 1:6: error: parse error on input ‘!’"];
  assert(await hs("0 + !")).equals(errorHS);
  assert(await py("0 + !")).equals(["(err) SyntaxError: invalid syntax"]);
  assert(await rs("0 + !")).equals(["(err) expected expression, found `}`"]);
  const errorTS = ["(err) [eval].ts(1,6): error TS1109: Expression expected."];
  assert(await ts("0 + !")).equals(errorTS);
});

test.case("rust errors", async assert => {
  const err = ["(err) [E0277]: cannot multiply `{integer}` by `{float}`"];
  assert(await rs("10 + 20*4.5")).equals(err);
});

test.case("functions", async assert => {
  const r = ["(ok) 'foobar'"];
  assert(await py("foo = lambda x: f'foo{x}'; foo('bar')")).equals(r);
  assert(await py("foo = lambda x: f\"foo{x}\"; foo(\"bar\")")).equals(r);
});

test.case("; at the end", async assert => {
  const r = ["(ok) \"secret\""];
  assert(await rs("let guess = \"secret\"; guess")).equals(r);
  assert(await rs("let guess = \"secret\"; guess;")).equals(r);
});

test.case("quotes", async assert => {
  const r = ["(ok) hello world"];
  assert(await ts("'hello world'")).equals(r);
  assert(await ts("\"hello world\"")).equals(r);
});

test.case("failure", async assert => {
  assert(await run("js> 0 + 1")).throws();
  assert(await run("0 + 1")).throws();
});

test.case("multiline", async assert => {
  const result = [
    "(ok) type Show :: * -> Constraint",
    "class Show a where",
    "  ...",
    "  show :: a -> String",
    "  ...",
    "    -- Defined in ‘GHC.Show’",
  ];
  assert(await hs(":info show")).equals(result);
});

test.case("limit", async assert => {
  const result = [
    "(ok) type Show :: * -> Constraint",
    "class Show a where",
    "  showsPrec :: Int -> a -> ShowS",
    "  show :: a -> String",
    "  showList :: [a] -> ShowS",
    "  {-# MINIMAL showsPrec | show #-}"
  ];
  assert(await hs(":info Show")).equals(result);
});


export default test;
