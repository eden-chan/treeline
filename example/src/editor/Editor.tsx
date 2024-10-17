import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import styles from "./Editor.module.css";
import { $createMentionNode, MentionNode } from "./nodes/MentionNode";
import MentionPlugin, { mentionRegex } from "./plugins/MentionPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  TextNode,
  type EditorState,
} from "lexical";
import type { InitialConfigType } from "@lexical/react/LexicalComposer";
import { AutosavePlugin } from "./plugins/AutosavePlugin";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { TableNode } from "@lexical/table";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { CUSTOM_TRANSFORMERS } from "./plugins/MyMarkdownTransformers";
import { $convertFromMarkdownString } from "@lexical/markdown";
import {
  AutoLinkPlugin,
  createLinkMatcherWithRegExp,
} from "@lexical/react/LexicalAutoLinkPlugin";
import { EnterKeyPlugin } from "./plugins/EnterKeyPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { FocusPlugin } from "./plugins/FocusPlugin";
const editorConfig = ({
  value,
  onRenderMarkdown,
  isEditable = true,
}: {
  value: string;
  onRenderMarkdown?: (markdown: string) => void;
  isEditable?: boolean;
}): InitialConfigType => {
  return {
    namespace: "editor",
    onError: (error: Error) => console.error(error),
    nodes: [
      MentionNode,
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      AutoLinkNode,
      LinkNode,
      TextNode,
      CodeNode,
    ],
    editorState: () => {
      const root = $getRoot();
      // const firstChild = root.getFirstChild();

      // if (firstChild && $isCodeNode(firstChild) && firstChild.getLanguage() === 'markdown') {
      //     // Markdown -> Node
      //     $convertFromMarkdownString(firstChild.getTextContent(), TRANSFORMERS);
      // } else {
      //     // Node -> Markdown
      //     const markdown = $convertToMarkdownString(TRANSFORMERS);
      //     root.clear().append($createCodeNode('markdown').append($createTextNode(markdown)));
      // }

      // console.log('editorState val/ue', value);

      let lastIndex = 0;
      let match: RegExpExecArray | null;
      let preservedText = "";

      while (true) {
        match = mentionRegex.exec(value);

        if (match === null) break;
        // Add text before the mention

        if (match.index > lastIndex) {
          const textBefore = value.slice(lastIndex, match.index);
          const textNode = $createTextNode(textBefore);
          const paragraphNode = $createParagraphNode();
          paragraphNode.append(textNode);

          if (!isEditable) {
            $convertFromMarkdownString(
              textBefore,
              CUSTOM_TRANSFORMERS,
              paragraphNode,
            );
          }
          root.append(paragraphNode);
          preservedText += textBefore;
          // const markdown = $convertToMarkdownString(CUSTOM_TRANSFORMERS);
          // root.clear().append($createCodeNode('markdown').append($createTextNode(markdown)));
        }
        // Add the mention node
        const paragraph = $createParagraphNode();

        // const fullMatch = match?.[0] ?? '';
        const matchedName = match?.[1] ?? "@[mentionName]";
        const matchedId = match?.[2] ?? "<<id>>";

        const mentionNode = $createMentionNode(matchedName, matchedId);
        paragraph.append(mentionNode);
        root.append(paragraph);
        preservedText += match[0];
        lastIndex = match.index + match[0].length;
      }

      // Add any remaining text after the last mention
      if (lastIndex < value.length) {
        const remainingText = value.slice(lastIndex);

        const paragraphNode = $createParagraphNode();
        const remainingTextNode = $createTextNode(remainingText);
        paragraphNode.append(remainingTextNode);

        if (!isEditable) {
          $convertFromMarkdownString(
            remainingText,
            CUSTOM_TRANSFORMERS,
            paragraphNode,
          );
        }
        root.append(paragraphNode);
        preservedText += remainingText;
      }

      onRenderMarkdown?.(preservedText);
    },
  };
};

type Props = {
  value?: string;
  onChange?: (editorState: EditorState) => void;
  onBlur?: (editorState: EditorState) => void;
  onRenderMarkdown?: (markdown: string) => void;
  onEnter?: (editorState: EditorState) => void;
  className?: string;
  isEditable?: boolean;
  placeholder?: string;
  isSearchMode?: boolean;
  autoFocus?: boolean;
};

export function Editor({
  value,
  onChange,
  onBlur,
  onRenderMarkdown,
  className,
  placeholder,
  isEditable = true,
  isSearchMode = false,
  onEnter,
  autoFocus = false,
}: Props) {
  return (
    <LexicalComposer
      initialConfig={editorConfig({
        value: value ?? placeholder ?? "",
        onRenderMarkdown,
        isEditable,
      })}
    >
      <RichTextPlugin
        contentEditable={
          <ContentEditable
            className={`${styles.contentEditable} ${className}`}
            suppressContentEditableWarning
          />
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
      <AutoLinkPlugin
        matchers={[
          createLinkMatcherWithRegExp(/(https?:\/\/[^\s]+)/g, (url) =>
            url.startsWith("http") ? url : `https://${url}`,
          ),
        ]}
      />
      <MentionPlugin isSearchMode={isSearchMode} />
      {onChange && <OnChangePlugin onChange={onChange} />}
      {onBlur && <AutosavePlugin onBlur={onBlur} />}
      {onEnter && <EnterKeyPlugin onEnter={onEnter} />}
      {autoFocus && <FocusPlugin />}
    </LexicalComposer>
  );
}
