import { MAIN_ROOM_ID, useRoom } from './utils/dbUtils';
import styles from './TypingIndicator.module.css';

export default function InstantTypingIndicator({ roomId = MAIN_ROOM_ID, username, color }: { roomId: string, username: string, color: string }) {
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

    return (
        <div className={styles.container}>
            <div className={styles.sideContainer} key="side">
                {peers.map((peer) => {
                    return (
                        <div
                            key={peer.name}
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
            <div key="main" className={styles.mainContainer}>
                <textarea
                    placeholder="Compose your message here..."
                    className={styles.textarea}
                    onKeyDown={(e) => inputProps.onKeyDown(e)}
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
