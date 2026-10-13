import type { ErrorEnvelope, RunListEnvelope } from "@/services/strategyArena";
import { MOCK_RUNS } from "@/mock/runs";

const MAX_LIMIT = 100;

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const page = Number(params.get("page") ?? 1);
  const limit = Number(params.get("limit") ?? 20);
  const validPage = Number.isInteger(page) && page > 0;
  const validLimit = Number.isInteger(limit) && limit > 0 && limit <= MAX_LIMIT;
  if (!validPage || !validLimit) {
    const message = `page must be a whole number from 1 and limit from 1 to ${MAX_LIMIT}.`;
    const body: ErrorEnvelope = {
      success: false,
      data: null,
      error: { code: "invalid_parameters", message },
      meta: null,
    };
    return Response.json(body, { status: 400 });
  }
  const data = MOCK_RUNS.slice((page - 1) * limit, page * limit);
  const body: RunListEnvelope = {
    success: true,
    data,
    error: null,
    meta: { total: MOCK_RUNS.length, page, limit },
  };
  return Response.json(body);
}
