import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { isDemo } from "@/lib/leish";

export const metadata: Metadata = {
  title: "Leish · Is training really the answer?",
  description: "AI performance diagnosis for training consultancies and L&D teams.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Sans+Arabic:wght@600&family=IBM+Plex+Mono:wght@500&display=swap"
        />
      </head>
      <body>
        {isDemo && (
          <div className="demo-banner">Demo mode: showing sample cases. Connect n8n to run real diagnoses.</div>
        )}
        <div className="wrap">
          <nav className="nav">
            <Link href="/" className="logo">
              LEISH<span className="dot">·</span><span className="ar">ليش؟</span>
            </Link>
            <div className="navlinks">
              <Link href="/cases">Cases</Link>
              <Link href="/new" className="btn small primary">New diagnosis</Link>
            </div>
          </nav>
          <main>{children}</main>
          <footer className="footer">
            <span>Leish · AI performance diagnosis</span>
            <span>Built with n8n agents, Gemini and Next.js</span>
          </footer>
        </div>
      </body>
    </html>
  );
}
