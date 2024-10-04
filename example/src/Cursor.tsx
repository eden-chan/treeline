import { Cursors } from '@instantdb/react';
import { MAIN_ROOM_ID, useRoom } from './utils/dbUtils';
import styles from './Cursor.module.css';

function CustomCursor({ color, name }: { color?: string; name: string }) {
    return (
        <span
            className={styles.cursor}
            style={{
                borderColor: color ?? 'gray',
            }}
        >
            {name}
        </span>
    );
}

export default function InstantCursors({ children, roomId = MAIN_ROOM_ID, userId }: { children: React.ReactNode; roomId?: string, userId: string }) {

    const room = useRoom(roomId);
    room.useSyncPresence({
        name: userId,
    });

    return (
        <Cursors
            room={room}
            renderCursor={(props) => (
                <CustomCursor color={props.color} name={props.presence.name} />
            )}
            userCursorColor={randomDarkColor}
            className={styles.cursorsContainer}
        >
            Move your cursor around! ✨
            {children}
        </Cursors>
    );
}


const randomDarkColor = `#${[0, 0, 0]
    .map(() =>
        Math.floor(Math.random() * 200)
            .toString(16)
            .padStart(2, '0')
    )
    .join('')}`;