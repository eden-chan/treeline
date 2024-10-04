import { Options, PatchesOptions, Result } from './interface';
export declare function draftify<T extends object, O extends PatchesOptions = false, F extends boolean = false>(baseState: T, options: Options<O, F>): [T, (returnedValue: [T] | []) => Result<T, O, F>];
