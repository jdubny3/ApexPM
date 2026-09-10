"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Compass, 
  Kanban, 
  Sparkles, 
  FileText, 
  Cpu,
  GraduationCap
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Executive Feed", href: "/", icon: Compass },
    { label: "Pipeline Tracker", href: "/tracker", icon: Kanban },
    { label: "Agent Pipeline Runner", href: "/pipeline", icon: Cpu },
    { label: "Pitch & Cover Letter", href: "/generator", icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#080c16]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-emerald-500 to-indigo-500 p-[2px] shadow-lg shadow-emerald-500/10">
              <div className="w-full h-full bg-[#0b1120] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-emerald-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                  ApexPM
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Agentic Engine
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Georgia Tech APM Matching Engine
              </p>
            </div>
          </Link>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-1 ml-4 pl-4 border-l border-slate-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-slate-800 text-emerald-400 border border-slate-700/80 shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Emmett Persona Badge & Quick Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#0d1629] border border-amber-500/20 text-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-medium">Emmett</span>
            <span className="text-slate-500">•</span>
            <div className="flex items-center gap-1 text-amber-300/90 font-medium">
              <GraduationCap className="w-3.5 h-3.5 text-[#B3A369]" />
              <span>Georgia Tech &apos;29</span>
            </div>
            <span className="px-1.5 py-0.2 rounded bg-amber-400/10 text-amber-300 text-[10px] font-bold border border-amber-400/30">
              4.0 GPA
            </span>
          </div>

          <Link
            href="/pipeline"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-md shadow-emerald-950/40 transition-all active:scale-95"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Run Pipeline</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
