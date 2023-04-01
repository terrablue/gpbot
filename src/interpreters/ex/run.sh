#!/bin/bash

code=$(</dev/stdin)

/usr/bin/elixir --eval "(${code}) |> IO.inspect"
