import { iteratorSymbol } from './constant';
export declare const setHandler: {
    readonly size: number;
    has(value: any): boolean;
    add(value: any): any;
    delete(value: any): boolean;
    clear(): void;
    values(): IterableIterator<any>;
    entries(): IterableIterator<[any, any]>;
    keys(): IterableIterator<any>;
    [Symbol.iterator](): IterableIterator<any>;
    forEach(callback: any, thisArg?: any): void;
};
export declare const setHandlerKeys: (string | symbol)[];
