import { statusLabel } from "@/lib/leish";

export function StatusPill({ status }: { status?: string }) {
  const s = (status ?? "new").toLowerCase();
  const tone = ["reported", "approved", "designed"].includes(s)
    ? "ok"
    : ["diagnosed", "awaiting_decision", "needs_data", "waiting_for_info"].includes(s)
      ? "warn"
      : ["rejected", "no_response"].includes(s)
        ? "bad"
        : "";
  return <span className={`pill ${tone}`}>{statusLabel(status)}</span>;
}
