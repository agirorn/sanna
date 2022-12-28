// eslint-disable-next-line no-console
export const output = console;
export const printErrorLine = output.error.bind(output);
export const printLine = (text: unknown = '', indent = 0) =>
  output.log(leftPadd(`${text}`, indent));

const SPACE = ' ';
const leftPadd = (text: string, count = 2, fill = SPACE) => {
  const filling = new Array(count).fill(fill).join('');
  return text
    .split('\n')
    .map((l) => `${filling}${l}`)
    .join('\n');
};

export const printErrorAndExit = (error: Error, exitCode = 1) => {
  printErrorLine('error', error);
  // eslint-disable-next-line no-process-exit
  process.exit(exitCode);
};
