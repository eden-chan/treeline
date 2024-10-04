/**
 * Use rawReturn() to wrap the return value to skip the draft check and thus improve performance.
 *
 * ## Example
 *
 * ```ts
 * import { create, rawReturn } from '../index';
 *
 * const baseState = { foo: { bar: 'str' }, arr: [] };
 * const state = create(
 *   baseState,
 *   (draft) => {
 *     return rawReturn(baseState);
 *   },
 * );
 * expect(state).toBe(baseState);
 * ```
 */
export declare function rawReturn<T extends object | undefined>(value: T): T;
