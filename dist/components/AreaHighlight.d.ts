import { LTWHP, ViewportHighlight } from '../types';
interface Props {
    highlight: ViewportHighlight;
    onChange: (rect: LTWHP) => void;
    isScrolledTo: boolean;
}
export declare function AreaHighlight({ highlight, onChange, isScrolledTo, ...otherProps }: Props): import("react/jsx-runtime").JSX.Element;
export {};
