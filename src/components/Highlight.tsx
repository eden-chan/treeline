import { HighlightType } from "../../example/src/utils/highlightTypes.js";
import styles from "../style/Highlight.module.css";
import type { LTWHP } from "../types.js";

type Props = {
	position: {
		boundingRect: LTWHP;
		rects: Array<LTWHP>;
	};
	onClick?: () => void;
	comment: {
		emoji: string;
		text: string;
	};
	isScrolledTo: boolean;
	highlightType: string;
	zIndex: number; // Add this prop
};

export function Highlight({
	position,
	onClick,
	comment,
	isScrolledTo,
	highlightType,
	zIndex, // Add this prop
}: Props) {
	const { rects, boundingRect } = position;

	let highlightClass = "";
	if (highlightType === HighlightType.CURRENT_USER) {
		highlightClass = styles.currentUser;
	} else if (highlightType === HighlightType.ANONYMOUS_USER) {
		highlightClass = styles.anonymousUser;
	} else if (highlightType === HighlightType.OTHER_REGISTERED_USER) {
		highlightClass = styles.otherRegisteredUser;
	}

	return (
		<div
			className={`${styles.highlight} ${isScrolledTo ? styles.scrolledTo : ""} ${highlightClass}`}
			style={{ zIndex }} // Add this style
		>
			{comment ? (
				<div
					className={`${styles.emoji}`}
					style={{
						left: 20,
						top: boundingRect.top,
					}}
				>
					{comment.emoji}
				</div>
			) : null}
			<div className={`${styles.parts}`}>
				{rects.map((rect, index) => (
					<div
						onClick={onClick}
						onKeyDown={(event) => {
							if (event.key === "Enter") {
								onClick?.();
							}
						}}
						role="button"
						tabIndex={0}
						// biome-ignore lint/suspicious/noArrayIndexKey: We can use position hash at some point in future
						key={index}
						style={rect}
						className={`${styles.part}`}
					/>
				))}
			</div>
		</div>
	);
}
