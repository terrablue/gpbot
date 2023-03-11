# General programming bot

This is a bot for IRC to allow quick testing and comparing of code in different
languages.

Join `#gp` on `irc.libera.chat` to use it.

## Currently supported interpreters (see also `src/interpreters`)

* `hs` Haskell (`ghci`)
* `rs` Rust ([`runner`](https://docs.rs/crate/runner))
* `py` Python (`python`)
* `js` JavaScript ([`flog`](https://github.com/flogjs/flog))
* `ts` TypeScript ([`ts-node`](https://www.npmjs.com/package/ts-node))
* `erl` Erlang (`erlang`)
* `ml` OCaml (`ocaml`)
* `ex` Elixir (`elixir`)

## Run

Run a snippet in a language.

`js> 1 + 1`

This outputs `(ok) 2`.

## Explain

Run and explain a snippet in a language using OpenAI's API.

`js?> 1 + 1`

This outputs 

```
(ok) 2
(gpt) This code is a simple mathematical expression that adds 1 and 1 together,
resulting in the answer of 2.
```

Depending on how you set the temperature on the OpenAI configuration, this
answer may vary slightly.

## Example configuration

Create a `conf.json` in root.

```json
{
  "irc": {
    "network": "irc.libera.chat",
    "user": "gpbot",
    "channels": "#gp"
  },
  "openai": {
    "api_key": "sk-your-openai-key",
    "completion": {
      "max_tokens": 100,
      "model": "text-davinci-003",
      "temperature": 0
    },
    "review": {
      "max_tokens": 100,
      "model": "text-davinci-003",
      "temperature": 0
    }
  }
}

The `openai` key is optional. If not present, the reviews and explanations
won't work.
```
