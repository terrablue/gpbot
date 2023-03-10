import _run from "./run.js";

const run = async (...args) => (await _run(...args)).lines;

export default test => {
  const hs = syntax => run(`hs> ${syntax}`);
  const rs = syntax => run(`rs> ${syntax}`);
  const py = syntax => run(`py> ${syntax}`);
  const js = syntax => run(`js> ${syntax}`);
  const ts = syntax => run(`ts> ${syntax}`);
  const erl = syntax => run(`erl> ${syntax}`);
  const ml = syntax => run(`ml> ${syntax}`);
  const ex = syntax => run(`ex> ${syntax}`);

  test.case("0 + 1", async assert => {
    const result = ["(ok) 1"];
    assert(await hs("0 + 1")).equals(result);
    assert(await rs("0 + 1")).equals(result);
    assert(await py("0 + 1")).equals(result);
    assert(await js("0 + 1")).equals(result);
    assert(await ts("0 + 1")).equals(result);
    assert(await erl("0 + 1")).equals(result);
    assert(await ml("0 + 1")).equals(["(ok) int = 1"]);
    assert(await ex("0 + 1")).equals(result);
  });

  test.case("1 > 0", async assert => {
    const result = {
      true: ["(ok) true"],
      True: ["(ok) True"],
      bool_true: ["(ok) bool = true"],
    };
    assert(await hs("1 > 0")).equals(result.True);
    assert(await rs("1 > 0")).equals(result.true);
    assert(await py("1 > 0")).equals(result.True);
    assert(await js("1 > 0")).equals(result.true);
    assert(await ts("1 > 0")).equals(result.true);
    assert(await erl("1 > 0")).equals(result.true);
    assert(await ml("1 > 0")).equals(result.bool_true);
    assert(await ex("1 > 0")).equals(result.true);
  });

  test.case("1; 1", async assert => {
    assert(await rs("1; 1")).equals(["(ok) 1"]);
    assert(await py("1; 1")).equals(["(ok) 1 1"]);
    assert(await ts("1; 1")).equals(["(ok) 1"]);
    assert(await erl("1. 1")).equals(["(ok) 1"]);
  });

  test.case("0 + !", async assert => {
    const errorHS = ["(err) 1:6: error: parse error on input `!'"];
    assert(await hs("0 + !")).equals(errorHS);
    assert(await py("0 + !")).equals(["(err) SyntaxError: incomplete input"]);
    assert(await rs("0 + !")).equals(["(err) expected expression, found `}`"]);
    const errorJS = ["(ok) unexpected token in expression: ')'     at eval:1"];
    assert(await js("0 + !")).equals(errorJS);
    const errorTS = ["(err) [eval].ts(1,6): error TS1109: Expression expected."];
    assert(await ts("0 + !")).equals(errorTS);
    const errorML = ["(ok) Line 1, characters 6-8:",
      "1 |  0 + !;;",
      "          ^^",
      "Error: Syntax error"];
    assert(await ml("0 + !")).equals(errorML);
  });

  test.case("10 + 20 * 4.5", async assert => {
    const result = {
      ok100d: ["(ok) 100.0"],
      ok100: ["(ok) 100"],
    };
    assert(await hs("10 + 20*4.5")).equals(result.ok100d);
    assert(await py("10 + 20*4.5")).equals(result.ok100d);
    const err = ["(err) [E0277]: cannot multiply `{integer}` by `{float}`"];
    assert(await rs("10 + 20*4.5")).equals(err);
    assert(await js("10 + 20*4.5")).equals(result.ok100);
    assert(await ts("10 + 20*4.5")).equals(result.ok100);
    assert(await ml("10. +. 20. *. 4.5")).equals(["(ok) float = 100."]);
    assert(await ex("10 + 20 * 4.5")).equals(result.ok100d);
  });

  test.case("functions", async assert => {
    const r = ["(ok) 'foobar'"];
    assert(await py("foo = lambda x: f'foo{x}'; foo('bar')")).equals(r);
    assert(await py("foo = lambda x: f\"foo{x}\"; foo(\"bar\")")).equals(r);
    assert(await ml(`let m o = match o with | Some i -> string_of_int i | None -> "";; m(Some 2)`)).equals(["(ok) string = \"2\""]);
    assert(await ex("%{values: 1..5} |> Map.get(:values) |> Enum.map(& &1 * 2)")).equals(["(ok) [2, 4, 6, 8, 10]"]);
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
      "    -- Defined in `GHC.Show'",
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
      "  {-# MINIMAL showsPrec | show #-}",
    ];
    assert(await hs(":info Show")).equals(result);
  });
};
