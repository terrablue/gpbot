#!/bin/bash

code=$(</dev/stdin)

/usr/bin/ruby -e "${code}"
