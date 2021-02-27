const defaultFilePatter = ['*.test.js', '*.test.ts'];

const pick = (key, args) => args.includes(key) ? args.splice(args.indexOf(key), 2)[1] : undefined;

module.exports = (args) => {
  return {
    help: args.includes('--help') || args.includes('-h'),
    bail: args.includes('--bail') || args.includes('-b'),
    testFilePattern: pick('--pattern', args) || pick('-p', args) || defaultFilePatter,
    paths: args.filter((v) => !['--bail', '-b', '--help', '-h'].includes(v))
  };
};
