import { suite } from '..';
import invert from 'invert-promise';
import { command as shell } from 'execa';
import assert from 'assert';

const runToFailure = async (cmd) => {
  const cli = shell(cmd);
  let stderr = '';
  for await (const line of cli.stderr) {
    stderr += line.toString();
  }

  await invert(cli);
  return {
    exitCode: cli.exitCode,
    stderr,
  };
};

const test = suite('Not test found');
['./bin/sanna.js', 'node ./tests/fixture/has-has-no-tests.test.js'].forEach(
  (cmd) => {
    test('exits with 1', async () => {
      const { stderr, exitCode } = await runToFailure(cmd);
      assert.equal(exitCode, 1);
      assert.match(stderr, /No tests found/);
    });
  }
);
