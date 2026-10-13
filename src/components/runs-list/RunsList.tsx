"use client";

import { useEffect, useState } from "react";

import { listRuns, type RunSummary } from "@/api/client";
import { bestAgent, marketShort, progressPercent, relativeTime, signedPercent } from "@/lib/format";

import styles from "./runs-list.module.css";

type RunsState =
  | { status: "loading" }
  | { status: "failed"; message: string }
  | { status: "ready"; runs: RunSummary[]; total: number };

const LIVE_STATUSES = new Set<RunSummary["status"]>(["queued", "running"]);
const STRATEGY_COLORS = ["--s1", "--s2", "--s3", "--s4", "--s5"];

function agentColors(agents: RunSummary["agents"]): string[] {
  let next = 0;
  return agents.map((agent) =>
    agent.strategy === "buy-and-hold" ? "--hold" : STRATEGY_COLORS[next++ % STRATEGY_COLORS.length],
  );
}

function RunOutcome({ run }: { run: RunSummary }) {
  const best = bestAgent(run);
  if (best) {
    const tone = best.totalReturn > 0 ? "gain" : best.totalReturn < 0 ? "loss" : "";
    return <span className={`${styles.best} ${tone}`}>{`${best.label} ${signedPercent(best.totalReturn)}`}</span>;
  }
  const percent = progressPercent(run.progress);
  if (LIVE_STATUSES.has(run.status) && percent !== null) return <span className={styles.best}>{`${percent}%`}</span>;
  return <span className={`${styles.best} muted`}>no result</span>;
}

function RunItem({ run }: { run: RunSummary }) {
  const colors = agentColors(run.agents);
  return (
    <article className={styles.item}>
      <span className={styles.row}>
        <span className={styles.id}>{run.id}</span>
        <span className={styles.pill} data-status={run.status}>
          <i />
          {run.status}
        </span>
      </span>
      <span className={styles.market}>{marketShort(run.market)}</span>
      <span className={`${styles.row} ${styles.foot}`}>
        <span className={styles.agents}>
          {run.agents.map((agent, index) => {
            const hold = colors[index] === "--hold";
            return (
              <i
                key={agent.id}
                className={hold ? `${styles.swatch} ${styles.hold}` : styles.swatch}
                style={hold ? undefined : { background: `var(${colors[index]})` }}
                title={agent.label}
              />
            );
          })}
          <span className="muted">{` ${run.agents.length} agents`}</span>
        </span>
        <RunOutcome run={run} />
      </span>
      <time className={styles.when} dateTime={run.created_at}>
        {relativeTime(run.created_at)}
      </time>
    </article>
  );
}

export function RunsList() {
  const [state, setState] = useState<RunsState>({ status: "loading" });

  useEffect(() => {
    listRuns()
      .then(({ data, meta }) => setState({ status: "ready", runs: data, total: meta.total }))
      .catch((error: Error) => setState({ status: "failed", message: error.message }));
  }, []);

  return (
    <section className={styles.rail} aria-labelledby="runs-heading">
      <div className={styles.head}>
        <h2 id="runs-heading" className="label">
          Runs
        </h2>
        {state.status === "ready" && <span className={styles.count}>{state.total}</span>}
      </div>
      {state.status === "loading" && <p className="muted">Loading runs…</p>}
      {state.status === "failed" && <p className="loss">{`Couldn't load runs: ${state.message}`}</p>}
      {state.status === "ready" && (
        <ol className={styles.list}>
          {state.runs.map((run) => (
            <li key={run.id}>
              <RunItem run={run} />
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
