#!/bin/bash

code=$(</dev/stdin)

/app/node_modules/.bin/ts-node -p -e "${code}"
