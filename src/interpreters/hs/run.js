const last = -1;

const prompt = 6;
const result = 2;
export const ok = {
  source: "stdout",
  output: lines =>
    [lines[1].slice(prompt)].concat(lines.slice(result, last)),
};

const prefix = 14;
export const err = {
  source: "stderr",
  output: lines => lines.at(last).slice(prefix),
};

export const sanitize = input => input;
