# Leish · ليش؟

**Is training really the answer?** Leish is an AI performance-diagnosis tool for training consultancies and L&D teams. A manager asks for a course; Leish reads the company's tickets, surveys, interviews and policies, finds the real cause of the performance gap (Gilbert's Behavior Engineering Model), and a person approves the diagnosis before any fix is designed.

This repository is the web app. The AI agents run in **n8n** (LS 01 to LS 07 workflows, Gemini, Qdrant). The app never calls the AI directly.

```
Browser ──> Next.js (this app) ──X-Leish-Key──> n8n webhooks ──> LS 01 Intake → LS 02 Investigation → LS 05 Diagnosis + Critic → LS 06 Approval → LS 07 Report
                     ▲                                                                                                       │
                     └──────────────────────────── reads the "Leish Cases" sheet via LS API · Cases ─────────────────────────┘
```

## Pages
- `/` what Leish does
- `/new` submit a diagnosis request (goes to LS 01)
- `/cases` all cases with live status
- `/cases/[id]` request, diagnosis, evidence, decision and action plan

## Run locally
```bash
npm install
cp .env.example .env.local   # fill in the n8n webhook URLs and the shared key
npm run dev
```
Without the n8n variables the app runs in **demo mode** with sample cases.

## Environment variables
| Name | What |
|------|------|
| `N8N_INTAKE_URL` | Production URL of the web-intake webhook (POST) that starts LS 01 |
| `N8N_CASES_URL` | Production URL of the `LS API · Cases` webhook (GET) that returns the rows of Leish Cases |
| `LEISH_API_KEY` | Shared secret; n8n checks it with Header Auth, header name `X-Leish-Key` |

## Deploy
Import the repository in Vercel, add the three variables, deploy.
