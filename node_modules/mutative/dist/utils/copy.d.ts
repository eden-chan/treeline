import type { Options, ProxyDraft } from '../interface';
export declare function shallowCopy(original: any, options?: Options<any, any>): any;
export declare function ensureShallowCopy(target: ProxyDraft): void;
declare function deepClone<T>(target: T): T;
export declare function cloneIfNeeded<T>(target: T): T;
export { deepClone };
