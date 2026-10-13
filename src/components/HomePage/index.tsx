"use client";

import { useEffect, useState } from "react";

import { RunsList, type RunsListState } from "@/components/RunsList";
import { API_BASE_URL, listRuns } from "@/services/strategyArena";
import "./styles.css";

export function HomePage() {
  const [runs, setRuns] = useState<RunsListState>({ status: "loading" });

  useEffect(() => {
    listRuns()
      .then(({ data, meta }) =>
        setRuns({ status: "ready", runs: data, total: meta.total }),
      )
      .catch((error: Error) =>
        setRuns({ status: "failed", message: error.message }),
      );
  }, []);

  return (
    <div className="home-page">
      <header className="home-page__header">
        <h1 className="home-page__mark">
          trading<span>-</span>dashboard
        </h1>
        <div className="home-page__meta">
          <span className="home-page__tag">{`${API_BASE_URL}/v1`}</span>
          <span>Simulation only. No real money.</span>
        </div>
      </header>
      <RunsList state={runs} />
      <main className="home-page__main">
        <section className="home-page__sheet">
          <p className="muted">
            The new-run form and the run view are not built yet.
          </p>
        </section>
      </main>
    </div>
  );
}
