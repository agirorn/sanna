const partial = require('partial-compare');
const assert = require('assert');

const assertDefined = (actual) => {
  if (actual === undefined) {
    throw new assert.AssertionError({
      message: `The value (${actual}) should have been defined`,
      actual,
      expected: [],
    });
  }
};

const assertPartial = (actual, expected) => {
  if (!partial(actual, expected)) {
    throw new assert.AssertionError({
      message: 'Object dose not contain expected values',
      expected,
      actual,
    });
  }
};

module.exports = {
  assertDefined,
  assertPartial,
};
