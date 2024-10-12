import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import styles from './Editor.module.css';
import { $createMentionNode, MentionNode } from './nodes/MentionNode';
import MentionPlugin, { mentionRegex } from './plugins/MentionPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { $createParagraphNode, $createTextNode, $getRoot, TextNode, type EditorState } from 'lexical';
import type { InitialConfigType } from '@lexical/react/LexicalComposer';
import { AutosavePlugin } from './plugins/AutosavePlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import {
    $convertToMarkdownString,
    TRANSFORMERS,
} from '@lexical/markdown';
import { $createCodeNode, $isCodeNode, CodeHighlightNode, CodeNode } from '@lexical/code';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { TableNode } from '@lexical/table';
import { AutoLinkNode, LinkNode } from '@lexical/link';
const editorConfig = ({ value }: { value: string }): InitialConfigType => {
    console.log('markdown transformers', TRANSFORMERS, typeof TRANSFORMERS);
    return {
        namespace: "editor",
        onError: (error: Error) => console.error(error),
        nodes: [MentionNode,
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
            CodeNode

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



            const paragraph = $createParagraphNode();
            const markdown = $convertToMarkdownString(TRANSFORMERS);
            console.log('markdown transformers', markdown);
            root.append(paragraph);

            let lastIndex = 0;
            let match: RegExpExecArray | null;

            while (true) {
                match = mentionRegex.exec(value);
                if (match === null) break;
                // Add text before the mention
                if (match.index > lastIndex) {
                    const textBefore = value.slice(lastIndex, match.index);
                    paragraph.append($createTextNode(textBefore));
                }

                // Add the mention node
                const mentionNode = $createMentionNode(match[0]);
                paragraph.append(mentionNode);

                lastIndex = match.index + match[0].length;
            }

            // Add any remaining text after the last mention
            if (lastIndex < value.length) {
                const remainingText = value.slice(lastIndex);
                paragraph.append($createTextNode(remainingText));
            }

            // const markdown = $convertToMarkdownString(root);
            console.log('markdown', markdown);
        },
    };
}

type Props = {
    value: string;
    onChange?: (editorState: EditorState) => void;
    onBlur?: (editorState: EditorState) => void;
    className?: string;
}

export function Editor({ value, onChange, onBlur, className }: Props) {
    console.log('value', value);
    return (
        <LexicalComposer initialConfig={editorConfig({ value })}>
            <RichTextPlugin
                contentEditable={
                    <ContentEditable
                        className={`${styles.contentEditable} ${className}`} suppressContentEditableWarning

                    />
                }
                placeholder={
                    <div className={styles.editorPlaceholder}>
                        Enter some text...
                    </div>
                }
                ErrorBoundary={LexicalErrorBoundary}
            />
            <MarkdownShortcutPlugin transformers={TRANSFORMERS} />

            <MentionPlugin />
            {onChange && <OnChangePlugin onChange={onChange} />}
            {onBlur && <AutosavePlugin onBlur={onBlur} />}

        </LexicalComposer>
    );
}
