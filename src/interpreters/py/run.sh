#!/bin/bash

in=$(</dev/stdin)
code=$(cat <<EOF
import code
from code import InteractiveInterpreter

source = "${in}"
compile_code = code.compile_command(source)

InteractiveInterpreter().runcode(compile_code)
EOF
)

# -I isolated mode (implies -E and -s)
# -S disable import of the module site
python -I -S -c "${code}"
