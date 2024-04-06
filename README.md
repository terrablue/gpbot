# General programmers bot
This is a bot for IRC to allow quick testing and comparing of code in different
languages.

## Currently supported interpreters (see also `src/interpreters`)

* `hs` Haskell (`ghci`)
* `rs` Rust ([`runner`](https://docs.rs/crate/runner))
* `py` Python (`python`)
* `js` JavaScript ([`bun`](https://bun.sh))
* `ts` TypeScript ([`ts-node`](https://www.npmjs.com/package/ts-node))
* `erl` Erlang (`erlang`)
* `ml` OCaml (`ocaml`)
* `ex` Elixir (`elixir`)
* `rb` Ruby (`ruby`)

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

Depending on how you set the `temperature` (see below) for OpenAI, this answer
may vary slightly.

## Review

Run a code review using OpenAI's API. Currently supported are `dpaste.com`,
`dpaste.org` and `github.com`.

`!review https://github.com/terrablue/gpbot/blob/master/package.json`

A typical output, depending on the `temperature` (see below) set for OpenAI,
may be

```
This code appears to be a package.json file for a project called gpbot. It
contains information about the project, such as the author, repository,
description, license, type, and scripts. It also lists the dependencies and
devDependencies that are required for the project.
```

You may also pass additional comments for OpenAI in order to influence how it
analyzes the code. This can come in handy if you want it to look at just one
segment of a larger file.

`!review https://github.com/terrablue/gpbot/blob/master/package.json license?`

A typical output should be

`This code is licensed under the MIT license.`

## React to GitHub webhooks

The bot can react to different webhook events. Currently supported are issue
creation, commit pushes, and commenting on commits.

The bot uses the POST `/` path to receive those webhook events, generate
shortened links to GitHub and report the event in the given channels. If you're
running your own instance of gpbot, make sure to enter your fully qualified
domain under `baseuri`.

To have the bot receive webhook events, create a webhook in your repository,
add a secret, and set the webhook to send any combination of the following
events:

* Issues (`issues`)
* Pushes (`push`)
* Commit comments (`commit_comment`)
* Releases (`release`)

In your configuration file, add the repository under `github` (see example) and
configure secret and channels to report to. If you have several repositories
monitored in the same channel, you can assign them different colors (00 to 15).

## Example configuration

Create a `conf.json` in root.

```json
{
  "irc": {
    "network": "irc.libera.chat",
    "user": "gpbot",
    "channels": "#gpbot"
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
  },
  "baseuri": "https://gpbot.org",
  "github": {
    "terrablue/gpbot": {
      "color": "07",
      "secret": "your-web-hook-secret",
      "channels": ["#gpbot"]
    }
  }
}
```

The `openai` key is optional. If not present, the reviews and explanations
won't work.
