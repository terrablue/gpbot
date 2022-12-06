const last = -1;

export const ok = {
  source: "stdout",
  output: lines => {
    const [,,, line, ...rest] = lines;
    if (rest.length > 0 && rest[rest.length-1].slice(0, 5) === "Error") {
      return rest[rest.length-1].slice(7);
    }
    return line.slice(4);
  },
};

const prefix = 0;
export const err = {
  source: "stderr",
  output: lines => lines.at(last).slice(prefix),
};

export const sanitize = input => {
  if (!input.endsWith(";;")) {
    return `${input};;`;
  }

  return input;
};
