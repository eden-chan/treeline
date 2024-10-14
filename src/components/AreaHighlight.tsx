import { Rnd } from "react-rnd";
import { getPageFromElement } from "../lib/pdfjs-dom";
import styles from "../style/AreaHighlight.module.css";
import type { LTWHP, ViewportHighlight } from "../types";
import { HighlightType } from "../../example/src/utils/highlightTypes";

type Props = {
  highlight: ViewportHighlight;
  onChange: (rect: LTWHP) => void;
  isScrolledTo: boolean;
  highlightType: string;
};

export function AreaHighlight({
  highlight,
  onChange,
  isScrolledTo,
  highlightType,
  ...otherProps
}: Props) {
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
      className={`${styles.areaHighlight} ${
        isScrolledTo ? styles.scrolledTo : ""
      }`}
    >
      <Rnd
        className={`${styles.part} ${highlightClass}`}
        onDragStop={(_, data) => {
          const boundingRect: LTWHP = {
            ...highlight.position.boundingRect,
            top: data.y,
            left: data.x,
          };
          onChange(boundingRect);
        }}
        onResizeStop={(_mouseEvent, _direction, ref, _delta, position) => {
          const boundingRect: LTWHP = {
            top: position.y,
            left: position.x,
            width: ref.offsetWidth,
            height: ref.offsetHeight,
            pageNumber: getPageFromElement(ref)?.number || -1,
          };
          onChange(boundingRect);
        }}
        position={{
          x: highlight.position.boundingRect.left,
          y: highlight.position.boundingRect.top,
        }}
        size={{
          width: highlight.position.boundingRect.width,
          height: highlight.position.boundingRect.height,
        }}
        onClick={(event: React.MouseEvent) => {
          event.stopPropagation();
          event.preventDefault();
        }}
        {...otherProps}
      />
    </div>
  );
}
