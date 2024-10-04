import { Options, Patches } from './interface';
/**
 * `apply(state, patches)` to apply patches to state
 *
 * ## Example
 *
 * ```ts
 * import { create, apply } from '../index';
 *
 * const baseState = { foo: { bar: 'str' }, arr: [] };
 * const [state, patches] = create(
 *   baseState,
 *   (draft) => {
 *     draft.foo.bar = 'str2';
 *   },
 *   { enablePatches: true }
 * );
 * expect(state).toEqual({ foo: { bar: 'str2' }, arr: [] });
 * expect(patches).toEqual([{ op: 'replace', path: ['foo', 'bar'], value: 'str2' }]);
 * expect(state).toEqual(apply(baseState, patches));
 * ```
 */
export declare function apply<T extends object, F extends boolean = false>(state: T, patches: Patches, applyOptions?: Pick<Options<boolean, F>, Exclude<keyof Options<boolean, F>, 'enablePatches'>>): T | (F extends true ? import("./interface").Immutable<T> : T);
