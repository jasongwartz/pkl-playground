import { evaluate } from "@pkl-community/pkl-eval";

export async function POST(req: Request) {
  const { pklInput } = (await req.json()) as { pklInput: string };

  return Response.json({
    output: await evaluate(pklInput, {}),
  });
}
