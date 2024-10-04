import { Patches, ProxyDraft } from '../interface';
export declare function handleValue(target: any, handledSet: WeakSet<any>, options?: ProxyDraft['options']): void;
export declare function finalizeAssigned(proxyDraft: ProxyDraft, key: PropertyKey): void;
export type GeneratePatches = (proxyState: ProxyDraft, basePath: any[], patches: Patches, inversePatches: Patches) => void;
export declare function finalizeSetValue(target: ProxyDraft): void;
export declare function finalizePatches(target: ProxyDraft, generatePatches: GeneratePatches, patches?: Patches, inversePatches?: Patches): void;
export declare function markFinalization(target: ProxyDraft, key: any, value: any, generatePatches: GeneratePatches): void;
