import { HighlightType } from '../../example/src/utils/highlightTypes.js';
import styles from "../style/Highlight.module.css";
import type { LTWHP } from "../types.js";

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
  highlightType: string;
}

export function Highlight({
  position,
  onClick,
  onMouseOver,
  onMouseOut,
  comment,
  isScrolledTo,
  highlightType
}: Props) {
  const { rects, boundingRect } = position;

  let highlightClass = '';
  if (highlightType === HighlightType.CURRENT_USER) {
    highlightClass = styles.currentUser;
  } else if (highlightType === HighlightType.ANONYMOUS_USER) {
    highlightClass = styles.anonymousUser;
  } else if (highlightType === HighlightType.OTHER_REGISTERED_USER) {
    highlightClass = styles.otherRegisteredUser;
  }

  return (
    <div
      className={`Highlight ${styles.highlight} ${isScrolledTo ? styles.scrolledTo : ""}`}
    >
      {comment ? (
        <div
          className={`Highlight__emoji ${styles.emoji}`}
          style={{
            left: 20,
            top: boundingRect.top,
          }}
        >
          {comment.emoji}
        </div>
      ) : null}
      <div className={`Highlight__parts ${styles.parts} `}>
        {rects.map((rect, index) => (
          <div
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
            onClick={onClick}
            // biome-ignore lint/suspicious/noArrayIndexKey: We can use position hash at some point in future
            key={index}
            style={rect}
            className={`Highlight__part ${styles.part} ${highlightClass}`}
          />
        ))}
      </div>
    </div>
  );
}
