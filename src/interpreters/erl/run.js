const last = -1;

export const ok = {
  source: "stdout",
  output: lines => {
    const [,, line] = lines;
    const index = line.lastIndexOf(">");
    return line.slice(index + 2);
  },
};

const prefix = 0;
export const err = {
  source: "stderr",
  output: lines => lines.at(last).slice(prefix),
};

export const sanitize = input => {
  if (!input.endsWith(".")) {
    return `${input}.`;
  }

  return input;
};
