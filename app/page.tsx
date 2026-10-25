"use client";

import { useEffect } from "react";
import "./landing.css";
import { LANDING_HTML } from "@/lib/landingHtml";
import { initLanding } from "@/lib/landingScript";

export default function Home() {
  useEffect(() => {
    initLanding();
  }, []);
  return <div className="landing" dangerouslySetInnerHTML={{ __html: LANDING_HTML }} />;
}
