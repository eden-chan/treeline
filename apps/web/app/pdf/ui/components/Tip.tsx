'use client'
import React, { useState, useEffect } from "react";

import "../style/Tip.css";

interface Props {
  onConfirm: (comment: { text: string; emoji: string }) => void;
  onOpen: () => void;
  onUpdate?: () => void;
}

export const Tip: React.FC<Props> = ({ onConfirm, onOpen, onUpdate }) => {
  const [compact, setCompact] = useState(true);
  const [text, setText] = useState("");
  const [emoji, setEmoji] = useState("");

  useEffect(() => {
    if (onUpdate) {
      onUpdate();
    }
  }, [compact, onUpdate]);

  return (
    <div className="Tip">
      {compact ? (
        <div
          className="Tip__compact"
          onClick={() => {
            onOpen();
            setCompact(false);
          }}
        >
          Add highlight
        </div>
      ) : (
        <form
          className="Tip__card"
          onSubmit={(event) => {
            event.preventDefault();
            onConfirm({ text, emoji });
          }}
        >
          <div>
            <textarea
              placeholder="Your comment"
              autoFocus
              value={text}
              onChange={(event) => setText(event.target.value)}
              ref={(node) => {
                if (node) {
                  node.focus();
                }
              }}
            />
            <div>
              {["💩", "😱", "😍", "🔥", "😳", "⚠️"].map((_emoji) => (
                <label key={_emoji}>
                  <input
                    checked={emoji === _emoji}
                    type="radio"
                    name="emoji"
                    value={_emoji}
                    onChange={(event) => setEmoji(event.target.value)}
                  />
                  {_emoji}
                </label>
              ))}
            </div>
          </div>
          <div>
            <input type="submit" className="text-black" value="Save" />
          </div>
        </form>
      )}
    </div>
  );
};

export default Tip;

