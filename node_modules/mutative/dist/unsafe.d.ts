import { Options } from './interface';
export declare const checkReadable: (value: any, options: Options<any, any>, ignoreCheckDraftable?: boolean) => void;
/**
 * `unsafe(callback)` to access mutable data directly in strict mode.
 *
 * ## Example
 *
 * ```ts
 * import { create, unsafe } from '../index';
 *
 * class Foobar {
 *   bar = 1;
 * }
 *
 * const baseState = { foobar: new Foobar() };
 * const state = create(
 *   baseState,
 *   (draft) => {
 *    unsafe(() => {
 *      draft.foobar.bar = 2;
 *    });
 *   },
 *   {
 *     strict: true,
 *   }
 * );
 *
 * expect(state).toBe(baseState);
 * expect(state.foobar).toBe(baseState.foobar);
 * expect(state.foobar.bar).toBe(2);
 * ```
 */
export declare function unsafe<T>(callback: () => T): T;
