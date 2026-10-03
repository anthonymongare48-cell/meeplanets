import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { SceneDirector } from "@/components/SceneDirector";

export const metadata: Metadata = { title: "theplanets / EXPLORER", description: "An interactive field guide to our solar system." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><Navigation /><main className="page-transition">{children}</main><SceneDirector /><footer><span>theplanets / EXPLORER</span><span>DATASET 01 — SOLAR SYSTEM</span></footer></body></html>;
}
