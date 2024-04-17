import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { z } from "zod";
import Instructor from "@instructor-ai/instructor";

// Set the runtime to edge for best performance
// export const runtime = "edge";

const oai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? undefined,
});

const client = Instructor({
  client: oai,
  mode: "TOOLS",
});

const ExtractionValuesSchema = z.object({
  users: z
    .array(
      z.object({
        name: z.string(),
        email: z.string(),
        twitter: z.string(),
      })
    )
    .min(5),
  date: z.string(),
  location: z.string(),
  budget: z.number(),
  deadline: z.string().min(1),
});

const textBlock = `
In our recent online meeting, participants from various backgrounds joined to discuss the upcoming tech conference.
The names and contact details of the participants were as follows:

- Name: John Doe, Email: johndoe@email.com, Twitter: @TechGuru44
- Name: Jane Smith, Email: janesmith@email.com, Twitter: @DigitalDiva88
- Name: Alex Johnson, Email: alexj@email.com, Twitter: @CodeMaster2023
- Name: Emily Clark, Email: emilyc@email.com, Twitter: @InnovateQueen
...

During the meeting, we agreed on several key points. The conference will be held on March 15th, 2024,
at the Grand Tech Arena located at 4521 Innovation Drive. Dr. Emily Johnson, a renowned AI researcher, will be our keynote speaker.

The budget for the event is set at $50,000, covering venue costs, speaker fees, and promotional activities.
Each participant is expected to contribute an article to the conference blog by February 20th.

A follow-up meeting is scheduled for January 25th at 3 PM GMT to finalize the agenda and confirm the list of speakers.
`;

const extractionStream = await client.chat.completions.create({
  messages: [{ role: "user", content: textBlock }],
  model: "gpt-4-1106-preview",
  response_model: {
    schema: ExtractionValuesSchema,
    name: "value extraction",
  },
  stream: true,
  seed: 1,
});

export async function POST(req: Request) {
  const { query } = await req.json();
  console.log("GETTING /api/question", query);
  // Ask OpenAI for a streaming chat completion given the prompt
  const extractionStream = await client.chat.completions.create({
    messages: [{ role: "user", content: textBlock }],
    model: "gpt-4-1106-preview",
    response_model: {
      schema: ExtractionValuesSchema,
      name: "value extraction",
    },
    stream: true,
    seed: 1,
  });

  // Create a TransformStream to process the extraction stream
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();

  // Write the results to the stream
  (async () => {
    for await (const result of extractionStream) {
      try {
        const chunk = JSON.stringify(result) + "\n";
        // console.log(chunk);
        await writer.write(chunk);
      } catch (e) {
        console.log(e);
        break;
      }
    }
    await writer.close();
  })();

  // Respond with the streaming response
  return new StreamingTextResponse(readable, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
