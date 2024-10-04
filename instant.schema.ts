// Treeline
// https://instantdb.com/dash?s=main&t=home&app=3188e6a0-1df2-40ba-aa8a-97e1367d2675

import { i } from "@instantdb/react";

const graph = i.graph(
  {
    "comments": i.entity({
      "emoji": i.any(),
      "text": i.any(),
      "userId": i.any(),
      "userName": i.any(),
    }),
    "documents": i.entity({
      "name": i.any(),
      "sourceUrl": i.any().unique(),
    }),
    "highlights": i.entity({
      "content": i.any(),
      "position": i.any(),
      "userId": i.any(),
      "userName": i.any(),
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
  }
);

export default graph;
