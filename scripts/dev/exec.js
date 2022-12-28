import { runAndExit } from 'magic-carpet';

runAndExit(`
  clear
    && : yarn add ../eslint-config-viking
    && : yarn
    && : yarn lint
    && : clear
    &&   yarn --silent compile
    &&   clear
    && : time node ./dist/tests/single-test.test.js
    &&   time yarn --silent test:new
    && : clear
    && : time yarn --silent test
    &&   yarn lint
    && : clear
    && : time yarn coverage
`);
