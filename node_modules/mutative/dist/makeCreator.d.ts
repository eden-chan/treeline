import { CreateResult, Draft, ExternalOptions, PatchesOptions, Result } from './interface';
type MakeCreator = <_F extends boolean = false, _O extends PatchesOptions = false>(options?: ExternalOptions<_O, _F>) => {
    <T extends any, F extends boolean = _F, O extends PatchesOptions = _O, R extends void | Promise<void> | T | Promise<T> = void>(base: T, mutate: (draft: Draft<T>) => R, options?: ExternalOptions<O, F>): CreateResult<T, O, F, R>;
    <T extends any, F extends boolean = _F, O extends PatchesOptions = _O, R extends void | Promise<void> = void>(base: T, mutate: (draft: T) => R, options?: ExternalOptions<O, F>): CreateResult<T, O, F, R>;
    <T extends any, P extends any[] = [], F extends boolean = _F, O extends PatchesOptions = _O, R extends void | Promise<void> = void>(mutate: (draft: Draft<T>, ...args: P) => R, options?: ExternalOptions<O, F>): (base: T, ...args: P) => CreateResult<T, O, F, R>;
    <T extends any, O extends PatchesOptions = _O, F extends boolean = _F>(base: T, options?: ExternalOptions<O, F>): [Draft<T>, () => Result<T, O, F>];
};
/**
 * `makeCreator(options)` to make a creator function.
 *
 * ## Example
 *
 * ```ts
 * import { makeCreator } from '../index';
 *
 * const baseState = { foo: { bar: 'str' }, arr: [] };
 * const create = makeCreator({ enableAutoFreeze: true });
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
 * expect(Object.isFrozen(state)).toBeTruthy();
 * ```
 */
export declare const makeCreator: MakeCreator;
export {};
