export const ok = {
  source: "stdout",
  output: lines => lines.join(" "),
};

export const err = {
  source: "stderr",
  output: lines => lines,
};

const last = -1;
export const sanitize = input => {
  const split = input.trim().split(";");
  return [...split.slice(0, last), `puts(${split.at(last)})`].join("\n");
};
