import type { Metadata } from "next";
import "./globals.css";
import "./hud-ui.css";
import "./command-center.css";
import "./hero-animation.css";
import "./interaction-effects.css";
import "./space-science-missions.css";
import "./mission-operations.css";
import "./stellar-signal.css";
import "./simulation-matrix.css";
import "./shared-astronomy-model.css";
import "./planet-interior.css";
import "./planetary-science.css";
import "./celestial-bodies.css";
import { Navigation } from "@/components/Navigation";
import { SceneDirector } from "@/components/SceneDirector";

export const metadata: Metadata = { title: "theplanets / EXPLORER", description: "An interactive field guide to our solar system." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><Navigation /><main className="page-transition">{children}</main><SceneDirector /><footer><span>theplanets / EXPLORER</span><span>DATASET 01 — SOLAR SYSTEM</span></footer></body></html>;
}
