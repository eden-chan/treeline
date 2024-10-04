interface Props {
    onMouseOver: (content: JSX.Element) => void;
    popupContent: JSX.Element;
    onMouseOut: () => void;
    children: JSX.Element;
}
export declare function Popup({ onMouseOver, popupContent, onMouseOut, children, }: Props): import("react/jsx-runtime").JSX.Element;
export {};
