"use client";
import React, { useState } from "react";

import "../../style/Tip.css";

type QuestionProps = {
  handleSubmit: (prompt: string) => void;
};

export const Question = ({ handleSubmit }: QuestionProps) => {
  const [text, setText] = useState("");

  return (
    <form
      className="Tip__card"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(text);
      }}
    >
      <div>
        <textarea
          className="text-black"
          placeholder="Your question"
          value={text}
          onChange={(e) => setText(e.target.value)}
          autoFocus
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
