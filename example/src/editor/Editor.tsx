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
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { TableNode } from '@lexical/table';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { CUSTOM_TRANSFORMERS } from './plugins/MyMarkdownTransformers';
import { $convertFromMarkdownString } from '@lexical/markdown';
const editorConfig = ({ value, onRenderMarkdown, isEditable = true }: { value: string, onRenderMarkdown?: (markdown: string) => void, isEditable?: boolean }): InitialConfigType => {
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

            // console.log('editorState val/ue', value);



            let lastIndex = 0;
            let match: RegExpExecArray | null;
            let preservedText = '';

            while (true) {
                match = mentionRegex.exec(value);
                if (match === null) break;
                // Add text before the mention

                if (match.index > lastIndex) {
                    const textBefore = value.slice(lastIndex, match.index);
                    const textNode = $createTextNode(textBefore);
                    const paragraphNode = $createParagraphNode();
                    paragraphNode.append(textNode);
                    console.log('%c rendering as markdown textBefore', 'color: green', textBefore);

                    if (!isEditable) {
                        $convertFromMarkdownString(textBefore, CUSTOM_TRANSFORMERS, paragraphNode);
                    }
                    root.append(paragraphNode);
                    preservedText += textBefore;
                    // const markdown = $convertToMarkdownString(CUSTOM_TRANSFORMERS);
                    // root.clear().append($createCodeNode('markdown').append($createTextNode(markdown)));

                }
                // Add the mention node
                const paragraph = $createParagraphNode();
                const mentionNode = $createMentionNode(match[0]);
                paragraph.append(mentionNode);
                root.append(paragraph);
                console.log('retrieving mentionNode', mentionNode);
                preservedText += match[0];
                lastIndex = match.index + match[0].length;
            }

            // Add any remaining text after the last mention
            if (lastIndex < value.length) {
                const remainingText = value.slice(lastIndex);


                const paragraphNode = $createParagraphNode();
                const remainingTextNode = $createTextNode(remainingText);
                paragraphNode.append(remainingTextNode);
                console.log('%c rendering as markdown remainingText', 'color: green', remainingText);

                if (!isEditable) {
                    $convertFromMarkdownString(remainingText, CUSTOM_TRANSFORMERS, paragraphNode);
                }
                root.append(paragraphNode);
                preservedText += remainingText;
            }


            onRenderMarkdown?.(preservedText);
        },
    };
}

type Props = {
    value: string;
    onChange?: (editorState: EditorState) => void;
    onBlur?: (editorState: EditorState) => void;
    onRenderMarkdown?: (markdown: string) => void;
    className?: string;
    isEditable?: boolean;
    placeholder?: string;
}

export function Editor({ value, onChange, onBlur, onRenderMarkdown, className, isEditable = true }: Props) {
    return (
        <LexicalComposer initialConfig={editorConfig({ value, onRenderMarkdown, isEditable })}>
            <RichTextPlugin
                contentEditable={
                    <ContentEditable
                        className={`${styles.contentEditable} ${className}`}
                        suppressContentEditableWarning
                    />
                }
                placeholder={
                    <div className={styles.editorPlaceholder}>
                        Enter some text...
                    </div>
                }
                ErrorBoundary={LexicalErrorBoundary}
            />
            <MentionPlugin />
            {onChange && <OnChangePlugin onChange={onChange} />}
            {onBlur && <AutosavePlugin onBlur={onBlur} />}
        </LexicalComposer>
    );
}
