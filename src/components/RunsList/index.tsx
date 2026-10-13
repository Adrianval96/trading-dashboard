import type { RunSummary } from "@/services/api";
import {
  bestAgent,
  marketShort,
  progressPercent,
  relativeTime,
  signedPercent,
} from "@/utilities/format";
import "./styles.css";

export type RunsListState =
  | { status: "loading" }
  | { status: "failed"; message: string }
  | { status: "ready"; runs: RunSummary[]; total: number };

type Props = {
  state: RunsListState;
};

type RunProps = {
  run: RunSummary;
};

interface AgentSwatch {
  id: string;
  label: string;
  modifier: string;
}

const LIVE_STATUSES = new Set<RunSummary["status"]>(["queued", "running"]);
const STRATEGY_COLOR_COUNT = 5;

function agentSwatches(agents: RunSummary["agents"]): AgentSwatch[] {
  let next = 0;
  return agents.map(({ id, label, strategy }) => ({
    id,
    label,
    modifier:
      strategy === "buy-and-hold"
        ? "hold"
        : `s${(next++ % STRATEGY_COLOR_COUNT) + 1}`,
  }));
}

function RunOutcome({ run }: RunProps) {
  const best = bestAgent(run);
  if (best) {
    const tone =
      best.totalReturn > 0 ? "gain" : best.totalReturn < 0 ? "loss" : "";
    return (
      <span className={`runs-list__outcome ${tone}`}>
        {best.label} {signedPercent(best.totalReturn)}
      </span>
    );
  }
  const percent = progressPercent(run.progress);
  if (LIVE_STATUSES.has(run.status) && percent !== null) {
    return <span className="runs-list__outcome">{percent}%</span>;
  }
  return <span className="runs-list__outcome muted">no result</span>;
}

function RunCard({ run }: RunProps) {
  return (
    <article className="runs-list__run">
      <span className="runs-list__row">
        <span className="runs-list__id">{run.id}</span>
        <span className={`runs-list__status runs-list__status--${run.status}`}>
          <i />
          {run.status}
        </span>
      </span>
      <span className="runs-list__market">{marketShort(run.market)}</span>
      <span className="runs-list__row runs-list__foot">
        <span className="runs-list__agents">
          {agentSwatches(run.agents).map((swatch) => (
            <i
              key={swatch.id}
              className={`runs-list__swatch runs-list__swatch--${swatch.modifier}`}
              title={swatch.label}
            />
          ))}
          <span className="muted"> {run.agents.length} agents</span>
        </span>
        <RunOutcome run={run} />
      </span>
      <time className="runs-list__when" dateTime={run.created_at}>
        {relativeTime(run.created_at)}
      </time>
    </article>
  );
}

export function RunsList({ state }: Props) {
  return (
    <section className="runs-list" aria-labelledby="runs-heading">
      <div className="runs-list__head">
        <h2 id="runs-heading" className="label">
          Runs
        </h2>
        {state.status === "ready" && (
          <span className="runs-list__count">{state.total}</span>
        )}
      </div>
      {state.status === "loading" && <p className="muted">Loading runs…</p>}
      {state.status === "failed" && (
        <p className="loss">Couldn&apos;t load runs: {state.message}</p>
      )}
      {state.status === "ready" && (
        <ol className="runs-list__runs">
          {state.runs.map((run) => (
            <li key={run.id}>
              <RunCard run={run} />
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
