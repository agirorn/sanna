import partial from 'partial-compare';
import assert from 'assert';

export const assertDefined = (actual) => {
  if (actual === undefined) {
    throw new assert.AssertionError({
      message: `The value (${actual}) should have been defined`,
      actual,
      expected: [],
    });
  }
};

export const assertPartial = (actual, expected) => {
  if (!partial(actual, expected)) {
    throw new assert.AssertionError({
      message: 'Object dose not contain expected values',
      expected,
      actual,
    });
  }
};
