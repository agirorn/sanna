const defaultFilePatter = ['*.test.js', '*.test.ts'];

const pick = (key: string, args: string[]) =>
  args.includes(key) ? args.splice(args.indexOf(key), 2)[1] : undefined;

export const argsParser = (args: string[]) => {
  return {
    help: args.includes('--help') || args.includes('-h'),
    bail: args.includes('--bail') || args.includes('-b'),
    testFilePattern:
      pick('--pattern', args) || pick('-p', args) || defaultFilePatter,
    paths: args.filter((v) => !['--bail', '-b', '--help', '-h'].includes(v)),
  };
};
