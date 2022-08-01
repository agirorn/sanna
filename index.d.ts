interface Test { (context: any): any; }
interface AsyncTest { (context: any): Promise<any>; }
interface Hook { (context: any): any; }
interface AsyncHook { (context: any): Promise<any>; }
interface TestSuite {
  (title: string, callback: Test|AsyncTest): any;
  setup: (callback: Hook|AsyncHook) => Promise<any>;
  teardown: (callback: Hook|AsyncHook) => Promise<any>;
  before: (callback: Hook|AsyncHook) => Promise<any>;
  after: (callback: Hook|AsyncHook) => Promise<any>;
}
export function suite(title: string): TestSuite;
