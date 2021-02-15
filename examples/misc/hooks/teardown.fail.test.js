const { suite } = require('../../..');
const assert = require('assert');

const s = suite('setup should fail');
s.teardown(() => {
  throw new Error('bad code');
});

s('Assert true is true', async () => {
  assert(true);
});
