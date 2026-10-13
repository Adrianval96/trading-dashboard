import { describe, expect, it } from "vitest";

import {
  bestAgent,
  marketShort,
  progressPercent,
  relativeTime,
  signedPercent,
} from "@/lib/format";
import { MOCK_RUNS } from "@/mock/runs";

const [queued, running, completed] = MOCK_RUNS;

describe("format", () => {
  it("shortens a market to two symbols and a count", () => {
    expect(marketShort(running.market)).toBe("SYN01 SYN02 +3 · 1d");
    expect(
      marketShort({ ...running.market, symbols: ["SYN03", "SYN04"] }),
    ).toBe("SYN03 SYN04 · 1d");
  });

  it("signs percentages with a real minus sign", () => {
    expect(signedPercent(0.113)).toBe("+11.3%");
    expect(signedPercent(-0.021)).toBe("−2.1%");
  });

  it("describes how long ago a run started", () => {
    const now = Date.parse("2026-10-13T10:00:00+00:00");
    expect(relativeTime("2026-10-13T09:59:30+00:00", now)).toBe("Just now");
    expect(relativeTime("2026-10-13T09:15:00+00:00", now)).toBe("45 min ago");
    expect(relativeTime("2026-10-12T17:00:00+00:00", now)).toBe("17 h ago");
    expect(relativeTime("2026-10-10T10:00:00+00:00", now)).toBe("3 days ago");
  });

  it("picks the agent with the highest return, or nothing before a result exists", () => {
    expect(bestAgent(completed)).toEqual({ label: "hold", totalReturn: 0.113 });
    expect(bestAgent(running)).toBeNull();
  });

  it("reports progress only once the total is known", () => {
    expect(progressPercent(running.progress)).toBe(56);
    expect(progressPercent(queued.progress)).toBeNull();
  });
});
