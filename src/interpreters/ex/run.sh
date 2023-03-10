#!/bin/bash

code=$(</dev/stdin)

/usr/bin/elixir --eval "IO.puts(${code})"
