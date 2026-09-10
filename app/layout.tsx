import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "ApexPM — Agentic PM Internship Discovery Engine for Emmett",
  description: "Multi-agent orchestration discovery and matching engine for Georgia Tech sophomore Emmett. Optimizing for NYC & SF Bay Area PM / APM internships.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#080c16] text-slate-100 min-h-screen antialiased selection:bg-emerald-500/30 selection:text-emerald-200">
        <Navbar />
        <main className="min-h-[calc(100vh-4.5rem)]">{children}</main>
      </body>
    </html>
  );
}
