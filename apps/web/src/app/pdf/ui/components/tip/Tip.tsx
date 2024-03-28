"use client";
import React, { useEffect, useState } from "react";
import { useChat } from "ai/react";

import { Comment } from "./Comment";
import { Question } from "./Question";

import "../../style/Tip.css";

interface Props {
  onCommentConfirm: (comment: { text: string; emoji: string }) => void;
  onPromptConfirm: () => void;
  onOpen: () => void;
}

export const Tip = ({ onCommentConfirm, onPromptConfirm, onOpen }: Props) => {
  const [state, setState] = useState<"compact" | "question" | "comment">(
    "compact",
  );
  const {
    messages,
    input: questionInput,
    handleInputChange: questionHandleInputChange,
    handleSubmit: questionHandleSubmit,
  } = useChat();

  // useEffect(() => {
  //   console.log("messages", messages);
  // }, [messages]);

  return (
    <div className="Tip">
      {state === "question" && (
        <Question
          input={questionInput}
          handleInputChange={questionHandleInputChange}
          handleSubmit={questionHandleSubmit}
        />
      )}
      {state === "comment" && <Comment onConfirm={onCommentConfirm} />}
      {state === "compact" && (
        <div className="flex">
          <div
            className="Tip__compact"
            onClick={() => {
              onOpen();
              setState("question");
            }}
          >
            Ask question
          </div>
          <div
            className="Tip__compact"
            onClick={() => {
              onOpen();
              setState("comment");
            }}
          >
            Add comment
          </div>
        </div>
      )}
    </div>
  );
};

export default Tip;
