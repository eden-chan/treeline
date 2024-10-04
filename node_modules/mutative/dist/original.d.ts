/**
 * `original(draft)` to get original state in the draft mutation function.
 *
 * ## Example
 *
 * ```ts
 * import { create, original } from '../index';
 *
 * const baseState = { foo: { bar: 'str' }, arr: [] };
 * const state = create(
 *   baseState,
 *   (draft) => {
 *     draft.foo.bar = 'str2';
 *     expect(original(draft.foo)).toEqual({ bar: 'str' });
 *   }
 * );
 * ```
 */
export declare function original<T>(target: T): T;
