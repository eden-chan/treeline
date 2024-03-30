"use client";
import React, { FC, ReactNode, useContext } from "react";
import { useChat, Message } from "ai/react";

export type ContextProps = {
  messages: Message[];
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

export const useAskHighlight = () => {
  return useContext(AskHighlightContext);
};

export const AskHighlightContext = React.createContext<ContextProps>({
  messages: [],
  input: "",
  handleInputChange: () => {},
  handleSubmit: () => {},
});

export const AskHighlightProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  const value = {
    messages,
    input,
    handleInputChange,
    handleSubmit,
  };

  return (
    <AskHighlightContext.Provider value={value}>
      {children}
    </AskHighlightContext.Provider>
  );
};
