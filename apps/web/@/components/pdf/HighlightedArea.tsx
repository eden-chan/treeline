import { cn } from '@/lib/utils';

export const HighlightedArea = ({ area, props, idx, className }) => (
    <div
        key={idx}
        className={cn("highlight-area z-10 bg-yellow-400 bg-opacity-40", className)}
        style={Object.assign(
            {},
            props.getCssProperties(area, props.rotation),
        )}
    />
);