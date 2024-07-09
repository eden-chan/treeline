import { cn } from '@/lib/utils';
import { RenderHighlightsProps } from '@react-pdf-viewer/highlight';
import { v4 as uuidv4 } from 'uuid';

type Props = {
	props: RenderHighlightsProps;
	area: {
		height: number;
		left: number;
		pageIndex: number;
		top: number;
		width: number;
	};

	className: string;
}

export const HighlightedArea = ({ area, props, className }: Props) => (
	<div
		key={uuidv4()}
		onClick={(e) => {
			e.stopPropagation()
			// openForest()
		}}
		className={cn("z-10", className)}
		style={Object.assign(
			{},
			props.getCssProperties(area, props.rotation),
		)}
	/>
);