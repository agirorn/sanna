interface Test { (context: any): any; }
interface AsyncTest { (context: any): Promise<any>; }
interface Hook { (context: any): any; }
interface AsyncHook { (context: any): Promise<any>; }
interface TestSuite {
  (title: string, callback: Test|AsyncTest): any;
  setup: (callback: Hook|AsyncHook) => void;
  teardown: (callback: Hook|AsyncHook) => void;
  before: (callback: Hook|AsyncHook) => void;
  after: (callback: Hook|AsyncHook) => void;
}
export function suite(title: string): TestSuite;
