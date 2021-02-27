const { runAndExit } = require('magic-carpet');

runAndExit(`
  yardman
    tsconfig.json
    index.d.ts
    package.json
    .eslintrc.js
    bin
    lib
    tests
    examples
    'yarn dev:exec'
`);
