/**
 * `create(baseState, callback, options)` to create the next state
 *
 * ## Example
 *
 * ```ts
 * import { create } from '../index';
 *
 * const baseState = { foo: { bar: 'str' }, arr: [] };
 * const state = create(
 *   baseState,
 *   (draft) => {
 *     draft.foo.bar = 'str2';
 *   },
 * );
 *
 * expect(state).toEqual({ foo: { bar: 'str2' }, arr: [] });
 * expect(state).not.toBe(baseState);
 * expect(state.foo).not.toBe(baseState.foo);
 * expect(state.arr).toBe(baseState.arr);
 * ```
 */
declare const create: {
    <T extends unknown, F extends boolean = false, O extends import("./interface").PatchesOptions = false, R extends void | Promise<void> | T | Promise<T> = void>(base: T, mutate: (draft: import("./interface").Draft<T>) => R, options?: import("./interface").ExternalOptions<O, F> | undefined): import("./interface").CreateResult<T, O, F, R>;
    <T extends unknown, F extends boolean = false, O extends import("./interface").PatchesOptions = false, R extends void | Promise<void> = void>(base: T, mutate: (draft: T) => R, options?: import("./interface").ExternalOptions<O, F> | undefined): import("./interface").CreateResult<T, O, F, R>;
    <T extends unknown, P extends any[] = [], F extends boolean = false, O extends import("./interface").PatchesOptions = false, R extends void | Promise<void> = void>(mutate: (draft: import("./interface").Draft<T>, ...args: P) => R, options?: import("./interface").ExternalOptions<O, F> | undefined): (base: T, ...args: P) => import("./interface").CreateResult<T, O, F, R>;
    <T extends unknown, O extends import("./interface").PatchesOptions = false, F extends boolean = false>(base: T, options?: import("./interface").ExternalOptions<O, F> | undefined): [import("./interface").Draft<T>, () => import("./interface").Result<T, O, F>];
};
export { create };
