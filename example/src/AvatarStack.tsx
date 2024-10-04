import { useRoom } from './utils/dbUtils';
import styles from './AvatarStack.module.css';

export default function InstantAvatarStack({ roomId, username, color }: { roomId: string, username: string, color: string }) {
    const room = useRoom(roomId);

    const presence = room.usePresence({
        user: true,
    });

    room.useSyncPresence({
        name: username,
        color: color,
    });

    return (
        <div className={styles.container}>
            {presence.user ? (
                <Avatar
                    key={'user'}
                    name={presence.user.name}
                    color={presence.user.color}
                />
            ) : null}
            {Object.entries(presence.peers).map(([id, peer]) => (
                <Avatar key={id} name={`${peer.name}-${crypto.randomUUID()}`} color={peer.color} />
            ))}
        </div>
    );
}

function Avatar({ name, color }: { name: string; color: string }) {
    return (
        <div
            className={styles.avatar}
            style={{
                borderColor: color,
            }}
        >
            {name?.slice(0, 1)}
            <div className={styles.avatarTooltip}>
                {name}
            </div>
        </div>
    );
}