import type { RunSummary } from "@/api/client";

const HOUR_MS = 3_600_000;

export function marketShort(market: RunSummary["market"]): string {
  const { symbols, interval } = market;
  const shown =
    symbols.length > 2
      ? `${symbols.slice(0, 2).join(" ")} +${symbols.length - 2}`
      : symbols.join(" ");
  return `${shown} · ${interval}`;
}

export function signedPercent(value: number): string {
  return `${value >= 0 ? "+" : "−"}${Math.abs(value * 100).toFixed(1)}%`;
}

export function relativeTime(
  timestamp: string,
  now: number = Date.now(),
): string {
  const hours = (now - Date.parse(timestamp)) / HOUR_MS;
  if (hours < 0.02) return "Just now";
  if (hours < 1) return `${Math.round(hours * 60)} min ago`;
  if (hours < 24) return `${Math.round(hours)} h ago`;
  if (hours < 48) return "Yesterday";
  return `${Math.round(hours / 24)} days ago`;
}

export interface BestAgent {
  label: string;
  totalReturn: number;
}

export function bestAgent(run: RunSummary): BestAgent | null {
  if (!run.result || run.result.agents.length === 0) return null;
  const best = run.result.agents.reduce((top, agent) =>
    agent.total_return > top.total_return ? agent : top,
  );
  const label =
    run.agents.find((agent) => agent.id === best.agent_id)?.label ??
    best.agent_id;
  return { label, totalReturn: best.total_return };
}

export function progressPercent(
  progress: RunSummary["progress"],
): number | null {
  if (!progress.steps_total) return null;
  return Math.round((100 * progress.steps_done) / progress.steps_total);
}
