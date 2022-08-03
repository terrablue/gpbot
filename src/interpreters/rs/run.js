export const ok = {
  source: "stdout",
  output: lines => lines[0],
};

const criticalSlice = 2;
const formatError = message =>
  message.startsWith("[") ? message : message.slice(criticalSlice);

const prefix = 5;
export const err = {
  source: "stderr",
  output: lines => formatError(lines[0].slice(prefix)),
};

const last = -1;
export const sanitize = input =>
  `{${input.endsWith(";") ? input.slice(0, last) : input}}`;
