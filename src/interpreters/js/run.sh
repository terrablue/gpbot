#!/bin/bash

code=$(</dev/stdin)

bun -e "console.log(JSON.stringify(eval(\"${code}\")))"
