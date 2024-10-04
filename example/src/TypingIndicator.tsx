import { useState } from 'react';
import { MAIN_ROOM_ID, useRoom } from './utils/dbUtils';
import styles from './TypingIndicator.module.css';
import type { Comment } from "./react-pdf-highlighter";
import type { Document } from "./utils/dbUtils";



interface ChatProps {
    roomId: string;
    username: string;
    color: string;
    document: Document;
}

export default function Chat({ roomId = MAIN_ROOM_ID, username, color, document }: ChatProps) {
    const room = useRoom(roomId);
    const user = {
        name: username,
        color: color
    }

    room.useSyncPresence(user);

    const presence = room.usePresence();

    const { active, inputProps } = room.useTypingIndicator('chat');

    const peers = Object.values(presence.peers).filter((p) => p.name !== username);
    const activeMap = Object.fromEntries(
        active.map((activePeer) => [activePeer.name, activePeer])
    );

    const [message, setMessage] = useState('');

    const handleSendMessage = () => {
        if (message.trim()) {
            // const newComment: Comment = {
            //     text: message,
            //     emoji: "💬", // You can change this or make it dynamic
            //     userId: username
            // };
            // const updatedDocument = {
            //     ...document,
            //     chatSection: [...document.chatSection, newComment]
            // };
            // onUpdateDocument(updatedDocument);
            setMessage('');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.sideContainer} key={crypto.randomUUID()}>
                {peers.map((peer) => {
                    return (
                        <div
                            key={crypto.randomUUID()}
                            className={styles.avatarContainer}
                            style={{
                                borderColor: peer.color,
                            }}
                        >
                            {peer.name?.slice(0, 1)}
                            {activeMap[peer.name] ? (
                                <div className={styles.typingIndicator}>
                                    ⋯
                                </div>
                            ) : null}
                        </div>
                    );
                })}
            </div>
            <div className={styles.chatMessages}>
                {/* {document?.chatSection?.map((comment: Comment) => (
                    <div
                        key={crypto.randomUUID()}
                        className={`${styles.message} ${comment.userId === username ? styles.myMessage : styles.otherMessage}`}
                    >
                        <strong>{comment.userId}: </strong>{comment.text}
                    </div>
                ))} */}
            </div>
            <div key="main" className={styles.mainContainer}>
                <textarea
                    placeholder="Compose your message here..."
                    className={styles.textarea}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                        inputProps.onKeyDown(e);
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                        }
                    }}
                    onBlur={() => inputProps.onBlur()}
                />
                <div className={styles.typingInfo}>
                    {active.length ? typingInfo(active) : <>&nbsp;</>}
                </div>
            </div>
        </div>
    );
}

function typingInfo(typing: { name: string }[]) {
    if (typing.length === 0) return null;
    if (typing.length === 1) return `${typing[0].name} is typing...`;
    if (typing.length === 2)
        return `${typing[0].name} and ${typing[1].name} are typing...`;

    return `${typing[0].name} and ${typing.length - 1} others are typing...`;
}
