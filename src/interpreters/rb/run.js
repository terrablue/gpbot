export const ok = {
  source: "stdout",
  output: lines => lines.join(" "),
};

const last = -1;
export const err = {
  source: "stderr",
  output: lines => lines,
};

export const sanitize = input => input
  .trim();
