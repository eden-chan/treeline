
import styles from './ChatView.module.css';
import Chat from './ChatSection';
import type { DocumentWithHighlightsAndComments, HighlightResponseTypeWithComments, User, Document } from './utils/dbUtils';
interface ChatViewProps {
    roomId: string;
    username: string;
    color: string;
    currentDocument?: DocumentWithHighlightsAndComments;
    documents: Document[];
    highlights: HighlightResponseTypeWithComments[];
    users: User[];
}

export function ChatView({ roomId, username, color, currentDocument, documents, highlights, users }: ChatViewProps) {
    return (
        <div className={styles.chatView}>
            <Chat
                roomId={roomId}
                username={username}
                color={color}
                currentDocument={currentDocument}
                documents={documents}
                highlights={highlights}
                users={users}
            />
        </div>
    );
}