import { NextResponse } from "next/server";
import { submitRequest, type NewRequest } from "@/lib/leish";

const REQUIRED: (keyof NewRequest)[] = ["organization", "requester_name", "requester_email", "department", "request_text"];

// POST /api/cases: validates the form and forwards it to n8n (LS 01 Intake).
export async function POST(request: Request) {
  let body: Partial<NewRequest>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "The request body must be JSON." }, { status: 400 });
  }

  const missing = REQUIRED.filter((k) => !String(body[k] ?? "").trim());
  if (missing.length) {
    return NextResponse.json({ error: `Please fill in: ${missing.join(", ").replace(/_/g, " ")}.` }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(body.requester_email))) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  // Trim every field and drop anything not in the form.
  const clean = Object.fromEntries(
    (["organization", "requester_name", "requester_email", "department", "request_text", "audience", "target_metric", "baseline", "target_value"] as const)
      .map((k) => [k, String(body[k] ?? "").trim().slice(0, 4000)])
  ) as NewRequest;

  try {
    const result = await submitRequest(clean);
    return NextResponse.json(result, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Leish could not reach the agents right now. Please try again in a minute." }, { status: 502 });
  }
}
