import Link from "next/link";
import { listCases, trainingNeeded, type LeishCase } from "@/lib/leish";
import { StatusPill } from "@/components/StatusPill";

export const dynamic = "force-dynamic";

export default async function Cases() {
  let cases: LeishCase[] = [];
  let failed = false;
  try {
    cases = await listCases();
  } catch (e) {
    console.error(e);
    failed = true;
  }

  return (
    <>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <div className="section">
          <div className="eyebrow">All cases</div>
          <h1>Cases</h1>
        </div>
        <Link href="/new" className="btn primary">New diagnosis</Link>
      </div>

      {failed ? (
        <div className="empty">
          <h3>Leish could not load the cases</h3>
          <p className="muted">The n8n cases webhook did not answer. Check that the workflow is active, then refresh.</p>
        </div>
      ) : cases.length === 0 ? (
        <div className="empty">
          <h3>No cases yet</h3>
          <p className="muted">Start the first diagnosis and it will appear here.</p>
          <Link href="/new" className="btn primary">Start a diagnosis</Link>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Case</th><th>Organization</th><th>Department</th><th>Request</th><th>Status</th><th>Main cause</th><th>Training?</th></tr>
            </thead>
            <tbody>
              {cases.map((c) => {
                const t = trainingNeeded(c);
                return (
                  <tr key={c.case_id}>
                    <td><Link href={`/cases/${c.case_id}`} className="mono">{c.case_id}</Link></td>
                    <td>{c.organization || "—"}</td>
                    <td>{c.department || "—"}</td>
                    <td style={{ minWidth: 220 }}>{c.request_text ? truncate(c.request_text, 90) : "—"}</td>
                    <td><StatusPill status={c.status} /></td>
                    <td style={{ textTransform: "capitalize" }}>{c.primary_cause || "—"}</td>
                    <td>{t === "unknown" ? "—" : t === "yes" ? "Yes" : "No"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}
