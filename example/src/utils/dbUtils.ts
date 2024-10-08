import { init, tx, id } from '@instantdb/react';

import {
  i,
  init_experimental,
  type InstantEntity,
  type InstantQuery,
} from "@instantdb/react";

import type { ScaledPosition, Content, CreateDocumentDraft } from "../react-pdf-highlighter";
import { getCurrentDate } from './utils';


const schema = i.graph(
  {
    bundles: i.entity({
      description: i.string(),
      name: i.string(),
      createdAt: i.number(),
    }),
    documents: i.entity({
      name: i.string(),
      sourceUrl: i.string().unique(),
      createdAt: i.number(),
    }),
    highlights: i.entity({
      content: i.json(),
      position: i.json(),
      userId: i.string(),
      userName: i.string(),
      createdAt: i.number(),
    }),
    comments: i.entity({
      text: i.string(),
      emoji: i.string(),
      userId: i.string(),
      userName: i.string(),
      createdAt: i.number(),
    }),
    tags: i.entity({
      description: i.string(),
      name: i.string().unique().indexed(),
    }),
  },
    {
    "bundlesChildren": {
      "forward": {
        "on": "bundles",
        "has": "many",
        "label": "children"
      },
      "reverse": {
        "on": "bundles",
        "has": "one",
        "label": "parent"
      }
    },
    "bundlesDocuments": {
      "forward": {
        "on": "bundles",
        "has": "many",
        "label": "documents"
      },
      "reverse": {
        "on": "documents",
        "has": "many",
        "label": "bundles"
      }
    },
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
    },
    "tagsDocuments": {
      "forward": {
        "on": "tags",
        "has": "many",
        "label": "documents"
      },
      "reverse": {
        "on": "documents",
        "has": "many",
        "label": "tags"
      }
    }
  }
);

// 

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

export const presenceDb = init<typeof schema, RoomSchema>(config);

// for type support
export const db = init_experimental<typeof schema>({...config,
  schema,
});


type DB = typeof db;
// for when your want to get the type of DB before calling `init`
// type DB_alternate = InstantSchemaDatabase<typeof schema>;

export const ANONYMOUS_USER_ID = "anonymous";

// =========
// Highlights
// =========


export type CreateHighlightSchemaDraft= {
    position: Partial<ScaledPosition>,
    content: Partial<Content>,
    userId: string,
    userName: string,
}

export type AddHighlightWithCommentSchemaDraft = {
    highlight: CreateHighlightSchemaDraft;
    documentId: string;
    comment?: CreateCommentDraft;
};

export const addHighlightWithComment = ({ highlight, documentId, comment }: AddHighlightWithCommentSchemaDraft) => {
    const highlightId = id()
    
    if (!documentId) {
        throw new Error("Document ID is required");
    }
    
    if (comment) {
        const commentId = id()

        console.debug("Adding highlight with comment", highlightId, commentId)
        return db.transact(
           [ tx.highlights[highlightId].update({...highlight, createdAt: getCurrentDate()}).link({documents: documentId}),
            tx.comments[commentId].update({...comment, createdAt: getCurrentDate()}).link({highlights: highlightId})
        ]
        );
    }

    console.debug("Adding highlight without comment", highlightId)
    // No comment is passed in 
    return db.transact(
        tx.highlights[highlightId].update({...highlight}).link({documents: documentId}),
    );

}

export const addHighlight = ( highlight: CreateHighlightSchemaDraft) => {
    console.debug("Saving highlight with addHighlight", highlight);
    const highlightId = id()
    return db.transact(
        tx.highlights[highlightId].update({...highlight, createdAt: getCurrentDate()}),
    );
};

export const updateHighlight = (
    highlightId: string,
    position: Partial<ScaledPosition>,
    content: Partial<Content>,
) => {
    console.debug("Updating highlight", highlightId, position, content);
    return db.transact(tx.highlights[highlightId].update({ position, content }));
};

export const deleteHighlight = (highlightId: string) => {
    console.debug("Deleting highlight", highlightId);
    return db.transact(tx.highlights[highlightId].delete());
};

export const resetHighlights = (highlights: HighlightResponseType[]) => {
    console.debug("Resetting all highlights");
    return db.transact(highlights.map(h => tx.highlights[h.id].delete()));
};


const highlightsQuery = { 
    highlights: {},
} satisfies InstantQuery<DB>;

export type HighlightResponseType = InstantEntity<DB, "highlights">;

export type HighlightResponseTypeWithComments = InstantEntity<DB, "highlights"> & {
    comments: InstantEntity<DB, "comments">[];
};

export const getHighlights = () => {
    return db.useQuery(highlightsQuery);
};



const highlightsQueryByDocumentId = (sourceUrl: string) => { 
    return { 
        highlights: {
            $: {
                where: {
                    'documents.sourceUrl': sourceUrl,   
                }
            }, 
            comments: {},
        },
    } satisfies InstantQuery<DB>;
}

export const getHighlightsByDocument = (sourceUrl: string) => {
    return db.useQuery(highlightsQueryByDocumentId(sourceUrl));
}


// =========
// Comments
// =========


