import { Finalities, Patches, ProxyDraft, Options } from './interface';
export declare function createDraft<T extends object>(createDraftOptions: {
    original: T;
    parentDraft?: ProxyDraft | null;
    key?: string | number | symbol;
    finalities: Finalities;
    options: Options<any, any>;
}): T;
export declare function finalizeDraft<T>(result: T, returnedValue: [T] | [], patches?: Patches, inversePatches?: Patches, enableAutoFreeze?: boolean): [T, Patches | undefined, Patches | undefined];
