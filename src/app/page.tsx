import { API_BASE_URL } from "@/api/client";
import { RunsList } from "@/components/runs-list/RunsList";

import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.shell}>
      <header className={styles.top}>
        <h1 className={styles.mark}>
          trading<span>-</span>dashboard
        </h1>
        <div className={styles.meta}>
          <span className={styles.tag}>{`${API_BASE_URL}/v1`}</span>
          <span>Simulation only. No real money.</span>
        </div>
      </header>
      <RunsList />
      <main className={styles.main}>
        <section className={styles.sheet}>
          <p className="muted">The new-run form and the run view are not built yet.</p>
        </section>
      </main>
    </div>
  );
}
