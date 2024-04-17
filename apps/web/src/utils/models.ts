import Instructor from "@instructor-ai/instructor";
import OpenAI from "openai";
import { z } from "zod";

const oai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? undefined,
});

const client = Instructor({
  client: oai,
  mode: "TOOLS",
});

const UserSchema = z.object({
  // Description will be used in the prompt
  age: z.number().describe("The age of the user"),
  name: z.string(),
});

// User will be of type z.infer<typeof UserSchema>
const user = await client.chat.completions.create({
  messages: [{ role: "user", content: "Jason Liu is 30 years old" }],
  model: "gpt-3.5-turbo",
  response_model: {
    schema: UserSchema,
    name: "User",
  },
});

const QueryTypeSchema = z.enum(["SINGLE", "MERGE_MULTIPLE_RESPONSES"]);

const QuerySchema = z.object({
  id: z.number(),
  question: z.string(),
  dependencies: z.array(z.number()).optional(),
  node_type: QueryTypeSchema.default("SINGLE"),
});

const QueryPlanSchema = z.object({
  query_graph: z.array(QuerySchema),
});

const createQueryPlan = async (question: string): Promise<any | undefined> => {
  const queryPlan = await client.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a world class query planning algorithm capable of breaking apart questions into its dependency queries such that the answers can be used to inform the parent question. Do not answer the questions, simply provide a correct compute graph with good specific questions to ask and relevant dependencies. Before you call the function, think step-by-step to get a better understanding of the problem.",
      },
      {
        role: "user",
        content: `Consider: ${question}\nGenerate the correct query plan.`,
      },
    ],
    model: "gpt-4-1106-preview",
    response_model: { schema: QueryPlanSchema, name: "QueryPlan" },
    max_tokens: 1000,
    temperature: 0.0,
    max_retries: 2,
  });

  return queryPlan || undefined;
};

const queryPlan = await createQueryPlan(
  "What is the difference in populations of Canada and the Jason's home country?"
);

console.log({ queryPlan: JSON.stringify(queryPlan) });
