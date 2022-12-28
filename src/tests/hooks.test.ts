import { suite } from '../index.js';
import assert from 'assert';

const test = suite('hooks');
interface State {
  value: boolean;
}

let state: State;

test.before(() => {
  state = {
    value: true,
  };
});

test('the hook', () => {
  assert(state.value);
  state.value = false;
});

test.after(() => {
  assert(!state.value);
});
