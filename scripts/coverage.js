import { runAndExit } from 'magic-carpet';

runAndExit(`
  c8
    --reporter text-summary
    --reporter html
    yarn test
`);
