import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import styles from './Editor.module.css';
import { MentionNode } from './nodes/MentionNode';
import MentionPlugin from './plugins/MentionPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { $createParagraphNode, $createTextNode, $getRoot, type EditorState } from 'lexical';
import type { InitialConfigType } from '@lexical/react/LexicalComposer';
import { AutosavePlugin } from './plugins/AutosavePlugin';

const editorConfig = ({ value }: { value: string }): InitialConfigType => {
    return {
        namespace: "editor",
        onError: (error: Error) => console.error(error),
        nodes: [MentionNode],
        editorState: () => {
            const paragraph = $createParagraphNode();
            const text = $createTextNode(value);
            paragraph.append(text);
            $getRoot().append(paragraph);
        },
    };
}

type Props = {
    value: string;
    onChange?: (editorState: EditorState) => void;
    onBlur?: (editorState: EditorState) => void;
}

export function Editor({ value, onChange, onBlur }: Props) {
    console.log('value', value);
    return (
        <LexicalComposer initialConfig={editorConfig({ value })}>
            <RichTextPlugin
                contentEditable={
                    <ContentEditable
                        className={styles.contentEditable} suppressContentEditableWarning

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

