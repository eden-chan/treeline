"use client";
import React, { useEffect, useState } from "react";

import { useAskHighlight } from "@src/context/ask-highlight-context";
import { Comment } from "./Comment";
import { Question } from "./Question";

import "../../style/Tip.css";

interface Props {
  onCommentConfirm: (comment: { text: string; emoji: string }) => void;
  onPromptConfirm: (prompt: string) => void;
  onOpen: () => void;
  parsedPaper: object;
  content: { text?: string; emoji?: string };
}

export const Tip = ({
  onCommentConfirm,
  onPromptConfirm,
  onOpen,
  parsedPaper,
  content,
}: Props) => {
  const [state, setState] = useState<"compact" | "question" | "comment">(
    "compact"
  );

  return (
    <div className="Tip">
      {state === "question" && (
        <Question
          handleSubmit={onPromptConfirm}
          content={content}
          parsedPaper={parsedPaper}
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
