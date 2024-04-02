"use client";
import React, { useState } from "react";

import { useAskHighlight } from "@src/context/ask-highlight-context";

import "../../style/Tip.css";

type QuestionProps = {
  handleSubmit: (prompt: string) => void;
};

export const Question = ({ handleSubmit }: QuestionProps) => {
  const { input, handleInputChange, handleSubmit: askAi } = useAskHighlight();

  return (
    <form
      className="Tip__card"
      onSubmit={(e) => {
        askAi(e);
        handleSubmit(input);
      }}
    >
      <div>
        <textarea
          className="text-black"
          placeholder="Your question"
          value={input}
          onChange={handleInputChange}
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
