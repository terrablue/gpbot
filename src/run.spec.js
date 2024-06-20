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
  const rb = syntax => run(`rb> ${syntax}`);

  const r = {
    _1: ["(ok) 1"],
    _1_1: ["(ok) 1 1"],
    true: ["(ok) true"],
    True: ["(ok) True"],
    bool_true: ["(ok) bool = true"],
    _100d: ["(ok) 100.0"],
    _100: ["(ok) 100"],
  };

  test.case("haskell", async assert => {
    assert(await hs("0 + 1")).equals(r._1);
    assert(await hs("1 > 0")).equals(r.True);
    const error = ["(err) 1:5: error: parse error on input `!'"];
    assert(await hs("0 + !")).equals(error);
    assert(await hs("10 + 20*4.5")).equals(r._100d);
    const multiline = [
      "(ok) type Show :: * -> Constraint",
      "class Show a where",
      "  ...",
      "  show :: a -> String",
      "  ...",
      "    -- Defined in `GHC.Show'",
    ];
    assert(await hs(":info show")).equals(multiline);
    const list = [
      "(ok) type Show :: * -> Constraint",
      "class Show a where",
      "  showsPrec :: Int -> a -> ShowS",
      "  show :: a -> String",
      "  showList :: [a] -> ShowS",
      "  {-# MINIMAL showsPrec | show #-}",
    ];
    assert(await hs(":info Show")).equals(list);
  });

  test.case("rust", async assert => {
    assert(await rs("0 + 1")).equals(r._1);
    assert(await rs("1 > 0")).equals(r.true);
    assert(await rs("1; 1")).equals(r._1);
    const error0 = ["(err) expected expression, found `}`"];
    assert(await rs("0 + !")).equals(error0);
    const error1 = ["(err) [E0277]: cannot multiply `{integer}` by `{float}`"];
    assert(await rs("10 + 20*4.5")).equals(error1);
    const secret = ["(ok) \"secret\""];
    assert(await rs("let guess = \"secret\"; guess")).equals(secret);
    assert(await rs("let guess = \"secret\"; guess;")).equals(secret);
  });

  test.case("python", async assert => {
    assert(await py("0 + 1")).equals(r._1);
    assert(await py("1 > 0")).equals(r.True);
    assert(await py("1; 1")).equals(r._1_1);
    assert(await py("0 + !")).equals(["(err) SyntaxError: invalid syntax"]);
    assert(await py("10 + 20*4.5")).equals(r._100d);
    const fb = ["(ok) 'foobar'"];
    assert(await py("foo = lambda x: f'foo{x}'; foo('bar')")).equals(fb);
    assert(await py("foo = lambda x: f\"foo{x}\"; foo(\"bar\")")).equals(fb);
  });

  test.case("javascript", async assert => {
    assert(await js("0 + 1")).equals(r._1);
    assert(await js("1 > 0")).equals(r.true);
    const error = ["(err)       at /app/[eval]:1:28"];
    assert(await js("0 + !")).equals(error);
    assert(await js("10 + 20*4.5")).equals(r._100);
  });

  test.case("typescript", async assert => {
    assert(await ts("0 + 1")).equals(r._1);
    assert(await ts("1 > 0")).equals(r.true);
    assert(await ts("1; 1")).equals(r._1);
    const error = ["(err) [eval].ts(1,6): error TS1109: Expression expected."];
    assert(await ts("0 + !")).equals(error);
    assert(await ts("10 + 20*4.5")).equals(r._100);
    const hw = ["(ok) hello world"];
    assert(await ts("'hello world'")).equals(hw);
    assert(await ts("\"hello world\"")).equals(hw);
  });

  test.case("erlang", async assert => {
    assert(await erl("0 + 1")).equals(r._1);
    assert(await erl("1 > 0")).equals(r.true);
    assert(await erl("1. 1")).equals(r._1);
  });

  test.case("ocaml", async assert => {
    assert(await ml("0 + 1")).equals(["(ok) int = 1"]);
    assert(await ml("1 > 0")).equals(r.bool_true);
    const error = ["(ok) Line 1, characters 5-7:",
      "1 | 0 + !;;",
      "         ^^",
      "Error: Syntax error"];
    assert(await ml("0 + !")).equals(error);
    assert(await ml("10. +. 20. *. 4.5")).equals(["(ok) float = 100."]);
    assert(await ml(`let m o = match o with | Some i -> string_of_int i | None -> "";; m(Some 2)`)).equals(["(ok) string = \"2\""]);
  });

  test.case("elixir", async assert => {
    assert(await ex("0 + 1")).equals(r._1);
    assert(await ex("1 > 0")).equals(r.true);
    assert(await ex("10 + 20 * 4.5")).equals(r._100d);
    assert(await ex("%{values: 1..5} |> Map.get(:values) |> Enum.map(& &1 * 2)")).equals(["(ok) [2, 4, 6, 8, 10]"]);
  });

  test.case("ruby", async assert => {
    assert(await rb("0 + 1")).equals(r._1);
    assert(await rb("1 > 0")).equals(r.true);
    const error = ["(err) -e:1: syntax error, unexpected ')'",
      "puts(0 + !)",
      "          ^"];
    assert(await rb("0 + !")).equals(error);
    assert(await rb("a = 1; a")).equals(r._1);
  });

  test.case("failure", async assert => {
    assert(await run("js> 0 + 1")).throws();
    assert(await run("0 + 1")).throws();
  });
};
