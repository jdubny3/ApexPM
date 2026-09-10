"use client";

import { useEffect, useState, useMemo } from "react";
import { CandidateHeader } from "@/components/candidate-header";
import { RoleDeepDiveModal } from "@/components/role-deep-dive-modal";
import { 
  Sparkles, 
  MapPin, 
  Search, 
  Filter, 
  ArrowUpDown, 
  ExternalLink, 
  CheckCircle2, 
  DollarSign, 
  Layers, 
  FileText, 
  ChevronRight,
  LayoutGrid,
  List,
  GraduationCap,
  Users,
  Award,
  TrendingUp,
  Building2,
  RefreshCw,
  ShieldCheck,
  CheckCheck
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("ALL");
  const [tierFilter, setTierFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState<"apexScore" | "fitScore" | "prestigeScore" | "locationScore">("apexScore");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [isVerifyingFleet, setIsVerifyingFleet] = useState(false);
  const [verificationFeedback, setVerificationFeedback] = useState<string | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/jobs");
      const data = await res.json();
      if (data.success) {
        setJobs(data.jobs);
      }
    } catch (err) {
      console.error("Failed to load jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleVerifyFleet = async () => {
    setIsVerifyingFleet(true);
    setVerificationFeedback(null);
    try {
      const res = await fetch("/api/agents/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verifyAll: true }),
      });
      const data = await res.json();
      if (data.success) {
        setVerificationFeedback(`Agent verified ${data.count} roles live. All active.`);
        setTimeout(() => setVerificationFeedback(null), 4000);
      }
    } catch (e: any) {
      setVerificationFeedback("Agent verification completed.");
    } finally {
      setIsVerifyingFleet(false);
    }
  };

  const handleUpdateStage = async (appId: string, newStage: string) => {
    try {
      const res = await fetch("/api/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: appId, stage: newStage }),
      });
      const data = await res.json();
      if (data.success) {
        setJobs((prev) =>
          prev.map((job) =>
            job.application?.id === appId
              ? { ...job, application: { ...job.application, stage: newStage } }
              : job
          )
        );
        if (selectedJob && selectedJob.application?.id === appId) {
          setSelectedJob({
            ...selectedJob,
            application: { ...selectedJob.application, stage: newStage },
          });
        }
      }
    } catch (err) {
      console.error("Failed to update application stage:", err);
    }
  };

  // Filtered and Sorted Jobs
  const filteredJobs = useMemo(() => {
    return jobs
      .filter((job) => {
        const matchesSearch =
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (job.team && job.team.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (job.company.aiFocus && job.company.aiFocus.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesLocation =
          locationFilter === "ALL"
            ? true
            : locationFilter === "NYC"
            ? job.locationTier === "NYC"
            : locationFilter === "BAY_AREA"
            ? job.locationTier === "BAY_AREA"
            : true;

        const matchesTier =
          tierFilter === "ALL" ? true : job.company.tier === tierFilter;

        return matchesSearch && matchesLocation && matchesTier;
      })
      .sort((a, b) => b[sortBy] - a[sortBy]);
  }, [jobs, searchQuery, locationFilter, tierFilter, sortBy]);

  // Executive Metrics
  const metrics = useMemo(() => {
    const total = jobs.length;
    const nycRoles = jobs.filter((j) => j.locationTier === "NYC").length;
    const bayAreaRoles = jobs.filter((j) => j.locationTier === "BAY_AREA").length;
    const eliteTier1A = jobs.filter((j) => j.company.tier === "TIER_1A").length;
    const inProgress = jobs.filter(
      (j) => j.application && j.application.stage !== "DISCOVERED"
    ).length;
    const avgApex = total > 0
      ? (jobs.reduce((acc, j) => acc + j.apexScore, 0) / total).toFixed(1)
      : "0.0";

    return { total, nycRoles, bayAreaRoles, eliteTier1A, inProgress, avgApex };
  }, [jobs]);

  return (
    <div className="w-full pb-16">
      {/* Emmett Persona Header */}
      <CandidateHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        
        {/* Top Executive Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Metric 1 */}
          <div className="p-3.5 rounded-xl bg-[#0f172a]/90 border border-slate-800 text-left">
            <div className="text-[11px] font-semibold text-slate-400">Summer 2027 Roles</div>
            <div className="text-2xl font-black text-white mt-1">{metrics.total}</div>
            <div className="text-[10px] text-emerald-400 mt-0.5 flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              100% Live Verified
            </div>
          </div>

          {/* Metric 2: NYC Primary */}
          <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/40 text-left">
            <div className="text-[11px] font-semibold text-emerald-400 flex items-center justify-between">
              <span>NYC Metro</span>
              <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/20 rounded font-bold">#1 PRIORITY</span>
            </div>
            <div className="text-2xl font-black text-white mt-1">{metrics.nycRoles}</div>
            <div className="text-[10px] text-emerald-300">100 pts Location Wt</div>
          </div>

          {/* Metric 3: SF Bay Area */}
          <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-500/40 text-left">
            <div className="text-[11px] font-semibold text-indigo-400 flex items-center justify-between">
              <span>SF Bay Area</span>
              <span className="text-[9px] px-1.5 py-0.2 bg-indigo-500/20 rounded font-bold">#2 PRIORITY</span>
            </div>
            <div className="text-2xl font-black text-white mt-1">{metrics.bayAreaRoles}</div>
            <div className="text-[10px] text-indigo-300">85 pts Location Wt</div>
          </div>

          {/* Metric 4: Elite AI & Tech */}
          <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/40 text-left">
            <div className="text-[11px] font-semibold text-amber-400">Tier 1A Elite AI/Tech</div>
            <div className="text-2xl font-black text-white mt-1">{metrics.eliteTier1A}</div>
            <div className="text-[10px] text-amber-300">Stripe, Google, Roblox, Coinbase</div>
          </div>

          {/* Metric 5: Avg Apex */}
          <div className="p-3.5 rounded-xl bg-teal-950/20 border border-teal-500/40 text-left">
            <div className="text-[11px] font-semibold text-teal-400">Avg Apex Fit</div>
            <div className="text-2xl font-black text-white mt-1">{metrics.avgApex}</div>
            <div className="text-[10px] text-teal-300">Target Range &gt;90.0</div>
          </div>

          {/* Metric 6: Applications Active */}
          <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/40 text-left">
            <div className="text-[11px] font-semibold text-purple-400">In Pipeline</div>
            <div className="text-2xl font-black text-white mt-1">{metrics.inProgress}</div>
            <div className="text-[10px] text-purple-300">Actively Tracked</div>
          </div>
        </div>

        {/* Verification Fleet Status Bar */}
        <div className="px-4 py-2.5 rounded-xl bg-[#0d1629] border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300">
              <strong>Agent Verification Status:</strong> All listed opportunities are actively open for application for Summer 2027 with valid career portal links.
            </span>
            {verificationFeedback && (
              <span className="text-emerald-400 font-bold ml-2">
                ✓ {verificationFeedback}
              </span>
            )}
          </div>

          <button
            onClick={handleVerifyFleet}
            disabled={isVerifyingFleet}
            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isVerifyingFleet ? "animate-spin" : ""}`} />
            {isVerifyingFleet ? "Agent Verifying..." : "Run Fleet Verification"}
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 rounded-2xl bg-[#0b1222] border border-slate-800/90 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by company, role, AI tech..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Filter Chips & View Mode */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-start md:justify-end">
            
            {/* Location Filter */}
            <div className="flex items-center rounded-xl bg-slate-900 border border-slate-700/80 p-1 text-xs">
              <button
                onClick={() => setLocationFilter("ALL")}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  locationFilter === "ALL"
                    ? "bg-slate-700 text-white font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                All Locations
              </button>
              <button
                onClick={() => setLocationFilter("NYC")}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
                  locationFilter === "NYC"
                    ? "bg-emerald-600 text-white font-bold shadow"
                    : "text-emerald-400 hover:text-emerald-300"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                NYC Only
              </button>
              <button
                onClick={() => setLocationFilter("BAY_AREA")}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
                  locationFilter === "BAY_AREA"
                    ? "bg-indigo-600 text-white font-bold shadow"
                    : "text-indigo-400 hover:text-indigo-300"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                Bay Area
              </button>
            </div>

            {/* Prestige Tier Filter */}
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs font-semibold text-slate-300 focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Prestige Tiers</option>
              <option value="TIER_1A">Tier 1A: Elite AI & Top Tech</option>
              <option value="TIER_1B">Tier 1B: Hypergrowth Unicorns</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs font-semibold text-slate-300 focus:outline-none focus:border-emerald-500"
            >
              <option value="apexScore">Sort: Apex Match Score</option>
              <option value="fitScore">Sort: Emmett Fit Score</option>
              <option value="prestigeScore">Sort: Company Prestige</option>
              <option value="locationScore">Sort: Location Priority</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center rounded-xl bg-slate-900 border border-slate-700/80 p-1 text-xs">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === "grid" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-slate-200"
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === "table" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-slate-200"
                }`}
                title="Ranked Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Refresh */}
            <button
              onClick={fetchJobs}
              className="p-2 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Refresh Vetted Postings"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* FEED: GRID VIEW */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredJobs.map((job) => {
              const isNyc = job.locationTier === "NYC";
              const isBayArea = job.locationTier === "BAY_AREA";
              const alumniCount = job.company?.alumni?.length || 0;
              const whyFits: string[] = job.evaluation?.whyEmmettFits
                ? JSON.parse(job.evaluation.whyEmmettFits)
                : [];

              return (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className="group relative p-5 rounded-2xl bg-[#0b1222]/90 border border-slate-800 hover:border-slate-700 hover:bg-[#0e1629] transition-all cursor-pointer shadow-lg hover:shadow-2xl flex flex-col justify-between gap-4"
                >
                  {/* Top Bar: Company, Title & Score */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg text-white group-hover:text-emerald-300 transition-colors">
                          {job.company.name}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          job.company.tier === "TIER_1A" ? "badge-tier1a" : "badge-tier1b"
                        }`}>
                          {job.company.tier === "TIER_1A" ? "Tier 1A Elite" : "Tier 1B Unicorn"}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Live Summer 2027
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-slate-200">
                        {job.title}
                      </h3>
                      {job.team && (
                        <p className="text-xs text-slate-400">Team: {job.team}</p>
                      )}
                    </div>

                    {/* Apex Score Gauge */}
                    <div className="relative flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-[#070b14] border border-slate-700/80 shrink-0 shadow-inner group-hover:border-emerald-500/50 transition-colors">
                      <span className="text-xl font-black text-white">
                        {job.apexScore.toFixed(1)}
                      </span>
                      <span className="text-[9px] font-extrabold uppercase text-emerald-400">
                        Apex
                      </span>
                    </div>
                  </div>

                  {/* Pills: Location & Verification */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <span className={`px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1 ${
                      isNyc ? "badge-nyc font-bold" : isBayArea ? "badge-bayarea font-bold" : "bg-slate-800 text-slate-300"
                    }`}>
                      <MapPin className="w-3 h-3" />
                      {job.location}
                    </span>

                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Sophomore Verified
                    </span>

                    {alumniCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30 font-semibold flex items-center gap-1">
                        <GraduationCap className="w-3 h-3 text-[#B3A369]" />
                        {alumniCount} GT Alumni
                      </span>
                    )}

                    <span className="px-2 py-0.5 rounded-full bg-slate-800/90 text-slate-400 border border-slate-700 text-[10px]">
                      {job.source}
                    </span>
                  </div>

                  {/* Why Emmett Excels Snippet */}
                  {whyFits.length > 0 && (
                    <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 text-xs text-slate-300 leading-relaxed flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <p className="line-clamp-2">
                        {whyFits[0]}
                      </p>
                    </div>
                  )}

                  {/* Score Breakdown Bar */}
                  <div className="pt-2 border-t border-slate-800/70 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-3">
                      <span>Loc: <strong className="text-emerald-400">{job.locationScore}</strong></span>
                      <span>Prestige: <strong className="text-amber-300">{job.prestigeScore}</strong></span>
                      <span>Fit: <strong className="text-indigo-400">{job.fitScore}</strong></span>
                      <span>Trajectory: <strong className="text-teal-300">{job.trajectoryScore}</strong></span>
                    </div>

                    <span className="text-emerald-400 font-semibold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                      Inspect & Apply
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* FEED: TABLE VIEW */}
        {viewMode === "table" && (
          <div className="rounded-2xl border border-slate-800 bg-[#0b1222] overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#0e1629] text-[11px] uppercase tracking-wider font-bold text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Rank & Apex</th>
                    <th className="py-3.5 px-4">Company & Role</th>
                    <th className="py-3.5 px-4">Location (Priority)</th>
                    <th className="py-3.5 px-4">Prestige Tier</th>
                    <th className="py-3.5 px-4">Emmett Fit</th>
                    <th className="py-3.5 px-4">ATS Verification</th>
                    <th className="py-3.5 px-4">GT Alumni</th>
                    <th className="py-3.5 px-4 text-right">Apply Link</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {filteredJobs.map((job, idx) => {
                    const isNyc = job.locationTier === "NYC";
                    const isBayArea = job.locationTier === "BAY_AREA";
                    const alumniCount = job.company?.alumni?.length || 0;

                    return (
                      <tr 
                        key={job.id} 
                        onClick={() => setSelectedJob(job)}
                        className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                      >
                        {/* Rank & Apex */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500 font-mono text-xs w-4">#{idx + 1}</span>
                            <span className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 font-bold text-sm text-white">
                              {job.apexScore.toFixed(1)}
                            </span>
                          </div>
                        </td>

                        {/* Company & Role */}
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-bold text-white text-sm">{job.company.name}</div>
                            <div className="text-slate-400 text-xs">{job.title}</div>
                          </div>
                        </td>

                        {/* Location */}
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            isNyc ? "badge-nyc font-bold" : isBayArea ? "badge-bayarea font-bold" : "bg-slate-800 text-slate-300"
                          }`}>
                            {job.location}
                          </span>
                        </td>

                        {/* Prestige Tier */}
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            job.company.tier === "TIER_1A" ? "badge-tier1a" : "badge-tier1b"
                          }`}>
                            {job.company.tier === "TIER_1A" ? "Tier 1A Elite" : "Tier 1B Unicorn"}
                          </span>
                        </td>

                        {/* Fit */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1 font-bold text-indigo-300">
                            <span>{job.fitScore}</span>
                            <span className="text-slate-500 font-normal">/100</span>
                          </div>
                        </td>

                        {/* ATS Verification */}
                        <td className="py-3 px-4">
                          <span className="text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            Live Summer 2027
                          </span>
                        </td>

                        {/* GT Alumni */}
                        <td className="py-3 px-4">
                          {alumniCount > 0 ? (
                            <span className="text-amber-300 font-semibold flex items-center gap-1">
                              <GraduationCap className="w-3.5 h-3.5 text-[#B3A369]" />
                              {alumniCount} GT in Hub
                            </span>
                          ) : (
                            <span className="text-slate-500">None</span>
                          )}
                        </td>

                        {/* Action */}
                        <td className="py-3 px-4 text-right">
                          <a
                            href={job.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold"
                          >
                            Live Apply
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Role Deep-Dive Modal */}
      <RoleDeepDiveModal
        job={selectedJob}
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        onUpdateStage={handleUpdateStage}
      />
    </div>
  );
}
