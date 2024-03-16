#!/bin/bash

code=$(</dev/stdin)

bun -e "console.log(eval(\"${code}\"))"
