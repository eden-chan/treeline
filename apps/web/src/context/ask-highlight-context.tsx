"use client";
import React, { FC, ReactNode, useContext } from "react";
import { useChat, Message, CreateMessage } from "ai/react";

export type ContextProps = {
  messages: Message[];
  reload: (chatRequestOptions?: any) => Promise<string | null | undefined>;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: any,
  ) => Promise<string | null | undefined>;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  handleInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => void;
  handleSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    chatRequestOptions?: any,
  ) => void;
  isLoading: boolean;
};

export const useAskHighlight = () => {
  return useContext(AskHighlightContext);
};

export const AskHighlightContext = React.createContext<ContextProps>({
  messages: [],
  append: async () => null,
  reload: async () => null,
  input: "",
  isLoading: false,
  setInput: () => null,
  handleInputChange: () => {},
  handleSubmit: () => {},
});

export const AskHighlightProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const {
    messages,
    input,
    setInput,
    append,
    reload,
    handleInputChange,
    handleSubmit,
    isLoading,
  } = useChat();

  const value = {
    messages,
    append,
    reload,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading,
  };

  return (
    <AskHighlightContext.Provider value={value}>
      {children}
    </AskHighlightContext.Provider>
  );
};
