export interface IFailed {
  title: string;
  code: number | string | unknown;
  stack: string;
  diff: unknown;
  path: string;
}

export interface IReport {
  failed: IFailed[];
  passed: number;
}
