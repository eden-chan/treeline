import React, { useState } from "react";

import "../../style/Tip.css";

type QuestionProps = {
  onConfirm: (arg: { text: string }) => void;
};

export const Question = ({ onConfirm }: QuestionProps) => {
  const [text, setText] = useState("");

  return (
    <form
      className="Tip__card"
      onSubmit={(event) => {
        event.preventDefault();
        onConfirm({ text });
      }}
    >
      <div>
        <textarea
          className="text-black"
          placeholder="Your question"
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          ref={(node) => {
            if (node) {
              node.focus();
            }
          }}
        />
      </div>
      <div>
        <input type="submit" className="text-black" value="Save" />
      </div>
    </form>
  );
};
