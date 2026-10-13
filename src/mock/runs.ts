import type { RunSummary } from "@/services/api";

const DEFAULTS = { fast: 10, slow: 50, stop_loss: 0.05 };
const SYMBOLS = [
  "SYN01",
  "SYN02",
  "SYN03",
  "SYN04",
  "SYN05",
  "SYN06",
  "SYN07",
  "SYN08",
];

function result(
  initialCash: number,
  returns: Record<string, number>,
): RunSummary["result"] {
  return {
    agents: Object.entries(returns).map(([agentId, totalReturn]) => ({
      agent_id: agentId,
      final_equity: Math.round(initialCash * (1 + totalReturn) * 100) / 100,
      total_return: totalReturn,
    })),
  };
}

export const MOCK_RUNS: RunSummary[] = [
  {
    id: "run_e40a6b58",
    status: "queued",
    created_at: "2026-10-13T09:07:30+00:00",
    market: {
      symbols: SYMBOLS.slice(0, 4),
      interval: "1d",
      start: "2026-09-01",
      end: "2026-09-30",
    },
    initial_cash: 100000,
    cost_bps: 5,
    agents: [
      {
        id: "agt_1",
        label: "trend",
        strategy: "ma-crossover",
        parameters: DEFAULTS,
      },
      {
        id: "agt_2",
        label: "buy-and-hold",
        strategy: "buy-and-hold",
        parameters: {},
      },
    ],
    progress: { steps_done: 0, steps_total: null },
    result: null,
    failure: null,
  },
  {
    id: "run_3f9c21aa",
    status: "running",
    created_at: "2026-10-13T09:05:00+00:00",
    market: {
      symbols: SYMBOLS.slice(0, 5),
      interval: "1d",
      start: "2026-06-01",
      end: "2026-09-30",
    },
    initial_cash: 100000,
    cost_bps: 5,
    agents: [
      {
        id: "agt_1",
        label: "trend",
        strategy: "ma-crossover",
        parameters: DEFAULTS,
      },
      {
        id: "agt_2",
        label: "kronos",
        strategy: "kronos-top5",
        parameters: { top_k: 3 },
      },
      {
        id: "agt_3",
        label: "buy-and-hold",
        strategy: "buy-and-hold",
        parameters: {},
      },
    ],
    progress: { steps_done: 48, steps_total: 86 },
    result: null,
    failure: null,
  },
  {
    id: "run_b72e0d14",
    status: "completed",
    created_at: "2026-10-13T08:41:00+00:00",
    market: {
      symbols: ["SYN02", "SYN07", "SYN08"],
      interval: "1d",
      start: "2026-05-01",
      end: "2026-09-30",
    },
    initial_cash: 100000,
    cost_bps: 5,
    agents: [
      {
        id: "agt_1",
        label: "fast cross",
        strategy: "ma-crossover",
        parameters: { fast: 5, slow: 20, stop_loss: 0.03 },
      },
      {
        id: "agt_2",
        label: "slow cross",
        strategy: "ma-crossover",
        parameters: { fast: 20, slow: 50, stop_loss: 0 },
      },
      { id: "agt_3", label: "hold", strategy: "buy-and-hold", parameters: {} },
    ],
    progress: { steps_done: 106, steps_total: 106 },
    result: result(100000, { agt_1: 0.042, agt_2: 0.079, agt_3: 0.113 }),
    failure: null,
  },
  {
    id: "run_0c55e9b3",
    status: "failed",
    created_at: "2026-10-12T17:20:00+00:00",
    market: {
      symbols: SYMBOLS,
      interval: "1d",
      start: "2026-03-02",
      end: "2026-09-30",
    },
    initial_cash: 50000,
    cost_bps: 2,
    agents: [
      {
        id: "agt_1",
        label: "top 3",
        strategy: "kronos-top5",
        parameters: { top_k: 3 },
      },
      {
        id: "agt_2",
        label: "top 5",
        strategy: "kronos-top5",
        parameters: { top_k: 5 },
      },
    ],
    progress: { steps_done: 0, steps_total: 151 },
    result: null,
    failure: {
      message:
        "Kronos is not installed on this server, so kronos-top5 can't run.",
    },
  },
  {
    id: "run_91d4c7e2",
    status: "completed",
    created_at: "2026-10-12T16:02:00+00:00",
    market: {
      symbols: ["SYN03", "SYN04"],
      interval: "1d",
      start: "2026-07-01",
      end: "2026-09-30",
    },
    initial_cash: 100000,
    cost_bps: 0,
    agents: [
      {
        id: "agt_1",
        label: "trend",
        strategy: "ma-crossover",
        parameters: DEFAULTS,
      },
      {
        id: "agt_2",
        label: "buy-and-hold",
        strategy: "buy-and-hold",
        parameters: {},
      },
    ],
    progress: { steps_done: 65, steps_total: 65 },
    result: result(100000, { agt_1: -0.021, agt_2: 0.054 }),
    failure: null,
  },
];
