export { suite, test } from './suite.js';
export { printErrorAndExit } from './output.js';
export { dirnameFrom } from './dirnameFrom.js';
export { run } from './run.js';
import sourceMapSupport from 'source-map-support';

sourceMapSupport.install();
