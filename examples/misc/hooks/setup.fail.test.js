const { suite } = require('../../..');
const assert = require('assert');

const s = suite('setup should fail');
s.setup(() => {
  throw new Error('bad code');
});

s('Assert true is true', async () => {
  assert(true);
});

const t = suite('setup should fail');
t.setup(() => {
  throw new Error('bad code');
});

t('Assert true is true', async () => {
  assert(true);
});
