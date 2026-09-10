"use client";

import { EMMETT_PROFILE } from "@/lib/candidate-profile";
import { 
  GraduationCap, 
  MapPin, 
  Award, 
  Briefcase, 
  Calculator, 
  Users, 
  ShieldCheck,
  Building2,
  CheckCircle2,
  Radio
} from "lucide-react";

export function CandidateHeader() {
  return (
    <div className="w-full bg-gradient-to-b from-[#0b1222] via-[#0d172c] to-[#080c16] border-b border-slate-800/80 pt-6 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Main Banner */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            {/* Avatar / GT Monogram */}
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#B3A369] via-[#8c7b46] to-[#003057] p-[2px] shadow-xl">
                <div className="w-full h-full bg-[#0a1120] rounded-[14px] flex flex-col items-center justify-center">
                  <span className="text-[#B3A369] font-black text-xl tracking-tighter">GT</span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">PM</span>
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#080c16] flex items-center justify-center shadow">
                <ShieldCheck className="w-3 h-3 text-white" />
              </div>
            </div>

            {/* Core Info */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {EMMETT_PROFILE.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Summer 2027 Verified Opportunities
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#B3A369]/15 text-[#f1e6b8] border border-[#B3A369]/40 flex items-center gap-1">
                  <Award className="w-3 h-3 text-[#B3A369]" />
                  4.0 Cumulative GPA
                </span>
              </div>

              <p className="text-sm text-slate-300 font-medium flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="text-white font-semibold">{EMMETT_PROFILE.university}</span>
                <span className="text-slate-500">•</span>
                <span className="text-amber-200/90">{EMMETT_PROFILE.major}</span>
                <span className="text-slate-500">•</span>
                <span className="text-indigo-300 font-semibold">{EMMETT_PROFILE.minor}</span>
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                <span className="text-xs px-2.5 py-0.5 rounded bg-slate-800/90 text-slate-300 border border-slate-700/60 font-medium">
                  Denning Technology & Management (T&M) Scholar
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded bg-slate-800/90 text-slate-300 border border-slate-700/60 font-medium">
                  Scheller Business Ambassador
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  All Links Verified Active
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats Badges */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            {/* Primary Location Priority Card */}
            <div className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-left min-w-[160px]">
              <div className="flex items-center justify-between text-emerald-400 text-xs font-semibold mb-0.5">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  Primary Location
                </span>
                <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.2 rounded font-bold">
                  1.00 wt
                </span>
              </div>
              <div className="text-sm font-bold text-white">New York City (NYC)</div>
              <div className="text-[11px] text-emerald-300/80">100 pts Base Allocation</div>
            </div>

            {/* Secondary Location Priority Card */}
            <div className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-indigo-950/20 border border-indigo-500/30 text-left min-w-[160px]">
              <div className="flex items-center justify-between text-indigo-400 text-xs font-semibold mb-0.5">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" />
                  Secondary Location
                </span>
                <span className="text-[10px] bg-indigo-500/20 px-1.5 py-0.2 rounded font-bold">
                  0.85 wt
                </span>
              </div>
              <div className="text-sm font-bold text-white">SF Bay Area</div>
              <div className="text-[11px] text-indigo-300/80">85 pts Base Allocation</div>
            </div>
          </div>
        </div>

        {/* Leadership & Formula Ribbons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {/* Leadership 1: Finance Club */}
          <div className="p-3 rounded-xl bg-[#0f192d]/80 border border-slate-800 text-xs flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <Calculator className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="font-semibold text-white">Finance Director • GT Finance Club</div>
              <div className="text-slate-400 text-[11px] mt-0.5">
                Directs $45K+ operational budget, unit-economic models & corporate banking sponsorships.
              </div>
            </div>
          </div>

          {/* Leadership 2: Startup Club */}
          <div className="p-3 rounded-xl bg-[#0f192d]/80 border border-slate-800 text-xs flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <Users className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <div className="font-semibold text-white">VP of Recruiting • GT Startup Exchange</div>
              <div className="text-slate-400 text-[11px] mt-0.5">
                Heads venture scouting, founder vetting (60+ teams), and direct YC talent pipelines.
              </div>
            </div>
          </div>

          {/* Ranking Algorithm Capsule */}
          <div className="p-3 rounded-xl bg-[#0f192d]/80 border border-amber-500/20 text-xs flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
            </div>
            <div className="w-full">
              <div className="flex items-center justify-between font-semibold text-amber-300">
                <span>Weighted Apex Formula</span>
                <span className="text-[10px] text-slate-400">Total 100%</span>
              </div>
              <div className="text-[11px] text-slate-300 mt-1 flex items-center justify-between gap-1">
                <span>Loc: <strong className="text-emerald-400">30%</strong></span>
                <span>•</span>
                <span>Prestige: <strong className="text-amber-300">25%</strong></span>
                <span>•</span>
                <span>Fit: <strong className="text-indigo-400">25%</strong></span>
                <span>•</span>
                <span>Trajectory: <strong className="text-teal-300">20%</strong></span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
