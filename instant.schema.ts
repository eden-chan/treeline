// Treeline
// https://instantdb.com/dash?s=main&t=home&app=3188e6a0-1df2-40ba-aa8a-97e1367d2675

import { i } from "@instantdb/react";


export const schema = i.graph(
  {
    "comments": i.entity({
  
    }),
    "documents": i.entity({
      "name": i.string(),
      "sourceUrl": i.string(),
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

export default  schema;
