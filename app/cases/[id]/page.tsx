import Link from "next/link";
import { notFound } from "next/navigation";
import { STAGES, evidenceOf, getCase, stageIndex, trainingNeeded } from "@/lib/leish";
import { StatusPill } from "@/components/StatusPill";

export const dynamic = "force-dynamic";

export default async function CasePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = await getCase(decodeURIComponent(id));
  if (!c) notFound();

  const stage = stageIndex(c.status);
  const closed = ["rejected", "no_response"].includes((c.status ?? "").toLowerCase());
  const t = trainingNeeded(c);
  const evidence = evidenceOf(c);
  const diagnosed = Boolean(c.primary_cause);

  return (
    <>
      <div className="section">
        <Link href="/cases" className="muted">← All cases</Link>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <div className="section" style={{ gap: 6 }}>
            <div className="eyebrow">{[c.organization, c.department].filter(Boolean).join(" · ") || "Case"}</div>
            <h1 className="mono" style={{ fontSize: "clamp(24px, 4vw, 34px)" }}>{c.case_id}</h1>
          </div>
          <StatusPill status={c.status} />
        </div>
        {!closed && (
          <div className="timeline" aria-label="Progress">
            {STAGES.map((s, i) => (
              <div key={s.key} className={i < stage ? "done" : i === stage ? "now" : ""}>
                <i />
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <section className="section">
        <h2>The request</h2>
        {c.request_text && <p className="quote">&ldquo;{c.request_text}&rdquo;</p>}
        <dl className="kv">
          {c.requester_name && (<><dt>From</dt><dd>{c.requester_name}</dd></>)}
          {c.audience && (<><dt>Affected</dt><dd>{c.audience}</dd></>)}
          {c.target_metric && (<><dt>Metric</dt><dd>{c.target_metric}{c.baseline ? ` · now ${c.baseline}` : ""}{c.target_value ? ` · target ${c.target_value}` : ""}</dd></>)}
          {c.problem_statement && (<><dt>Leish understood</dt><dd>{c.problem_statement}</dd></>)}
        </dl>
      </section>

      {diagnosed ? (
        <section className="section">
          <h2>The diagnosis</h2>
          <div className="verdict">
            <div className="vbox"><span className="eyebrow">Main cause</span><span className="v">{c.primary_cause}</span></div>
            <div className={`vbox ${t === "no" ? "no" : t === "yes" ? "yes" : ""}`}>
              <span className="eyebrow">Training needed?</span>
              <span className="v">{t === "unknown" ? "—" : t === "yes" ? "Yes" : "No"}</span>
            </div>
            <div className="vbox"><span className="eyebrow">Confidence</span><span className="v">{c.confidence || "—"}</span></div>
          </div>
          {c.secondary_causes && <p><b>Other causes:</b> {c.secondary_causes}</p>}
          {c.diagnosis_summary && <p>{c.diagnosis_summary}</p>}
          {evidence.length > 0 && (
            <>
              <h3>Evidence</h3>
              <ol className="evidence">
                {evidence.map((e, i) => (
                  <li key={i}><span>{e.claim}{e.refs && <span className="refs">{e.refs}</span>}</span></li>
                ))}
              </ol>
            </>
          )}
          {c.critic_verdict && (
            <p className="note">Critic agent verdict: <b>{c.critic_verdict}</b>. Every claim was checked against its source before a person saw it.</p>
          )}
        </section>
      ) : (
        !closed && (
          <section className="note">
            The agents are still working on this case. The diagnosis appears here once the investigation and the critic
            check are done. Refresh to update.
          </section>
        )
      )}

      {(c.decision || c.intervention_summary) && (
        <section className="section">
          <h2>Decision and action plan</h2>
          <dl className="kv">
            {c.decision && (<><dt>Decision</dt><dd style={{ textTransform: "capitalize" }}>{c.decision}</dd></>)}
            {c.reviewer_notes && (<><dt>Reviewer notes</dt><dd>{c.reviewer_notes}</dd></>)}
            {c.intervention_summary && (<><dt>Action plan</dt><dd>{c.intervention_summary}</dd></>)}
            {c.measure_on && (<><dt>Measure again on</dt><dd>{c.measure_on.slice(0, 10)}</dd></>)}
          </dl>
          {c.report_url && <a className="btn gold" href={c.report_url} target="_blank" rel="noreferrer">Open the report</a>}
        </section>
      )}
    </>
  );
}
