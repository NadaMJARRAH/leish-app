import Link from "next/link";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="eyebrow">AI performance diagnosis for training consultancies and L&amp;D teams</div>
        <h1>
          Is training really <em>the answer?</em>
        </h1>
        <p className="lede">
          A manager asks for a course. Leish reads the company&apos;s tickets, surveys, interviews and policies, finds out why
          the performance gap happens, and shows the evidence. A person approves before anything is designed.
        </p>
        <div className="row">
          <Link href="/new" className="btn primary">Start a diagnosis</Link>
          <Link href="/cases" className="btn">See cases</Link>
        </div>
      </section>

      <section className="section">
        <div className="eyebrow">What happens after you submit</div>
        <div className="steps">
          <div><span className="k">01 Intake</span><b>Clarify the ask</b><span className="muted">Up to 3 questions by email</span></div>
          <div><span className="k">02 Investigate</span><b>Gather evidence</b><span className="muted">Tickets, surveys, interviews, documents</span></div>
          <div><span className="k">03 Diagnose</span><b>Find the cause</b><span className="muted">Gilbert&apos;s six causes, checked by a critic agent</span></div>
          <div className="human"><span className="k">04 Approve</span><b>Human decision</b><span className="muted">Approve, revise or reject by email</span></div>
          <div><span className="k">05 Act</span><b>Action plan</b><span className="muted">PDF report with owner and KPI re-check date</span></div>
        </div>
      </section>

      <section className="grid3">
        <div className="card">
          <h3>For training consultancies</h3>
          <p className="muted">Run a needs analysis for each client in hours instead of weeks, with a report you can hand over.</p>
        </div>
        <div className="card">
          <h3>For in-house L&amp;D</h3>
          <p className="muted">Answer &ldquo;we need a course&rdquo; with evidence, and spend the budget where it changes the number.</p>
        </div>
        <div className="card">
          <h3>For operations leaders</h3>
          <p className="muted">See whether a support, sales or operations dip comes from people, tools, rules or incentives.</p>
        </div>
      </section>
    </>
  );
}
