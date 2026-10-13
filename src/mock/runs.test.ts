import { describe, expect, it } from "vitest";

import { GET } from "@/app/api/mock/v1/runs/route";
import { MOCK_RUNS } from "@/mock/runs";

async function get(query: string) {
  const response = await GET(
    new Request(`http://localhost/api/mock/v1/runs${query}`),
  );
  return { status: response.status, body: await response.json() };
}

describe("GET /api/mock/v1/runs", () => {
  it("returns the first page in the contract's envelope", async () => {
    const { status, body } = await get("");

    expect(status).toBe(200);
    expect(body).toEqual({
      success: true,
      data: MOCK_RUNS,
      error: null,
      meta: { total: MOCK_RUNS.length, page: 1, limit: 20 },
    });
  });

  it("pages with page and limit", async () => {
    const { body } = await get("?page=2&limit=2");

    expect(body.data.map((run: { id: string }) => run.id)).toEqual([
      MOCK_RUNS[2].id,
      MOCK_RUNS[3].id,
    ]);
    expect(body.meta).toEqual({ total: MOCK_RUNS.length, page: 2, limit: 2 });
  });

  it.each(["?page=0", "?limit=101", "?page=abc"])(
    "rejects %s with an invalid_parameters error",
    async (query) => {
      const { status, body } = await get(query);

      expect(status).toBe(400);
      expect(body.success).toBe(false);
      expect(body.error.code).toBe("invalid_parameters");
    },
  );
});
