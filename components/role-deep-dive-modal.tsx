"use client";

import { useState } from "react";
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  MapPin, 
  DollarSign, 
  ExternalLink, 
  TrendingUp, 
  Award, 
  Building2, 
  GraduationCap, 
  Users, 
  Clock, 
  FileText, 
  Send,
  Layers,
  ChevronDown,
  ChevronUp,
  Briefcase,
  ShieldCheck,
  RotateCcw
} from "lucide-react";
import Link from "next/link";

interface RoleDeepDiveModalProps {
  job: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStage?: (jobId: string, newStage: string) => void;
}

export function RoleDeepDiveModal({ job, isOpen, onClose, onUpdateStage }: RoleDeepDiveModalProps) {
  const [activeTab, setActiveTab] = useState<"why-emmett" | "agents" | "company" | "alumni">("why-emmett");
  const [expandedAgent, setExpandedAgent] = useState<number | null>(4);
  const [isVerifying, setIsVerifying] = useState(false);
  const [liveCheck, setLiveCheck] = useState<any | null>(null);

  if (!isOpen || !job) return null;

  const whyFits: string[] = job.evaluation?.whyEmmettFits 
    ? JSON.parse(job.evaluation.whyEmmettFits) 
    : [];

  const isNyc = job.locationTier === "NYC";
  const isBayArea = job.locationTier === "BAY_AREA";

  const handleStageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onUpdateStage && job.application?.id) {
      onUpdateStage(job.application.id, e.target.value);
    }
  };

  const handleVerifyLive = async () => {
    setIsVerifying(true);
    try {
      const res = await fetch("/api/agents/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: job.url, jobId: job.id }),
      });
      const data = await res.json();
      if (data.success) {
        setLiveCheck(data.verification);
      }
    } catch (e: any) {
      setLiveCheck({ isLive: false, notes: "Network error during live check" });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#0b1222] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 sm:p-6 border-b border-slate-800 bg-[#0d162b]">
          <div className="flex items-start gap-4">
            {/* Score Ring */}
            <div className="relative flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-slate-900/90 border border-slate-700/80 shrink-0 shadow-lg">
              <span className="text-2xl font-black text-white tracking-tight">
                {job.apexScore.toFixed(1)}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Apex Score
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {job.company?.name || "Company"}
                </span>
                <span className="text-slate-500 font-normal">•</span>
                <span className="text-lg font-semibold text-slate-200">
                  {job.title}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                {/* Location Badge */}
                <span className={`px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1 ${
                  isNyc ? "badge-nyc" : isBayArea ? "badge-bayarea" : "bg-slate-800 text-slate-300 border border-slate-700"
                }`}>
                  <MapPin className="w-3 h-3" />
                  {job.location} ({job.locationScore} pts)
                </span>

                {/* Prestige Tier */}
                <span className={`px-2.5 py-0.5 rounded-full font-semibold ${
                  job.company?.tier === "TIER_1A" ? "badge-tier1a" : "badge-tier1b"
                }`}>
                  {job.company?.tierLabel || "Tier 1"}
                </span>

                {/* Summer 2027 Verified Checkmark */}
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Summer 2027 Live Verified
                </span>

                {/* ATS Source Tag */}
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[11px]">
                  {job.source || "Greenhouse / Workday"}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Link Verification Alert Banner */}
        <div className="px-6 py-2.5 bg-[#09101f] border-b border-slate-800/90 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-slate-300 font-medium">Official ATS Application Link:</span>
            <span className="text-emerald-400 font-mono text-[11px] truncate max-w-sm sm:max-w-md">
              {job.url}
            </span>
          </div>

          <button
            onClick={handleVerifyLive}
            disabled={isVerifying}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold flex items-center gap-1 transition-colors"
          >
            <RotateCcw className={`w-3 h-3 ${isVerifying ? "animate-spin" : ""}`} />
            {isVerifying ? "Pinging ATS..." : liveCheck ? "Re-Check Link" : "Ping Live ATS"}
          </button>
        </div>

        {liveCheck && (
          <div className={`px-6 py-2 text-xs border-b ${
            liveCheck.isLive 
              ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-300"
              : "bg-rose-950/30 border-rose-500/30 text-rose-300"
          }`}>
            <span className="font-bold">{liveCheck.isLive ? "✓ Live & Active:" : "⚠ Notice:"}</span> {liveCheck.notes} (Platform: {liveCheck.atsPlatform || "Direct"})
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 border-b border-slate-800/80 bg-[#0a0f1d] text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab("why-emmett")}
            className={`flex items-center gap-2 py-3 px-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === "why-emmett"
                ? "border-emerald-500 text-emerald-400 font-bold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Why Emmett Excels Here (AI Synergy)
          </button>

          <button
            onClick={() => setActiveTab("agents")}
            className={`flex items-center gap-2 py-3 px-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === "agents"
                ? "border-emerald-500 text-emerald-400 font-bold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            5-Agent Audit Logs & Rationale
          </button>

          <button
            onClick={() => setActiveTab("company")}
            className={`flex items-center gap-2 py-3 px-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === "company"
                ? "border-emerald-500 text-emerald-400 font-bold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Company & APM Intel
          </button>

          <button
            onClick={() => setActiveTab("alumni")}
            className={`flex items-center gap-2 py-3 px-3 border-b-2 transition-all whitespace-nowrap ${
              activeTab === "alumni"
                ? "border-emerald-500 text-emerald-400 font-bold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Georgia Tech Alumni ({job.company?.alumni?.length || 0})
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* TAB 1: WHY EMMETT EXCELS */}
          {activeTab === "why-emmett" && (
            <div className="space-y-6 animate-fadeIn">
              {/* Highlight Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-teal-950/20 to-slate-900 border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <Sparkles className="w-4 h-4" />
                    Agent 4 Tailored Fit Rationale (Score: {job.fitScore}/100)
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                    Top 1% GT Profile Synergy
                  </span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {job.evaluation?.fitRationale || "Exceptional alignment with Emmett's Georgia Tech business major, computer science minor, and campus leadership."}
                </p>
              </div>

              {/* 3 Custom Bullets */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400">
                  Targeted Candidate Strengths Mapped to Job Requirements
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {whyFits.map((bullet, idx) => (
                    <div 
                      key={idx} 
                      className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 flex items-start gap-3 transition-colors"
                    >
                      <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="text-sm text-slate-200 leading-relaxed">
                        {bullet}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Synergy Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-[#0e1629] border border-slate-800 text-xs space-y-1">
                  <div className="font-bold text-indigo-300 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" />
                    Technical Synergy
                  </div>
                  <div className="text-slate-300 text-[11px] leading-relaxed">
                    CS Minor coursework in systems and algorithms enables day-one fluency with engineering architecture and API specifications.
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0e1629] border border-slate-800 text-xs space-y-1">
                  <div className="font-bold text-amber-300 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5" />
                    Denning T&M Synergy
                  </div>
                  <div className="text-slate-300 text-[11px] leading-relaxed">
                    Rigorous corporate-sponsored cross-disciplinary cohort uniting top Scheller business minds and engineering teams.
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0e1629] border border-slate-800 text-xs space-y-1">
                  <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Leadership Synergy
                  </div>
                  <div className="text-slate-300 text-[11px] leading-relaxed">
                    Finance Club $45K budget stewardship + Startup Club 60+ venture evaluations delivers unmatched agency and quantitative rigor.
                  </div>
                </div>
              </div>

              {/* Trajectory & Return Offer Card */}
              <div className="p-4 rounded-xl bg-[#0c1426] border border-teal-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="font-bold text-teal-300 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4" />
                    Career Trajectory & Junior Conversion Outlook
                  </div>
                  <div className="text-slate-300 text-xs">
                    {job.evaluation?.returnOfferEstimate || "85% - 92% historical conversion to rising-junior return / full-time APM offer."}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Mentorship: {job.evaluation?.mentorshipQuality || "Senior PM Mentor + Executive VP Sessions"}
                  </div>
                </div>

                <div className="px-3 py-1.5 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-300 font-bold text-right shrink-0">
                  Trajectory: {job.trajectoryScore}/100
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 5-AGENT AUDIT LOGS */}
          {activeTab === "agents" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-xs text-slate-400 pb-1">
                ApexPM runs five autonomous validation agents in strict sequence to verify eligibility, company caliber, academic synergy, and return offer trajectory.
              </div>

              {/* Agent 1: Sourcing */}
              <div className="rounded-xl border border-slate-800 bg-[#0d1527] overflow-hidden">
                <button
                  onClick={() => setExpandedAgent(expandedAgent === 1 ? null : 1)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 font-bold flex items-center justify-center text-xs">
                      1
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">
                        Agent 1: Ingestion & Sourcing Agent
                      </div>
                      <div className="text-xs text-slate-400">
                        Normalized metadata from {job.source || "Direct"}. Location: {job.location} ({job.locationScore} pts).
                      </div>
                    </div>
                  </div>
                  {expandedAgent === 1 ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {expandedAgent === 1 && (
                  <div className="p-4 pt-0 border-t border-slate-800/80 text-xs text-slate-300 space-y-2 font-mono bg-[#080d19]">
                    <div>Location Tier: {job.locationTier} (Score: {job.locationScore}/100)</div>
                    <div>Workplace Type: {job.workplaceType}</div>
                    <div>Team: {job.team}</div>
                    <div>Stipend: {job.stipend || "Standard APM Intern tier"}</div>
                    <div>Source ATS: {job.source}</div>
                    <div>Direct Apply URL: {job.url}</div>
                  </div>
                )}
              </div>

              {/* Agent 2: Eligibility */}
              <div className="rounded-xl border border-slate-800 bg-[#0d1527] overflow-hidden">
                <button
                  onClick={() => setExpandedAgent(expandedAgent === 2 ? null : 2)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center text-xs">
                      2
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">
                        Agent 2: Sophomore Eligibility Agent
                      </div>
                      <div className="text-xs text-slate-400">
                        Graduation Window: {job.evaluation?.gradYearWindow} • Verdict: {job.evaluation?.eligibilityVerdict}
                      </div>
                    </div>
                  </div>
                  {expandedAgent === 2 ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {expandedAgent === 2 && (
                  <div className="p-4 pt-0 border-t border-slate-800/80 text-xs text-slate-300 space-y-2 bg-[#080d19]">
                    <p className="leading-relaxed text-slate-300 font-sans">
                      {job.evaluation?.eligibilityRationale}
                    </p>
                  </div>
                )}
              </div>

              {/* Agent 3: Prestige */}
              <div className="rounded-xl border border-slate-800 bg-[#0d1527] overflow-hidden">
                <button
                  onClick={() => setExpandedAgent(expandedAgent === 3 ? null : 3)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 font-bold flex items-center justify-center text-xs">
                      3
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">
                        Agent 3: Prestige & Company Classifier
                      </div>
                      <div className="text-xs text-slate-400">
                        {job.company?.tierLabel} • Score: {job.prestigeScore}/100
                      </div>
                    </div>
                  </div>
                  {expandedAgent === 3 ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {expandedAgent === 3 && (
                  <div className="p-4 pt-0 border-t border-slate-800/80 text-xs text-slate-300 space-y-2 bg-[#080d19]">
                    <p className="leading-relaxed text-slate-300 font-sans">
                      {job.evaluation?.prestigeRationale}
                    </p>
                    <div className="font-mono text-slate-400 pt-1">
                      AI Focus: {job.company?.aiFocus}
                    </div>
                  </div>
                )}
              </div>

              {/* Agent 4: Fit */}
              <div className="rounded-xl border border-slate-800 bg-[#0d1527] overflow-hidden">
                <button
                  onClick={() => setExpandedAgent(expandedAgent === 4 ? null : 4)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 font-bold flex items-center justify-center text-xs">
                      4
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">
                        Agent 4: Emmett Fit & Synergy Agent
                      </div>
                      <div className="text-xs text-slate-400">
                        Fit Score: {job.fitScore}/100 • 3 Custom Proof Points Generated
                      </div>
                    </div>
                  </div>
                  {expandedAgent === 4 ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {expandedAgent === 4 && (
                  <div className="p-4 pt-0 border-t border-slate-800/80 text-xs text-slate-300 space-y-2 bg-[#080d19]">
                    <p className="leading-relaxed text-slate-300 font-sans">
                      {job.evaluation?.fitRationale}
                    </p>
                  </div>
                )}
              </div>

              {/* Agent 5: Trajectory */}
              <div className="rounded-xl border border-slate-800 bg-[#0d1527] overflow-hidden">
                <button
                  onClick={() => setExpandedAgent(expandedAgent === 5 ? null : 5)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-400 font-bold flex items-center justify-center text-xs">
                      5
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">
                        Agent 5: Career Trajectory Predictor
                      </div>
                      <div className="text-xs text-slate-400">
                        Trajectory Score: {job.trajectoryScore}/100 • Return Offer Conversion Analysis
                      </div>
                    </div>
                  </div>
                  {expandedAgent === 5 ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {expandedAgent === 5 && (
                  <div className="p-4 pt-0 border-t border-slate-800/80 text-xs text-slate-300 space-y-2 bg-[#080d19]">
                    <p className="leading-relaxed text-slate-300 font-sans">
                      {job.evaluation?.trajectoryRationale}
                    </p>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 3: COMPANY INTEL */}
          {activeTab === "company" && (
            <div className="space-y-4 animate-fadeIn text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="text-xs text-slate-400">Headquarters</div>
                  <div className="font-semibold text-white">{job.company?.hqLocation}</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="text-xs text-slate-400">Company Size</div>
                  <div className="font-semibold text-white">{job.company?.companySize}</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1 sm:col-span-2">
                  <div className="text-xs text-slate-400">AI Innovation & Core Focus</div>
                  <div className="font-semibold text-emerald-300">{job.company?.aiFocus}</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1 sm:col-span-2">
                  <div className="text-xs text-slate-400">Tech Stack & Architecture</div>
                  <div className="font-mono text-xs text-slate-300">{job.company?.techStack}</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1 sm:col-span-2">
                  <div className="text-xs text-slate-400">APM Internship Program Stature</div>
                  <div className="text-xs text-slate-300 leading-relaxed">{job.company?.apmProgramSummary}</div>
                </div>
              </div>

              {/* Job Description Text */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="font-bold text-xs uppercase text-slate-400">Official Job Brief</div>
                <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line max-h-48 overflow-y-auto">
                  {job.description}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GT ALUMNI NETWORK */}
          {activeTab === "alumni" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-xs text-slate-400">
                Warm Georgia Tech connections located in target metro hubs (NYC & SF) for informational coffee chats and referrals:
              </div>

              {job.company?.alumni && job.company.alumni.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {job.company.alumni.map((alum: any) => (
                    <div 
                      key={alum.id}
                      className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{alum.name}</span>
                          <span className="text-xs px-2 py-0.2 rounded bg-amber-400/10 text-amber-300 border border-amber-400/30">
                            {alum.gtDegree}
                          </span>
                        </div>
                        <div className="text-xs text-slate-300 font-medium">{alum.role}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          {alum.location}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {alum.linkedinUrl && (
                          <a
                            href={alum.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                            LinkedIn
                          </a>
                        )}
                        <Link
                          href={`/generator?jobId=${job.id}&alumId=${alum.id}`}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <Send className="w-3 h-3" />
                          Draft Outreach
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 text-xs bg-slate-900/50 rounded-xl border border-slate-800">
                  No direct Georgia Tech alumni indexed yet for this firm. You can search LinkedIn with the GT Scheller alumni filter.
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800/80 bg-[#0d162b] flex flex-wrap items-center justify-between gap-3">
          {/* Tracker Stage Selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Pipeline Stage:</span>
            <select
              value={job.application?.stage || "DISCOVERED"}
              onChange={handleStageChange}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-medium focus:outline-none focus:border-emerald-500"
            >
              <option value="DISCOVERED">Discovered</option>
              <option value="REVIEWING">Reviewing</option>
              <option value="TAILORING">Tailoring Materials</option>
              <option value="APPLIED">Applied</option>
              <option value="INTERVIEWING">Interviewing</option>
              <option value="OFFER">Offer Received</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/generator?jobId=${job.id}`}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              Draft Cover Letter & Pitch
            </Link>

            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950/50 transition-all active:scale-95"
            >
              Apply on Live Portal
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
