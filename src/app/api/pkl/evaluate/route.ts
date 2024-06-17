import { evaluate } from "@pkl-community/pkl-eval";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST",
} as const;

export async function OPTIONS() {
  return new Response("", {
    headers,
  });
}

export async function POST(req: Request) {
  let pklInput: string;
  let outputFormat: string;
  try {
    const body = (await req.json()) as {
      pklInput: string;
      outputFormat: string;
    };
    pklInput = body.pklInput;
    outputFormat = body.outputFormat;
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : JSON.stringify(err) },
      { status: 400, headers }
    );
  }

  try {
    return Response.json(
      {
        output: await evaluate(pklInput, {
          format: (outputFormat as any) ?? "pcf",
          allowedResources: ["package:"],
          allowedModules: ["pkl:", "repl:"],
          cache: {
            enabled: true,
            directory: "/tmp/pkl",
          },
        }),
      },
      {
        headers,
      }
    );
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : JSON.stringify(err) },
      { status: 500, headers }
    );
  }
}
