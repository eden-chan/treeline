import { LTWH } from '../types.js';
interface Props {
    onSelection: (startTarget: HTMLElement, boundingRect: LTWH, resetSelection: () => void) => void;
    onDragStart: () => void;
    onDragEnd: () => void;
    shouldStart: (event: MouseEvent) => boolean;
    onChange: (isVisible: boolean) => void;
}
export declare function MouseSelection({ onSelection, onDragStart, onDragEnd, shouldStart, onChange, }: Props): import("react/jsx-runtime").JSX.Element;
export {};
