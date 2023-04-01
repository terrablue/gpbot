export const ok = {
  source: "stdout",
  output: lines => lines.join(" "),
};

export const err = {
  source: "stderr",
  output: lines => lines,
};

export const sanitize = input => input.trim();
