import { listMockRuns } from "@/mock/runs";

export async function GET(request: Request) {
  const { status, body } = listMockRuns(new URL(request.url).searchParams);
  return Response.json(body, { status });
}
