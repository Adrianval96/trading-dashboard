export type RunStatus =
  "queued" | "running" | "completed" | "failed" | "cancelled";

export interface MarketSelection {
  symbols: string[];
  interval: string;
  start: string;
  end: string;
}

export interface Agent {
  id: string;
  label: string;
  strategy: string;
  parameters: Record<string, number>;
}

export interface Progress {
  steps_done: number;
  steps_total: number | null;
}

export interface Failure {
  message: string;
}

export interface AgentSummary {
  agent_id: string;
  final_equity: number;
  total_return: number;
}

export interface ResultSummary {
  agents: AgentSummary[];
}

export interface RunSummary {
  id: string;
  status: RunStatus;
  created_at: string;
  market: MarketSelection;
  initial_cash: number;
  cost_bps: number;
  agents: Agent[];
  progress: Progress;
  result: ResultSummary | null;
  failure: Failure | null;
}

export interface Page {
  total: number;
  page: number;
  limit: number;
}

export interface RunListEnvelope {
  success: true;
  data: RunSummary[];
  error: null;
  meta: Page;
}

export interface ErrorBody {
  code: string;
  message: string;
}

export interface ErrorEnvelope {
  success: false;
  data: null;
  error: ErrorBody;
  meta: null;
}
