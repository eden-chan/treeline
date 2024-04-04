"use client";
import React, { useState } from "react";

import { useAskHighlight } from "@src/context/ask-highlight-context";
import { api } from "@src/trpc/server";

import "../../style/Tip.css";

type QuestionProps = {
  handleSubmit: (prompt: string) => void;
  content: { text?: string; emoji?: string };
  parsedPaper: object;
};

export const Question = ({
  handleSubmit,
  content,
  parsedPaper,
}: QuestionProps) => {
  const {
    input,
    setInput,
    handleInputChange,
    append: askAi,
  } = useAskHighlight();
  console.log("FROM QUESTION", parsedPaper);

  return (
    <form
      className="Tip__card"
      onSubmit={(e) => {
        e.preventDefault();

        const prompt = content?.text
          ? `Answer the following question given the context below: 
${content.text}
The question is: ${input}`
          : input;

        askAi(
          {
            role: "user",
            content: prompt,
            createdAt: new Date(),
          },
          {}
        );
        setInput("");
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
