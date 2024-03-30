"use client";
import React, { useState } from "react";

import "../../style/Tip.css";

type QuestionProps = {
  input: string;
  handleInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => void;
  handleSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    chatRequestOptions?: any,
  ) => void;
};

export const Question = ({
  input,
  handleInputChange,
  handleSubmit,
}: QuestionProps) => {
  return (
    <form className="Tip__card" onSubmit={handleSubmit}>
      <div>
        <textarea
          className="text-black"
          placeholder="Your question"
          autoFocus
          value={input}
          onChange={handleInputChange}
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
