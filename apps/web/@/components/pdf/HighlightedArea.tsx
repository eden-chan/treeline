import { cn } from '@/lib/utils';
import { RenderHighlightsProps } from '@react-pdf-viewer/highlight';

type Props = {
	props: RenderHighlightsProps;
	area: {
		height: number;
		left: number;
		pageIndex: number;
		top: number;
		width: number;
	};
	idx: number;
	className: string;
	openForest: () => void;
}

export const HighlightedArea = ({ area, props, idx, className, openForest }: Props) => (
	<div
		key={idx}
		onClick={(e) => {
			e.stopPropagation()
			openForest()
		}}
		className={cn("highlight-area z-10 bg-yellow-400 bg-opacity-40", className)}
		style={Object.assign(
			{},
			props.getCssProperties(area, props.rotation),
		)}
	/>
);