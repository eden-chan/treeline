import { Cursors } from '@instantdb/react';
import { MAIN_ROOM_ID, useRoom } from './utils/dbUtils';
import styles from './Cursor.module.css';
import { randomDarkColor } from './utils/utils';

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
        color: randomDarkColor,
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
            {children}
        </Cursors>
    );
}


