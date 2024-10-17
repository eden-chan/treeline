import { useState } from "react";
import { MouseMonitor } from "./MouseMonitor";

type Props = {
  onMouseOver: (content: JSX.Element) => void;
  popupContent: JSX.Element;
  onMouseOut: () => void;
  children: JSX.Element;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
};

export function Popup({
  onMouseOver,
  popupContent,
  onMouseOut,
  children,
  setSearchTerm,
}: Props) {
  const [mouseIn, setMouseIn] = useState(false);
  return (
    <div
      onMouseOver={() => {
        setMouseIn(true);
        setSearchTerm(popupContent.props.comment.text);
        onMouseOver(
          <MouseMonitor
            onMoveAway={() => {
              if (mouseIn) {
                console.log("mouse out");
                return;
              }

              onMouseOut();
            }}
            paddingX={60}
            paddingY={30}
          >
            {popupContent}
          </MouseMonitor>,
        );
      }}
      onMouseOut={() => {
        setMouseIn(false);
      }}
    >
      {children}
    </div>
  );
}
