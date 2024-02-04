// Optional, but recommended: run on the edge runtime.
// See https://vercel.com/docs/concepts/functions/edge-functions
// export const runtime = 'edge';

"use server";

import { evaluate } from "@pkl-community/pkl-eval";
import { writeFile } from "fs/promises";
import { temporaryFile } from "tempy";

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { pklInput } = (await req.json()) as { pklInput: string };

  const tempFile = temporaryFile();
  await writeFile(tempFile, pklInput);

  return Response.json({
    output: await evaluate(pklInput, {}),
  });
}
