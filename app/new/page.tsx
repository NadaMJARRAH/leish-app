"use client";

import Link from "next/link";
import { useState } from "react";

type Result = { case_id: string; demo: boolean };

export default function NewDiagnosis() {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSending(true);
    const body = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSending(false);
    }
  }

  if (result) {
    return (
      <div className="success">
        <div className="eyebrow">Request received</div>
        <h2>Case {result.case_id}</h2>
        {result.demo ? (
          <p>Demo mode is on, so no agents ran. Connect n8n to start a real diagnosis.</p>
        ) : (
          <p>
            Leish is checking your request now. If anything is missing, you will get an email with up to three short
            questions. The case page updates as each agent finishes.
          </p>
        )}
        <div className="row">
          <Link href={`/cases/${result.case_id}`} className="btn primary">Open the case</Link>
          <button className="btn" type="button" onClick={() => setResult(null)}>Submit another</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="section">
        <div className="eyebrow">New diagnosis</div>
        <h1>What performance problem should Leish look at?</h1>
        <p className="lede">Write the request the way the manager said it. Leish will ask for anything else it needs.</p>
      </div>

      <form className="form" onSubmit={onSubmit}>
        <fieldset>
          <legend>Who is asking</legend>
          <div className="fields two">
            <div className="field">
              <label htmlFor="organization">Client organization</label>
              <input id="organization" name="organization" required placeholder="Nabd Software" />
              <span className="hint">Consultancies: the client company this case is for.</span>
            </div>
            <div className="field">
              <label htmlFor="department">Department</label>
              <input id="department" name="department" required placeholder="Customer Support" />
            </div>
            <div className="field">
              <label htmlFor="requester_name">Your name</label>
              <input id="requester_name" name="requester_name" required autoComplete="name" />
            </div>
            <div className="field">
              <label htmlFor="requester_email">Your email</label>
              <input id="requester_email" name="requester_email" type="email" required autoComplete="email" />
              <span className="hint">Follow-up questions and the final report go here.</span>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>The request</legend>
          <div className="fields">
            <div className="field full">
              <label htmlFor="request_text">What was asked for, and why?</label>
              <textarea
                id="request_text"
                name="request_text"
                required
                placeholder="Our support agents need training on the refund policy. Customers keep complaining."
              />
            </div>
            <div className="field full">
              <label htmlFor="audience">Who is affected? <span className="hint">(optional)</span></label>
              <input id="audience" name="audience" placeholder="New support agents in their first 3 months" />
            </div>
            <div className="field">
              <label htmlFor="target_metric">Which number shows the problem? <span className="hint">(optional)</span></label>
              <input id="target_metric" name="target_metric" placeholder="Refund escalation rate" />
            </div>
            <div className="field">
              <label htmlFor="baseline">Value now <span className="hint">(optional)</span></label>
              <input id="baseline" name="baseline" placeholder="31%" />
            </div>
            <div className="field">
              <label htmlFor="target_value">Target value <span className="hint">(optional)</span></label>
              <input id="target_value" name="target_value" placeholder="Under 10%" />
            </div>
          </div>
        </fieldset>

        {error && <p className="error" role="alert">{error}</p>}
        <div className="row">
          <button className="btn primary" type="submit" disabled={sending}>
            {sending ? "Sending to Leish…" : "Start diagnosis"}
          </button>
          <span className="hint">Leish never decides alone. A person approves the diagnosis.</span>
        </div>
      </form>
    </>
  );
}
