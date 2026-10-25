// Sample cases shown only in demo mode (no n8n URLs configured).
// The first one is the real output of the Leish pipeline on the simulated company Nabd.
import type { LeishCase } from "./leish";

export const DEMO_CASES: LeishCase[] = [
  {
    case_id: "C-20261008-213517",
    created_at: "2026-10-08 21:35",
    status: "reported",
    organization: "Nabd Software (simulated)",
    requester_name: "Lina Haddad",
    department: "Customer Support",
    request_text: "Our support agents need training on the refund policy. Customers keep complaining.",
    audience: "Customer support agents, mostly in their first 3 months",
    target_metric: "refund escalation rate",
    baseline: "31%",
    target_value: "under 10%",
    primary_cause: "information",
    secondary_causes: "resources, incentives",
    is_training_needed: "false",
    confidence: "high",
    critic_verdict: "approve",
    decision: "approve",
    diagnosis_summary:
      "The primary cause is information. 73% of refund tickets come from the Help Center FAQ contradicting the official Refund Policy (14 days from activation vs 14 days from purchase). Knowledge gaps exist but explain only 12% of tickets, and agents rate their skills 4.1/5. Training is not needed. Secondary causes: the billing tool hides the activation date, and escalating feels safer than deciding.",
    diagnosis_json: JSON.stringify({
      evidence_used: [
        { claim: "73% of refund tickets (24/33) come from the FAQ contradicting the official policy.", refs: ["T-6009", "T-6016", "T-6019"] },
        { claim: "15% of refund tickets (5/33) come from the billing tool hiding the activation date.", refs: ["T-6013", "T-6020", "T-6030"] },
        { claim: "12% of refund tickets (4/33) show a knowledge gap on prorated refunds.", refs: ["T-6061", "T-6077", "T-6095"] },
        { claim: "Survey: 'Rules and expectations are clear' scores 2/5; team leads disagree on which document to follow.", refs: ["S1", "S2", "S10", "I1"] },
        { claim: "Refund Policy v2 and the Help Center FAQ define the refund window differently.", refs: ["Refund Policy v2", "Help Center FAQ"] },
      ],
    }),
    intervention_type: "information",
    intervention_summary:
      "Align the Refund Policy and the Help Center FAQ into one source of truth (owner: Customer Support Manager). Ask IT to show the activation date on the main refund screen. Add refund accuracy to the team scorecard.",
    measure_on: "2026-11-07",
  },
  {
    case_id: "C-20261012-101204",
    created_at: "2026-10-12 10:12",
    status: "ready_for_investigation",
    organization: "Nabd Software (simulated)",
    requester_name: "Omar Saleh",
    department: "Sales",
    request_text: "Our sales reps need CRM training. Half of the calls are not logged.",
    audience: "Inside sales reps",
    target_metric: "calls logged in CRM",
    baseline: "42%",
    target_value: "80%",
  },
];
