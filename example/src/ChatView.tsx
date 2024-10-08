
import styles from './ChatView.module.css';
import Chat from './ChatSection';
import type { DocumentWithHighlightsAndComments } from './utils/dbUtils';
interface ChatViewProps {
    roomId: string;
    username: string;
    color: string;
    currentDocument?: DocumentWithHighlightsAndComments;
}

export function ChatView({ roomId, username, color, currentDocument }: ChatViewProps) {
    return (
        <div className={styles.chatView}>
            <Chat
                roomId={roomId}
                username={username}
                color={color}
                currentDocument={currentDocument}
            />
        </div>
    );
}