// Missing test
import { suite } from 'sanna';
import assert from 'assert';
import { pEvent } from 'p-event';
import { EventEmitter } from 'events';

const test = suite('True values');

test('Test if true realy is true', async () => {
  assert(true);
  const events = new EventEmitter();
  await pEvent(events, 'the-event');
}, 500);
