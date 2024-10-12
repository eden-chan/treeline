import { BeautifulMentionsPlugin, BeautifulMentionNode } from "lexical-beautiful-mentions";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
// import styles from './Editor.module.css';
import styles from './Editor.css';
import { MentionNode } from './nodes/MentionNode';
import MentionPlugin from './plugins/MentionPlugin';

const mentionItems = {
    "@": ["Anton", "Boris", "Catherine", "Dmitri", "Elena", "Felix", "Gina"],
    "#": ["Apple", "Banana", "Cherry", "Date", "Elderberry", "Fig", "Grape"],
    "due:": ["Today", "Tomorrow", "01-01-2023"],
};

const editorConfig = {
    namespace: "editor",
    onError: (error: Error) => console.error(error),
    nodes: [MentionNode],
    theme: {

    },
};

export function Editor() {
    return (
        <LexicalComposer initialConfig={editorConfig}>
            <RichTextPlugin
                contentEditable={
                    <ContentEditable
                        className="editorContainer"
                    />
                }
                placeholder={
                    <div className="editorPlaceholder">
                        Enter some text...
                    </div>
                }
                ErrorBoundary={LexicalErrorBoundary}
            />
            <MentionPlugin />

        </LexicalComposer>
    );
}

