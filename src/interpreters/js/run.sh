#!/bin/bash

code=$(</dev/stdin)

/app/flog -e "log(${code})"
