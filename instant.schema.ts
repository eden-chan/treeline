// Treeline
// https://instantdb.com/dash?s=main&t=home&app=3188e6a0-1df2-40ba-aa8a-97e1367d2675

import { i } from "@instantdb/react";

const graph = i.graph(
  {
    "bundles": i.entity({
      "createdAt": i.any(),
      "description": i.any(),
      "name": i.any(),
    }),
    "comments": i.entity({
      "createdAt": i.any(),
      "emoji": i.any(),
      "text": i.any(),
      "userId": i.any(),
      "userName": i.any(),
    }),
    "documents": i.entity({
      "createdAt": i.any(),
      "name": i.any(),
      "sourceUrl": i.any().unique(),
    }),
    "highlights": i.entity({
      "content": i.any(),
      "createdAt": i.any(),
      "position": i.any(),
      "userId": i.any(),
      "userName": i.any(),
    }),
    "tags": i.entity({
      "description": i.any(),
      "name": i.any().unique().indexed(),
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

export default graph;
