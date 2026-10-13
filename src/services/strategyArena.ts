import type { components } from "@/strategy-arena-types";

type Schemas = components["schemas"];

export type RunSummary = Schemas["RunSummary"];
export type RunListEnvelope = Schemas["RunListEnvelope"];
export type ErrorEnvelope = Schemas["ErrorEnvelope"];

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
  const body: T | ErrorEnvelope = await response.json();
  if (!body.success) throw new ApiError(body.error.code, body.error.message);
  return body;
}

export async function listRuns(): Promise<RunListEnvelope> {
  return getJson<RunListEnvelope>("/v1/runs");
}
