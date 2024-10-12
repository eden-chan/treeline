import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import styles from './Editor.module.css';
import { MentionNode } from './nodes/MentionNode';
import MentionPlugin from './plugins/MentionPlugin';


const editorConfig = {
    namespace: "editor",
    onError: (error: Error) => console.error(error),
    nodes: [MentionNode],
};



export function Editor() {
    return (
        <LexicalComposer initialConfig={editorConfig}>
            <RichTextPlugin
                contentEditable={
                    <ContentEditable
                        className={styles.contentEditable}
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

        </LexicalComposer>
    );
}

