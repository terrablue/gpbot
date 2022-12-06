const last = -1;

export const ok = {
  source: "stdout",
  output: lines => {
    const body = lines.slice(2).filter(([first]) => first !== "#");
    const result = body.find(line => line.startsWith("-"));
    if (result !== undefined) {
      return result.slice(4);
    } else {
      return body;
    }
  },
};

const prefix = 0;
export const err = {
  source: "stderr",
  output: lines => {
    console.log("stderr", lines);
    return lines.at(last).slice(prefix);
  }
};

export const sanitize = input => {
  const sanitized = input.replaceAll(";;", ";;\n");

  return `${sanitized};;`;
};
