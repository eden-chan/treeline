import { LTWHP } from '../types.js';
interface Props {
    position: {
        boundingRect: LTWHP;
        rects: Array<LTWHP>;
    };
    onClick?: () => void;
    onMouseOver?: () => void;
    onMouseOut?: () => void;
    comment: {
        emoji: string;
        text: string;
    };
    isScrolledTo: boolean;
}
export declare function Highlight({ position, onClick, onMouseOver, onMouseOut, comment, isScrolledTo, }: Props): import("react/jsx-runtime").JSX.Element;
export {};
