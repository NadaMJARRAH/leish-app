// Talks to the Leish agents in n8n. The browser never calls n8n or Gemini directly:
// every request goes through these server-side helpers, which add the shared secret.
import { DEMO_CASES } from "./demo";

export type LeishCase = {
  case_id: string;
  created_at?: string;
  status?: string;
  organization?: string;
  requester_name?: string;
  requester_email?: string;
  department?: string;
  request_text?: string;
  audience?: string;
  target_metric?: string;
  baseline?: string;
  target_value?: string;
  problem_statement?: string;
  performance_gap?: string;
  primary_cause?: string;
  secondary_causes?: string;
  is_training_needed?: string | boolean;
  confidence?: string;
  diagnosis_summary?: string;
  diagnosis_json?: string;
  critic_verdict?: string;
  decision?: string;
  reviewer_notes?: string;
  intervention_type?: string;
  intervention_summary?: string;
  measure_on?: string;
  report_url?: string;
};

export type NewRequest = {
  organization: string;
  requester_name: string;
  requester_email: string;
  department: string;
  request_text: string;
  audience?: string;
  target_metric?: string;
  baseline?: string;
  target_value?: string;
};

const INTAKE_URL = process.env.N8N_INTAKE_URL;
const CASES_URL = process.env.N8N_CASES_URL;
const API_KEY = process.env.LEISH_API_KEY ?? "";

// Demo mode: when the n8n URLs are not set, the app shows the sample case instead of failing.
export const isDemo = !INTAKE_URL || !CASES_URL;

// Same case id format as LS 01: C-yyyyMMdd-HHmmss in Palestine time.
export function newCaseId(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Hebron",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  return `C-${get("year")}${get("month")}${get("day")}-${get("hour")}${get("minute")}${get("second")}`;
}

// Sends a new request to the Leish Web Intake webhook, which starts LS 01.
export async function submitRequest(req: NewRequest): Promise<{ case_id: string; demo: boolean }> {
  const case_id = newCaseId();
  if (isDemo) return { case_id, demo: true };

  const res = await fetch(INTAKE_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Leish-Key": API_KEY },
    body: JSON.stringify({ case_id, source: "web", ...req }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`n8n intake returned ${res.status}`);
  return { case_id, demo: false };
}

// Reads all cases from the Leish Cases sheet through the LS API · Cases webhook.
export async function listCases(): Promise<LeishCase[]> {
  if (isDemo) return DEMO_CASES;

  const res = await fetch(CASES_URL!, {
    headers: { "X-Leish-Key": API_KEY },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`n8n cases returned ${res.status}`);
  const data = await res.json();
  // Respond to Webhook may return an array of rows, or { data: [...] }.
  const rows: LeishCase[] = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
  return rows
    .filter((r) => r && r.case_id)
    .sort((a, b) => String(b.case_id).localeCompare(String(a.case_id)));
}

export async function getCase(id: string): Promise<LeishCase | undefined> {
  const all = await listCases();
  return all.find((c) => c.case_id === id);
}

// The pipeline stages a user sees, mapped from the status values the workflows write.
export const STAGES = [
  { key: "received", label: "Received" },
  { key: "clarifying", label: "Clarifying" },
  { key: "investigating", label: "Investigating" },
  { key: "diagnosed", label: "Diagnosed" },
  { key: "decision", label: "Human decision" },
  { key: "reported", label: "Action plan" },
] as const;

const STATUS_STAGE: Record<string, number> = {
  new: 0,
  waiting_for_info: 1,
  ready_for_investigation: 2,
  investigating: 2,
  investigated: 2,
  needs_data: 2,
  diagnosed: 4,
  needs_revision: 3,
  awaiting_decision: 4,
  approved: 5,
  designed: 5,
  reported: 6,
};

export function stageIndex(status?: string): number {
  return STATUS_STAGE[(status ?? "new").toLowerCase()] ?? 0;
}

export function statusLabel(status?: string): string {
  const s = (status ?? "new").toLowerCase();
  const labels: Record<string, string> = {
    new: "Received",
    waiting_for_info: "Waiting for requester",
    ready_for_investigation: "Investigating",
    investigating: "Investigating",
    investigated: "Investigating",
    needs_data: "Needs more data",
    diagnosed: "Waiting for approval",
    needs_revision: "Being revised",
    awaiting_decision: "Waiting for approval",
    approved: "Designing the fix",
    designed: "Designing the fix",
    reported: "Report sent",
    rejected: "Rejected",
    no_response: "Closed: no reply",
  };
  return labels[s] ?? s.replace(/_/g, " ");
}

export function trainingNeeded(c: LeishCase): "yes" | "no" | "unknown" {
  const v = String(c.is_training_needed ?? "").toLowerCase();
  if (v === "true" || v === "yes") return "yes";
  if (v === "false" || v === "no") return "no";
  return "unknown";
}

type EvidenceItem = { claim: string; refs: string };

// diagnosis_json holds evidence_used [{claim, refs}] from the Diagnosis Agent.
export function evidenceOf(c: LeishCase): EvidenceItem[] {
  if (!c.diagnosis_json) return [];
  try {
    const d = JSON.parse(c.diagnosis_json);
    const list = d.evidence_used ?? d.evidence ?? [];
    return list.map((e: { claim?: string; refs?: unknown; ref?: unknown; source?: unknown }) => ({
      claim: String(e.claim ?? ""),
      refs: Array.isArray(e.refs) ? e.refs.join(" · ") : String(e.refs ?? e.ref ?? e.source ?? ""),
    })).filter((e: EvidenceItem) => e.claim);
  } catch {
    return [];
  }
}
