import { iteratorSymbol } from './constant';
export declare const mapHandler: {
    readonly size: number;
    has(key: any): boolean;
    set(key: any, value: any): any;
    delete(key: any): boolean;
    clear(): void;
    forEach(callback: (value: any, key: any, self: any) => void, thisArg?: any): void;
    get(key: any): any;
    keys(): IterableIterator<any>;
    values(): IterableIterator<any>;
    entries(): IterableIterator<[any, any]>;
    [Symbol.iterator](): IterableIterator<[any, any]>;
};
export declare const mapHandlerKeys: (string | symbol)[];
