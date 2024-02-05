import { evaluate } from "@pkl-community/pkl-eval";

export async function POST(req: Request) {
  const { pklInput, outputFormat } = (await req.json()) as {
    pklInput: string;
    outputFormat: any;
  };

  try {
    return Response.json({
      output: await evaluate(pklInput, {
        format: outputFormat ?? "pcf",
        allowedResources: ["package:"],
        allowedModules: ["pkl:"],
        cache: {
          enabled: true,
          directory: "/tmp/pkl",
        },
      }),
    });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : JSON.stringify(err) },
      { status: 500 }
    );
  }
}
