import { LTWHP } from '../types';
interface Props {
    children: JSX.Element | null;
    style: {
        top: number;
        left: number;
        bottom: number;
    };
    scrollTop: number;
    pageBoundingRect: LTWHP;
}
export declare function TipContainer({ children, style, scrollTop, pageBoundingRect, }: Props): import("react/jsx-runtime").JSX.Element;
export {};