const commentsQuery = { 
    comments: {},
} satisfies InstantQuery<DB>;

export type Comment = InstantEntity<DB, "comments">;

export type CreateCommentDraft = {
    text: string,
    emoji: string,
    userId: string,
    userName: string,
}
export const addDocumentComment = (comment: CreateCommentDraft, documentId?: string) => {
    console.log("Adding document comment", comment, documentId)
    // If we want to batch create comment with the highlight, we need to generate the id ahead of time
    return db.transact(
        tx.comments[id()].update({...comment, createdAt: getCurrentDate()}).link({documents: documentId}),
    );
}

export const deleteComment = (commentId: string) => {
    console.debug("Deleting comment", commentId);
    return db.transact(tx.comments[commentId].delete());
};

export const updateComment = (commentId: string, text: string) => {
    console.debug("Updating comment", commentId, text);
    return db.transact(tx.comments[commentId].update({text}));
};

export const resetComments = () => {
    console.debug("Resetting all comments");
    const {data}= db.useQuery(commentsQuery);
    if (data?.comments) {
        return db.transact(data.comments.map(c => tx.comments[c.id].delete()));
    }
    return Promise.reject("Failed to fetch comments");
};

// =========
// Documents
// =========
export const addDocument = (document: CreateDocumentDraft) => {
    console.debug("Saving document", document);
    const documentId = id()
    return db.transact(
        tx.documents[documentId].update({
            ...document,
            createdAt: getCurrentDate(),
            id: documentId,
        })
    );
}


const documentQuery = { 
    documents: {},
} satisfies InstantQuery<DB>;

export type Document = InstantEntity<DB, "documents">;

export type DocumentWithHighlightsAndComments = InstantEntity<DB, "documents"> & {
    highlights: HighlightResponseTypeWithComments[];
    comments: Comment[]; // document-level comments
};
// alternatively
// export type DocumentResult = InstantQueryResult<DB, typeof documentQuery>["documents"];
export const getDocuments = () : Promise<DocumentWithHighlightsAndComments[]> => {
    const {data} = db.useQuery(documentQuery);
    if (data?.documents) {
        return Promise.resolve(data.documents as DocumentWithHighlightsAndComments[]);
    }
    return Promise.reject("Failed to fetch documents");
};

const documentQueryWithHighlights = { 
    documents: {
        highlights: {
            comments: {},
        },
        comments: {},
    }} satisfies InstantQuery<DB>;



// export type DocumentWithHighlights = InstantQueryResult<DB, typeof documentQueryWithHighlights>["documents"];
export const getDocumentsWithHighlights = () => {
    return db.useQuery(documentQueryWithHighlights);
};

// =========
// Bundles
// ========= 

export type Bundle = InstantEntity<DB, "bundles">;
export type BundleWithDocuments = InstantEntity<DB, "bundles"> & {
    documents: Document[];
};

export type CreateBundleSchema = {
    name: string,
    description: string,
    documentIds: string[],
}

export const addBundle = (bundle: CreateBundleSchema & { documentIds?: string[] }) => {
  console.debug("Saving bundle", bundle);
  const bundleId = id();
  const transaction = [
    tx.bundles[bundleId].update({ ...bundle, createdAt: getCurrentDate(), id: bundleId }),
  ];
  
  if (bundle.documentIds && bundle.documentIds.length > 0) {
    transaction.push(tx.bundles[bundleId].link({ documents: bundle.documentIds }));
  }
  
  return db.transact(transaction);
};

const bundlesQuery = { 
    bundles: {
        documents: {},
    },
} satisfies InstantQuery<DB>;

export const getBundles = () => {
    return db.useQuery(bundlesQuery);
}


// =========
// Tags
// =========

export type Tag = InstantEntity<DB, "tags">;
export type TagWithDocuments = InstantEntity<DB, "tags"> & {
    documents: Document[];
};

export type CreateTagSchema = {
    name: string,
    description: string,
    documentIds: string[],
}

const tagsQuery = { 
    tags: {
        documents: {},
    },
} satisfies InstantQuery<DB>;

export const getTags = () => {
    return db.useQuery(tagsQuery);
}

export const addTag = (tag: CreateTagSchema & { documentIds?: string[] }) => {
  console.debug("Saving tag", tag);
  const tagId = id();
  const transaction = [
    tx.tags[tagId].update({ ...tag, createdAt: getCurrentDate(), id: tagId }),
  ];
  
  if (tag.documentIds && tag.documentIds.length > 0) {
    transaction.push(tx.tags[tagId].link({ documents: tag.documentIds }));
  }
  
  return db.transact(transaction);
};

// =========
// Auth 
// =========

export const signInWithIdToken = (idToken: string, clientName: string) => {
    return db.auth.signInWithIdToken({
        clientName,
        idToken,
    });
};

export const MAIN_ROOM_ID = 'MAIN'
export const useRoom = (roomId = MAIN_ROOM_ID) => {
    const room = presenceDb.room('chat', roomId);
    return room;

}
export const signOut = () => {
    return db.auth.signOut();
};

export const useAuth = db.useAuth;