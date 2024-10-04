import { DraftType, Mark, ProxyDraft } from '../interface';
export declare function latest<T = any>(proxyDraft: ProxyDraft): T;
/**
 * Check if the value is a draft
 */
export declare function isDraft(target: any): boolean;
export declare function getProxyDraft<T extends any>(value: T): ProxyDraft | null;
export declare function getValue<T extends object>(value: T): T;
/**
 * Check if a value is draftable
 */
export declare function isDraftable(value: any, options?: {
    mark?: Mark<any, any>;
}): boolean;
export declare function getPath(target: ProxyDraft, path?: any[]): (string | number | object)[] | null;
export declare function getType(target: any): DraftType;
export declare function get(target: any, key: PropertyKey): any;
export declare function set(target: any, key: PropertyKey, value: any): void;
export declare function peek(target: any, key: PropertyKey): any;
export declare function isEqual(x: any, y: any): boolean;
export declare function revokeProxy(proxyDraft: ProxyDraft | null): void;
export declare function escapePath(path: string[], pathAsArray: boolean): string | string[];
export declare function unescapePath(path: string | (string | number)[]): (string | number)[];
export declare function resolvePath(base: any, path: (string | number)[]): any;
