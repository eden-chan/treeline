import { createHighlight } from "./mongo";

async function testUpload() {
  const testHighlight = {
    content: {
      text: "Sample highlight for testing upload functionality",
    },
    position: {
      boundingRect: {
        x1: 100,
        y1: 100,
        x2: 200,
        y2: 150,
        width: 800,
        height: 600,
      },
      rects: [
        {
          x1: 100,
          y1: 100,
          x2: 200,
          y2: 150,
          width: 800,
          height: 600,
        },
      ],
      pageNumber: 1,
    },
    comment: {
      text: "This is a test comment",
      emoji: "🚀",
    },
    id: "test123",
  };

  try {
    const highlightToAdd = {
      user: "eden",
      highlights: [testHighlight],
      source: "https://arxiv.org/pdf/1708.08021.pdf",
    };
    const result = await createHighlight(highlightToAdd);
    console.log("Upload successful:", result);
  } catch (error) {
    console.error("Upload failed:", error);
  }
}

testUpload();
