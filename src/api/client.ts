import type { components } from "@/api/schema";

type Schemas = components["schemas"];

export type RunSummary = Schemas["RunSummary"];
export type RunListEnvelope = Schemas["RunListEnvelope"];
export type ErrorEnvelope = Schemas["ErrorEnvelope"];
export type Page = Schemas["Page"];

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api/mock";

export class ApiError extends Error {
  constructor(
    readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

async function getJson<T extends { success: true }>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);
  const body = (await response.json()) as T | ErrorEnvelope;
  if (!body.success) throw new ApiError(body.error.code, body.error.message);
  return body;
}

export interface ListRunsResult {
  runs: RunSummary[];
  page: Page;
}

export async function listRuns(page = 1, limit = 20): Promise<ListRunsResult> {
  const body = await getJson<RunListEnvelope>(`/v1/runs?page=${page}&limit=${limit}`);
  return { runs: body.data, page: body.meta };
}
