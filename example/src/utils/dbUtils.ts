import { init, tx, id } from '@instantdb/react';

import {
  i,
  init_experimental,
  type InstantEntity,
  type InstantQuery,
  type InstantQueryResult,
  type InstantSchemaDatabase,
} from "@instantdb/react";

import type { IHighlight, NewHighlight, ScaledPosition, Content, HighlightContent, DocumentHighlightDraft, CreateDocumentDraft } from "../react-pdf-highlighter";


const schema = i.graph(
  {
    documents: i.entity({
      name: i.string(),
      sourceUrl: i.string(),
    }),
    highlights: i.entity({
      content: i.any(),
      position: i.any(),
      userId: i.any(),
      userName: i.any(),
    }),
    comments: i.entity({
      text: i.string(),
      emoji: i.string(),
    }),
  },
   {
    "documentsComments": {
      "forward": {
        "on": "documents",
        "has": "many",
        "label": "comments"
      },
      "reverse": {
        "on": "comments",
        "has": "one",
        "label": "documents"
      }
    },
    "documentsHighlights": {
      "forward": {
        "on": "documents",
        "has": "many",
        "label": "highlights"
      },
      "reverse": {
        "on": "highlights",
        "has": "one",
        "label": "documents"
      }
    },
    "highlightsComments": {
      "forward": {
        "on": "highlights",
        "has": "many",
        "label": "comments"
      },
      "reverse": {
        "on": "comments",
        "has": "one",
        "label": "highlights"
      }
    }
  },
  
);



// todo: support chat and different urls
type Schema = {
    documents: Document,
    highlights: IHighlight,
}

// Provide a room schema to get typings for presence!
type EmojiName = keyof typeof emoji;
type RoomSchema = {
  chat: {
    presence: { name: string, color: string };
     topics: {
            emoji: {
                name: EmojiName;
                rotationAngle: number;
                directionAngle: number;
            };
        };
  };
}

export const emoji = {
    fire: '🔥',
    wave: '👋',
    confetti: '🎉',
    heart: '❤️',
} as const;

export const emojiNames = Object.keys(emoji) as EmojiName[];


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

const config = {
    appId: import.meta.env.VITE_INSTANTDB_APP_ID ?? '',
 
}
export const db = init<Schema, RoomSchema>(config);
// export const db = init_experimental<typeof schema>({...config,
//   schema,
// });




type DB = typeof db;
// for when your want to get the type of DB before calling `init`
// type DB_alternate = InstantSchemaDatabase<typeof schema>;




export const ANONYMOUS_USER_ID = "anonymous";

// =========
// Highlights
// =========
export const addHighlight = (documentHighlight: DocumentHighlightDraft) => {
    console.log("Saving highlight", documentHighlight);
    const highlightId = id()
    return db.transact(
        tx.highlights[highlightId].update({
            ...documentHighlight,
            userId,
            userName,
        }).link({documents: documentId, comments: commentId})
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

export const getHighlights = () => {
    const query = {
        highlights: {
            documents: {},
            comments: {},
        },
    };
    return db.useQuery(query);
};

// =========
// Documents
// =========
export const addDocument = (document: CreateDocumentDraft) => {
    console.log("Saving document", document);
    const documentId = id()
    return db.transact(
        tx.documents[documentId].update({
            ...document,
            id: documentId,
        })
    );
}


const documentQuery = { 
    documents: {},
} satisfies InstantQuery<DB>;

export type Document = InstantEntity<DB, "documents">;
// alternatively
// export type DocumentResult = InstantQueryResult<DB, typeof documentQuery>["documents"];

export const getDocuments = () => {
    return db.useQuery(documentQuery);
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