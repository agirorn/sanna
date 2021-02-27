const { runAndExit } = require('magic-carpet');

runAndExit(`
  clear
    && time yarn --silent test
    && yarn lint
    && clear
    && time yarn coverage
`);
