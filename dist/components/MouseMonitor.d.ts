import { Component } from 'react';
interface Props {
    onMoveAway: () => void;
    paddingX: number;
    paddingY: number;
    children: JSX.Element;
}
export declare class MouseMonitor extends Component<Props> {
    container: HTMLDivElement | null;
    unsubscribe: () => void;
    onMouseMove: (event: MouseEvent) => void;
    attachRef: (ref: HTMLDivElement | null) => void;
    render(): import("react/jsx-runtime").JSX.Element;
}
export {};
