import { runAndExit } from 'magic-carpet';

runAndExit(`
  yardman
    tsconfig.json
    index.d.ts
    tsconfig.json
    .eslintrc.json
    package.json
    bin
    lib
    src
    tests
    scripts
    examples
    /Users/agirorn/code/eslint-config-viking/dist
    'yarn dev:exec'
`);
