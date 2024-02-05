import { kv } from "@vercel/kv";
import { NextRequest } from "next/server";

import { generate } from "random-words";
import { Buffer } from "node:buffer";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return Response.json(
      { error: "Parameter 'id' is required" },
      { status: 400 }
    );
  }

  const stored = (await kv.get(id)) as string | null;
  if (!stored) {
    return Response.json({ error: `Not found for id: ${id}` }, { status: 404 });
  }
  return Response.json({ id, text: Buffer.from(stored, "base64").toString() });
}

export async function POST(req: NextRequest) {
  if (!req.body) {
    return Response.json({ error: "Body must not be empty" }, { status: 400 });
  }

  const id = generate({ exactly: 3, join: "-" });
  const bodyBase64 = Buffer.from(
    await (await req.blob()).arrayBuffer()
  ).toString("base64");

  await kv.set(id, bodyBase64);

  return Response.json({ id });
}
