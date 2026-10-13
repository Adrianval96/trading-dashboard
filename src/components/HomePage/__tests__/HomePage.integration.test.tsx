import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "@/app/api/mock/v1/runs/route";
import { HomePage } from "@/components/HomePage";

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  vi.setSystemTime(new Date("2026-10-13T10:00:00+00:00"));
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

async function renderHomePage(fetchRuns: (url: string) => Promise<Response>) {
  vi.stubGlobal("fetch", fetchRuns);
  await act(async () => root.render(<HomePage />));
  await act(() =>
    vi.waitFor(() =>
      expect(
        container.querySelector(".runs-list p, .runs-list__runs"),
      ).not.toBeNull(),
    ),
  );
}

function runCards() {
  return [...container.querySelectorAll(".runs-list__run")].map((card) => ({
    id: card.querySelector(".runs-list__id")?.textContent,
    status: card.querySelector(".runs-list__status")?.textContent,
    market: card.querySelector(".runs-list__market")?.textContent,
    outcome: card.querySelector(".runs-list__outcome")?.textContent,
    when: card.querySelector(".runs-list__when")?.textContent,
  }));
}

describe("HomePage", () => {
  it("lists every run from the mock API, newest first, with its status, market and outcome", async () => {
    await renderHomePage((url) =>
      GET(new Request(new URL(url, "http://localhost"))),
    );

    expect(container.querySelector(".runs-list__count")?.textContent).toBe("5");
    expect(runCards()).toEqual([
      {
        id: "run_e40a6b58",
        status: "queued",
        market: "SYN01 SYN02 +2 · 1d",
        outcome: "no result",
        when: "53 min ago",
      },
      {
        id: "run_3f9c21aa",
        status: "running",
        market: "SYN01 SYN02 +3 · 1d",
        outcome: "56%",
        when: "55 min ago",
      },
      {
        id: "run_b72e0d14",
        status: "completed",
        market: "SYN02 SYN07 +1 · 1d",
        outcome: "hold +11.3%",
        when: "1 h ago",
      },
      {
        id: "run_0c55e9b3",
        status: "failed",
        market: "SYN01 SYN02 +6 · 1d",
        outcome: "no result",
        when: "17 h ago",
      },
      {
        id: "run_91d4c7e2",
        status: "completed",
        market: "SYN03 SYN04 · 1d",
        outcome: "buy-and-hold +5.4%",
        when: "18 h ago",
      },
    ]);
  });

  it("colours each agent and stripes buy-and-hold", async () => {
    await renderHomePage((url) =>
      GET(new Request(new URL(url, "http://localhost"))),
    );

    const swatches = [
      ...container.querySelectorAll(".runs-list__run"),
    ][1]?.querySelectorAll(".runs-list__swatch");
    expect([...(swatches ?? [])].map((swatch) => swatch.className)).toEqual([
      "runs-list__swatch runs-list__swatch--s1",
      "runs-list__swatch runs-list__swatch--s2",
      "runs-list__swatch runs-list__swatch--hold",
    ]);
  });

  it("shows the error message when the API answers with an error envelope", async () => {
    const failure = {
      success: false,
      data: null,
      error: { code: "unavailable", message: "Service down." },
      meta: null,
    };
    await renderHomePage(async () => Response.json(failure, { status: 503 }));

    expect(container.querySelector(".runs-list p")?.textContent).toBe(
      "Couldn't load runs: Service down.",
    );
    expect(container.querySelector(".runs-list__runs")).toBeNull();
  });
});
