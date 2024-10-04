import { init, tx, id } from '@instantdb/react';
import type { IHighlight, NewHighlight, ScaledPosition, Content } from "../react-pdf-highlighter";
type Schema = {
    highlights: IHighlight,
    
}

// Provide a room schema to get typings for presence!
type RoomSchema = {
  chat: {
    presence: { name: string };
  };
}

// Generic type for room schemas.
// type RoomSchemaShape = {
//   [roomType: string]: {
//     presence?: { [k: string]: any };
//     topics?: {
//       [topic: string]: {
//         [k: string]: any;
//       };
//     };
//   };
// };

export const db = init<Schema, RoomSchema>({ appId: import.meta.env.VITE_INSTANTDB_APP_ID ?? '' });
export const ANONYMOUS_USER_ID = "anonymous";

export const addHighlight = (highlight: NewHighlight, userId: string = ANONYMOUS_USER_ID, userName: string = ANONYMOUS_USER_ID) => {
    console.log("Saving highlight", highlight);
    return db.transact(
        tx.highlights[id()].update({
            ...highlight,
            userId,
            userName,
        })
    );
};

export const updateHighlight = (
    highlightId: string,
    position: Partial<ScaledPosition>,
    content: Partial<Content>,
) => {
    console.log("Updating highlight", highlightId, position, content);
    return db.transact(tx.highlights[highlightId].update({ position, content }));
};

export const deleteHighlight = (highlightId: string) => {
    console.log("Deleting highlight", highlightId);
    return db.transact(tx.highlights[highlightId].delete());
};

export const resetHighlights = (highlights: IHighlight[]) => {
    console.log("Resetting all highlights");
    return db.transact(highlights.map(h => tx.highlights[h.id].delete()));
};

export const useHighlights = () => {
    return db.useQuery({ highlights: {} });
};

export const signInWithIdToken = (idToken: string, clientName: string) => {
    return db.auth.signInWithIdToken({
        clientName,
        idToken,
    });
};

export const MAIN_ROOM_ID = 'MAIN'
export const useRoom = (roomId = MAIN_ROOM_ID) => {
    const room = db.room('chat', roomId);
    return room;

}
export const signOut = () => {
    return db.auth.signOut();
};

export const useAuth = db.useAuth;