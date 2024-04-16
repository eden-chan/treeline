import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@src/lib/db";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!CLERK_WEBHOOK_SECRET) {
    throw new Error(
      "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(CLERK_WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  const eventType = evt.type;

  if (eventType === "user.created") {
    const { first_name, last_name, id: clerk_id } = payload.data;
    const email = payload.data.email_addresses[0].email_address;
    let handle = `${first_name}-${last_name}`.toLowerCase();
    // Search for duplicate users with the same handle
    const doesHandleExist = await db.user.findMany({
      where: {
        handle: {
          startsWith: handle,
          mode: "insensitive",
        },
        clerk_id: {
          not: clerk_id,
        },
      },
      orderBy: {
        handle: "desc",
      },
    });

    if (doesHandleExist.length > 0) {
      handle = `${doesHandleExist[0]?.handle}${doesHandleExist.length + 1}`;
    }

    const newUser = await db.user.create({
      data: {
        first_name,
        last_name,
        email,
        handle,
        clerk_id: clerk_id,
        follows: [],
        followers: [],
      },
    });
    return new Response(JSON.stringify(newUser), { status: 200 });
  }

  return new Response("", { status: 200 });
}
