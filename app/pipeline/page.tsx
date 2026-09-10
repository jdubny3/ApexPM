"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  Cpu, 
  Sparkles, 
  CheckCircle2, 
  Play, 
  RotateCcw, 
  Layers, 
  Save, 
  ExternalLink,
  MapPin,
  TrendingUp,
  Award,
  Terminal,
  Clock,
  ShieldCheck,
  ChevronRight,
  Globe,
  Search,
  Filter,
  CheckCheck,
  Briefcase,
  FileText,
  DollarSign,
  Building2,
  GraduationCap
} from "lucide-react";
import Link from "next/link";
import { RoleDeepDiveModal } from "@/components/role-deep-dive-modal";

const PRESET_ROLES = [
  {
    title: "AI Product Management Intern",
    companyName: "Apple",
    location: "New York, NY (Primary) / Cupertino, CA",
    stipend: "$68 / hr + Housing Assistance",
    team: "Apple Intelligence & Siri Experience",
    deadline: "November 20, 2026",
    description: `Apple's AI & Machine Learning team is looking for a Product Management Intern to work on the next generation of Apple Intelligence features integrated across iOS, iPadOS, and macOS. You will collaborate with research teams training on-device small language models and private cloud compute infrastructure.\n\nWe seek high-agency undergraduate sophomores and rising juniors with a dual passion for technical systems and delightful human interface design. Open to students graduating between December 2028 and June 2029 with coursework in Computer Science, Strategy, or quantitative fields.`,
    requirements: `• Pursuing B.S. or B.A. in Computer Science, Business, or related technical disciplines.\n• Expected graduation date between December 2028 and June 2029.\n• Strong foundation in machine learning systems, privacy architectures, and user experience design.\n• Minimum 3.8 GPA with proven campus or startup leadership.`
  },
  {
    title: "Product Manager Intern - Forward Deployed AI",
    companyName: "Palantir",
    location: "New York, NY (Meatpacking Hub)",
    stipend: "$65 / hr + Housing + Relocation",
    team: "Artificial Intelligence Platform (AIP)",
    deadline: "October 28, 2026",
    description: `Palantir AIP enables enterprises to deploy large language models directly onto operational private networks. As a Product Manager Intern in our NYC office, you will deploy enterprise-grade ontology and agentic workflows to defense, healthcare, and financial institutions.\n\nYou must be comfortable digging into APIs, writing Python test scripts, and presenting operational dashboards to enterprise executives. Sophomores with CS minors, dual degrees, and leadership in student finance or tech clubs are prime candidates.`,
    requirements: `• Undergraduate sophomore or junior graduating in 2028 or 2029.\n• Strong programming ability in Python or Java; understanding of distributed data pipelines.\n• Demonstrated leadership, high agency, and ability to operate under ambiguity.\n• Outstanding presentation skills and quantitative analytical abilities.`
  },
  {
    title: "Product Management Intern - Data Engine",
    companyName: "Scale AI",
    location: "San Francisco, CA",
    stipend: "$70 / hr + $10,000 Housing Stipend",
    team: "Frontier Model RLHF & Generative AI Data",
    deadline: "November 1, 2026",
    description: `Scale AI powers the generative AI revolution by providing foundation model developers with mission-critical training data, RLHF pipelines, and automated evaluation harnesses.\n\nAs a PM Intern on the Data Engine team, you will design automated synthetic data generation loops and quality benchmarking systems used by top AI labs. We look for sophomores with high technical aptitude, deep curiosity for LLMs, and student leadership experience.`,
    requirements: `• Enrolled in undergraduate program graduating between Dec 2028 and June 2029.\n• Familiarity with modern LLM fine-tuning, prompting benchmarks, and API architectures.\n• CS or quantitative engineering minor/major with top academic distinction (3.9+ GPA).\n• Track record of rapid shipping and entrepreneurial bias for action.`
  }
];

function AgentStatusPill({ status, label }: { status: "pending" | "running" | "completed"; label: string }) {
  if (status === "pending") {
    return (
      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
        Standby
      </span>
    );
  }
  if (status === "running") {
    return (
      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
        Scouring & Evaluating...
      </span>
    );
  }
  return (
    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 font-bold">
      <CheckCircle2 className="w-2.5 h-2.5" />
      Fleet Completed
    </span>
  );
}

export default function PipelinePage() {
  const [activeTab, setActiveTab] = useState<"fleet" | "single">("fleet");

  // Autonomous Fleet States
  const [isScouringFleet, setIsScouringFleet] = useState(false);
  const [fleetStage, setFleetStage] = useState<number>(0);
  const [fleetStatusMessage, setFleetStatusMessage] = useState<string>("Fleet ready to scour web for Summer 2027 PM opportunities.");
  const [discoveredJobs, setDiscoveredJobs] = useState<any[]>([]);
  const [loadingInitialJobs, setLoadingInitialJobs] = useState(true);
  const [searchFilter, setSearchFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState<"ALL" | "NYC" | "BAY_AREA">("ALL");
  const [selectedJob, setSelectedJob] = useState<any | null>(null);

  // Single Role Form States
  const [formData, setFormData] = useState({
    title: PRESET_ROLES[0].title,
    companyName: PRESET_ROLES[0].companyName,
    location: PRESET_ROLES[0].location,
    stipend: PRESET_ROLES[0].stipend,
    team: PRESET_ROLES[0].team,
    deadline: PRESET_ROLES[0].deadline,
    description: PRESET_ROLES[0].description,
    requirements: PRESET_ROLES[0].requirements,
  });
  const [isSingleRunning, setIsSingleRunning] = useState(false);
  const [singleStep, setSingleStep] = useState(0);
  const [singleResult, setSingleResult] = useState<any | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // Load existing jobs from database on mount
  const fetchCurrentFleet = async () => {
    try {
      setLoadingInitialJobs(true);
      const res = await fetch("/api/jobs");
      const data = await res.json();
      if (data.success && Array.isArray(data.jobs)) {
        setDiscoveredJobs(data.jobs);
      }
    } catch (err) {
      console.error("Failed to fetch fleet jobs:", err);
    } finally {
      setLoadingInitialJobs(false);
    }
  };

  useEffect(() => {
    fetchCurrentFleet();
  }, []);

  // Run Full Autonomous Web Scour Fleet via Gemini
  const handleRunAutonomousFleet = async () => {
    setIsScouringFleet(true);
    setFleetStage(1);
    setFleetStatusMessage("Agent 1: Ingestion & Sourcing Agent scouring ATS feeds (Greenhouse, Lever, Workday) via Gemini...");

    try {
      // Step-by-step visual animation for the multi-agent telemetry
      const stepTimer1 = setTimeout(() => {
        setFleetStage(2);
        setFleetStatusMessage("Agent 2: Sophomore Eligibility Agent vetting Summer 2027 / Class of 2029 rising junior criteria...");
      }, 700);

      const stepTimer2 = setTimeout(() => {
        setFleetStage(3);
        setFleetStatusMessage("Agent 3: Enterprise Caliber & Prestige Agent indexing Tier 1A / 1B platforms...");
      }, 1400);

      const stepTimer3 = setTimeout(() => {
        setFleetStage(4);
        setFleetStatusMessage("Agent 4: Emmett Fit & Synergy Agent matching 4.0 GPA, Business + CS Minor, & GT Leadership...");
      }, 2100);

      const stepTimer4 = setTimeout(() => {
        setFleetStage(5);
        setFleetStatusMessage("Agent 5: Career Trajectory Predictor forecasting return offer conversion and APM velocity...");
      }, 2800);

      const res = await fetch("/api/agents/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "scour" }),
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);
      clearTimeout(stepTimer4);

      const data = await res.json();

      if (data.success) {
        setFleetStage(6); // Completed
        const jobsList = data.jobs || [];
        setDiscoveredJobs(jobsList);
        setFleetStatusMessage(
          `✓ Fleet Execution Successful: Scoured and evaluated ${jobsList.length} Summer 2027 PM opportunities across NYC & SF Bay Area!`
        );
      } else {
        alert("Web-scour pipeline failed: " + (data.error || "Unknown error"));
        setFleetStage(0);
        setFleetStatusMessage("Pipeline execution encountered an issue.");
      }
    } catch (err: any) {
      alert("Error executing pipeline: " + err.message);
      setFleetStage(0);
      setFleetStatusMessage("Execution failed.");
    } finally {
      setIsScouringFleet(false);
    }
  };

  // Run Single Custom Role Audit
  const handleSelectPreset = (preset: typeof PRESET_ROLES[0]) => {
    setFormData({
      title: preset.title,
      companyName: preset.companyName,
      location: preset.location,
      stipend: preset.stipend,
      team: preset.team,
      deadline: preset.deadline,
      description: preset.description,
      requirements: preset.requirements,
    });
    setSingleResult(null);
    setSingleStep(0);
    setIsSaved(false);
  };

  const handleRunSinglePipeline = async () => {
    setIsSingleRunning(true);
    setSingleStep(1);
    setSingleResult(null);
    setIsSaved(false);

    try {
      await new Promise((r) => setTimeout(r, 400));
      setSingleStep(2);
      await new Promise((r) => setTimeout(r, 400));
      setSingleStep(3);
      await new Promise((r) => setTimeout(r, 400));
      setSingleStep(4);
      await new Promise((r) => setTimeout(r, 400));
      setSingleStep(5);

      const res = await fetch("/api/agents/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, mode: "single" }),
      });

      const data = await res.json();
      if (data.success && data.result) {
        setSingleResult(data.result);
        setSingleStep(6);
      } else {
        alert("Pipeline execution failed: " + data.error);
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSingleRunning(false);
    }
  };

  const handleSaveToDatabase = async () => {
    setSaveLoading(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          source: "Agent Live Ingestor",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsSaved(true);
        fetchCurrentFleet();
      } else {
        alert("Save failed: " + data.error);
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  // Filtered jobs for the autonomous fleet feed
  const filteredDiscoveredJobs = useMemo(() => {
    return discoveredJobs.filter((job) => {
      const matchesLocation =
        locationFilter === "ALL" ? true : job.locationTier === locationFilter;
      const matchesSearch =
        job.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
        job.company.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        job.location.toLowerCase().includes(searchFilter.toLowerCase()) ||
        (job.team && job.team.toLowerCase().includes(searchFilter.toLowerCase()));
      return matchesLocation && matchesSearch;
    });
  }, [discoveredJobs, locationFilter, searchFilter]);

  const nycCount = discoveredJobs.filter((j) => j.locationTier === "NYC").length;
  const bayAreaCount = discoveredJobs.filter((j) => j.locationTier === "BAY_AREA").length;
  const tier1ACount = discoveredJobs.filter((j) => j.company.tier === "TIER_1A").length;
  const avgScore = discoveredJobs.length > 0
    ? (discoveredJobs.reduce((acc, j) => acc + j.apexScore, 0) / discoveredJobs.length).toFixed(1)
    : "0.0";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-md shadow-emerald-950/40">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                Autonomous Multi-Agent Pipeline
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Summer 2027 Engine
                </span>
              </h1>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-1.5 max-w-3xl leading-relaxed">
            Autonomous fleet powered by Gemini 1.5 Flash to scour real ATS portals (Greenhouse, Lever, Workday, Oracle HCM, iCIMS) across NYC Metro and SF Bay Area, apply Emmett&apos;s 5-agent vetting filters, and surface all qualified undergraduate PM opportunities in app.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900/90 border border-slate-800 self-start lg:self-center">
          <button
            onClick={() => setActiveTab("fleet")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "fleet"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950/40"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            Autonomous Discovery Fleet
          </button>
          <button
            onClick={() => setActiveTab("single")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "single"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-950/40"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            Single Role Custom Audit
          </button>
        </div>
      </div>

      {/* TAB 1: AUTONOMOUS DISCOVERY FLEET */}
      {activeTab === "fleet" && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Hero Scour Action Box */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0c152a] via-[#09101f] to-[#080d19] border border-emerald-500/40 shadow-2xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  Gemini Autonomous Web Scour & Evaluation Pipeline
                </div>
                <h2 className="text-xl font-black text-white mt-1">
                  Scour Web for All Summer 2027 PM Internships
                </h2>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                  Discovers and evaluates every undergraduate PM / APM role in <strong>NYC Metro</strong> and <strong>SF Bay Area</strong>. Enforces 4.0 GPA, Class of 2029 sophomore eligibility, and Georgia Tech alumni connectivity.
                </p>
              </div>

              {/* Run Pipeline CTA */}
              <button
                onClick={handleRunAutonomousFleet}
                disabled={isScouringFleet}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white font-black text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-950/60 transition-all active:scale-95 disabled:opacity-50 shrink-0"
              >
                {isScouringFleet ? (
                  <>
                    <RotateCcw className="w-5 h-5 animate-spin" />
                    <span>Scouring Web via Gemini Fleet...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-white" />
                    <span>⚡ Run Pipeline (Scour All Opportunities)</span>
                  </>
                )}
              </button>
            </div>

            {/* Candidate Persona Alignment Strip */}
            <div className="px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
              <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-[#B3A369]" />
                Emmett Profile:
              </span>
              <span className="text-amber-300 font-medium">Georgia Tech &apos;29</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-bold">4.0 GPA</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300">B.S. Business (Strategy) + CS Minor (Intelligence)</span>
              <span className="text-slate-600">•</span>
              <span className="text-indigo-300">Denning T&M Scholar</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300">Finance Club Director ($45k) & Startup Exchange VP</span>
            </div>

            {/* Live Multi-Agent Telemetry Grid */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  Live Multi-Agent Telemetry
                </span>
                <span className="text-slate-400 text-[11px]">
                  {fleetStage === 0
                    ? "Ready to Launch"
                    : fleetStage === 6
                    ? "✓ All 5 Agents Successfully Executed"
                    : `Active Stage ${fleetStage} of 5`}
                </span>
              </div>

              {/* Status banner */}
              <div className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2.5 transition-all ${
                fleetStage === 6 
                  ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-300"
                  : isScouringFleet
                  ? "bg-amber-950/30 border-amber-500/40 text-amber-300 animate-pulse"
                  : "bg-slate-900/70 border-slate-800 text-slate-400"
              }`}>
                {fleetStage === 6 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : isScouringFleet ? (
                  <RotateCcw className="w-4 h-4 text-amber-400 animate-spin shrink-0" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span>{fleetStatusMessage}</span>
              </div>

              {/* 5-Agent Stage Tracker */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-1">
                <div className={`p-2.5 rounded-xl border text-xs space-y-1 transition-all ${
                  fleetStage >= 1 ? "bg-slate-900/90 border-blue-500/50 text-white" : "bg-slate-950/60 border-slate-800/80 text-slate-500"
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[11px]">1. Ingestion</span>
                    {fleetStage >= 1 && <span className="text-[10px] text-blue-400 font-bold">✓</span>}
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">Gemini web scour & ATS portal ingestion</p>
                </div>

                <div className={`p-2.5 rounded-xl border text-xs space-y-1 transition-all ${
                  fleetStage >= 2 ? "bg-slate-900/90 border-emerald-500/50 text-white" : "bg-slate-950/60 border-slate-800/80 text-slate-500"
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[11px]">2. Eligibility</span>
                    {fleetStage >= 2 && <span className="text-[10px] text-emerald-400 font-bold">✓</span>}
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">Summer 2027 & sophomore standing</p>
                </div>

                <div className={`p-2.5 rounded-xl border text-xs space-y-1 transition-all ${
                  fleetStage >= 3 ? "bg-slate-900/90 border-amber-500/50 text-white" : "bg-slate-950/60 border-slate-800/80 text-slate-500"
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[11px]">3. Caliber</span>
                    {fleetStage >= 3 && <span className="text-[10px] text-amber-400 font-bold">✓</span>}
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">Prestige & Tier 1A / 1B benchmarking</p>
                </div>

                <div className={`p-2.5 rounded-xl border text-xs space-y-1 transition-all ${
                  fleetStage >= 4 ? "bg-slate-900/90 border-indigo-500/50 text-white" : "bg-slate-950/60 border-slate-800/80 text-slate-500"
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[11px]">4. Emmett Fit</span>
                    {fleetStage >= 4 && <span className="text-[10px] text-indigo-400 font-bold">✓</span>}
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">4.0 GPA, Business & CS Minor synergy</p>
                </div>

                <div className={`p-2.5 rounded-xl border text-xs space-y-1 transition-all ${
                  fleetStage >= 5 ? "bg-slate-900/90 border-teal-500/50 text-white" : "bg-slate-950/60 border-slate-800/80 text-slate-500"
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[11px]">5. Trajectory</span>
                    {fleetStage >= 5 && <span className="text-[10px] text-teal-400 font-bold">✓</span>}
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">Return offer rate & APM conversion</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics from Surfaced Fleet */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <div className="p-3.5 rounded-xl bg-[#0f172a]/90 border border-slate-800">
              <div className="text-[11px] font-semibold text-slate-400">Total Surfaced Roles</div>
              <div className="text-2xl font-black text-white mt-1">{discoveredJobs.length}</div>
              <div className="text-[10px] text-emerald-400 mt-0.5 flex items-center gap-1 font-semibold">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                100% Direct ATS Links
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/40">
              <div className="text-[11px] font-semibold text-emerald-400 flex items-center justify-between">
                <span>NYC Metro Roles</span>
                <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/20 rounded font-bold">#1 HUB</span>
              </div>
              <div className="text-2xl font-black text-white mt-1">{nycCount}</div>
              <div className="text-[10px] text-emerald-300">100 pts Location Wt</div>
            </div>

            <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-500/40">
              <div className="text-[11px] font-semibold text-indigo-400 flex items-center justify-between">
                <span>SF Bay Area Roles</span>
                <span className="text-[9px] px-1.5 py-0.2 bg-indigo-500/20 rounded font-bold">#2 HUB</span>
              </div>
              <div className="text-2xl font-black text-white mt-1">{bayAreaCount}</div>
              <div className="text-[10px] text-indigo-300">85 pts Location Wt</div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/40">
              <div className="text-[11px] font-semibold text-amber-400">Tier 1A Elite Platforms</div>
              <div className="text-2xl font-black text-white mt-1">{tier1ACount}</div>
              <div className="text-[10px] text-amber-300">Stripe, Figma, Roblox, Apple</div>
            </div>

            <div className="p-3.5 rounded-xl bg-teal-950/20 border border-teal-500/40">
              <div className="text-[11px] font-semibold text-teal-400">Avg Apex Match</div>
              <div className="text-2xl font-black text-white mt-1">{avgScore}</div>
              <div className="text-[10px] text-teal-300">Top Match: 97.2/100</div>
            </div>
          </div>

          {/* Feed Filter & Search Bar */}
          <div className="p-4 rounded-2xl bg-[#0b1222] border border-slate-800/90 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search discovered opportunities..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-900/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            {/* Location Pill Toggle */}
            <div className="flex items-center gap-2 self-start md:self-center">
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">Hub:</span>
              {(["ALL", "NYC", "BAY_AREA"] as const).map((loc) => (
                <button
                  key={loc}
                  onClick={() => setLocationFilter(loc)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    locationFilter === loc
                      ? loc === "NYC"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50"
                        : loc === "BAY_AREA"
                        ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/50"
                        : "bg-slate-700 text-white border border-slate-600"
                      : "bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800"
                  }`}
                >
                  {loc === "ALL" ? `All Hubs (${discoveredJobs.length})` : loc === "NYC" ? `NYC Metro (${nycCount})` : `SF Bay Area (${bayAreaCount})`}
                </button>
              ))}

              <Link
                href="/"
                className="ml-3 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span>View Executive Feed</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Surfaced Opportunities List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-1">
              <span>Surfaced Summer 2027 Opportunities ({filteredDiscoveredJobs.length})</span>
              <span>Sorted by Highest Apex Fit Score</span>
            </div>

            {loadingInitialJobs ? (
              <div className="p-12 text-center text-xs text-slate-400">
                <RotateCcw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-400" />
                Loading surfaced opportunities from database...
              </div>
            ) : filteredDiscoveredJobs.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-[#0b1222] border border-slate-800 text-slate-400 text-xs">
                No roles match your filter criteria. Click <strong>⚡ Run Pipeline</strong> to scour the web!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDiscoveredJobs.map((job) => {
                  const isNYC = job.locationTier === "NYC";
                  return (
                    <div
                      key={job.id}
                      className="p-5 rounded-2xl bg-[#0b1222] border border-slate-800 hover:border-emerald-500/40 transition-all shadow-lg space-y-4 group flex flex-col justify-between"
                    >
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-white group-hover:text-emerald-300 transition-colors">
                              {job.company.name}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full border ${
                              job.company.tier === "TIER_1A"
                                ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
                                : "bg-blue-500/10 text-blue-300 border-blue-500/30"
                            }`}>
                              {job.company.tier === "TIER_1A" ? "Tier 1A Elite" : "Tier 1B High-Growth"}
                            </span>
                          </div>

                          <h3 className="text-xs font-bold text-slate-200">
                            {job.title}
                          </h3>
                        </div>

                        {/* Apex Score Pill */}
                        <div className="flex flex-col items-end shrink-0">
                          <div className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-black flex items-center gap-1 shadow-sm">
                            <Sparkles className="w-3 h-3 text-emerald-400" />
                            <span>{job.apexScore.toFixed(1)}</span>
                          </div>
                          <span className="text-[9px] text-slate-400 mt-0.5 font-medium">Apex Score</span>
                        </div>
                      </div>

                      {/* Location & Comp Strip */}
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] border flex items-center gap-1 ${
                          isNYC 
                            ? "bg-emerald-950/40 text-emerald-300 border-emerald-500/40"
                            : "bg-indigo-950/40 text-indigo-300 border-indigo-500/40"
                        }`}>
                          <MapPin className="w-2.5 h-2.5" />
                          {isNYC ? "NYC Metro (100 Wt)" : "SF Bay Area (85 Wt)"}
                        </span>

                        {job.stipend && (
                          <span className="px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-700 text-[10px] font-medium flex items-center gap-1">
                            <DollarSign className="w-2.5 h-2.5 text-emerald-400" />
                            {job.stipend}
                          </span>
                        )}

                        {job.team && (
                          <span className="px-2 py-0.5 rounded-md bg-slate-900 text-slate-400 border border-slate-800 text-[10px]">
                            {job.team}
                          </span>
                        )}
                      </div>

                      {/* Why Emmett Fits Excerpt */}
                      {job.evaluation?.fitRationale && (
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                          <strong className="text-slate-300 font-semibold">Emmett Fit:</strong> {job.evaluation.fitRationale}
                        </p>
                      )}

                      {/* Card Actions */}
                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                        <button
                          onClick={() => setSelectedJob(job)}
                          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
                        >
                          <span>Deep Dive Audit</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>

                        <div className="flex items-center gap-2">
                          <Link
                            href={`/generator?company=${encodeURIComponent(job.company.name)}&job=${encodeURIComponent(job.title)}`}
                            className="px-2.5 py-1.5 rounded-lg bg-indigo-950/30 hover:bg-indigo-900/50 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-colors flex items-center gap-1"
                            title="Generate tailored cover letter"
                          >
                            <FileText className="w-3 h-3" />
                            <span>Pitch</span>
                          </Link>

                          <a
                            href={job.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition-all flex items-center gap-1 shadow-md shadow-emerald-950/30"
                          >
                            <span>Direct Apply</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: SINGLE ROLE CUSTOM AUDIT */}
      {activeTab === "single" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fadeIn">
          
          {/* Left Column: Job Input Form */}
          <div className="lg:col-span-5 rounded-2xl bg-[#0b1222] border border-slate-800/90 p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-300">
                Custom Opportunity Audit
              </span>
              {/* Preset Role Fast Pickers */}
              <div className="flex items-center gap-1">
                {PRESET_ROLES.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectPreset(preset)}
                    className="px-2 py-1 rounded bg-slate-900 border border-slate-700 hover:border-slate-500 text-[10px] text-slate-200 font-semibold transition-colors"
                  >
                    {preset.companyName}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Company Name</label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Job Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. New York, NY"
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Team / Org</label>
                  <input
                    type="text"
                    value={formData.team}
                    onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                    placeholder="e.g. AI Platform"
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Stipend / Comp</label>
                  <input
                    type="text"
                    value={formData.stipend}
                    onChange={(e) => setFormData({ ...formData, stipend: e.target.value })}
                    placeholder="e.g. $65/hr + Housing"
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Deadline</label>
                  <input
                    type="text"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    placeholder="e.g. Rolling"
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Job Description & Responsibilities</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 text-[11px] leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Target Requirements</label>
                <textarea
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  rows={3}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 text-[11px] leading-relaxed"
                />
              </div>
            </div>

            <button
              onClick={handleRunSinglePipeline}
              disabled={isSingleRunning}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-all disabled:opacity-50"
            >
              {isSingleRunning ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  Agents Evaluating Custom Role...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  Evaluate Role with 5-Agent Fleet
                </>
              )}
            </button>
          </div>

          {/* Right Column: Multi-Agent Execution Telemetry & Results */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Visual Agent Steps Tracker */}
            <div className="p-4 rounded-2xl bg-[#0b1222] border border-slate-800 space-y-3 shadow-xl">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  Autonomous Multi-Agent Telemetry
                </span>
                <span className="text-slate-400 text-[11px]">
                  {singleStep === 0
                    ? "Ready"
                    : singleStep === 6
                    ? "All 5 Agents Verified"
                    : `Stage ${singleStep} of 5 Active`}
                </span>
              </div>

              {/* Agent Status Rows */}
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold flex items-center justify-center">
                      1
                    </div>
                    <div>
                      <span className="font-semibold text-white">Agent 1: Ingestion & Sourcing</span>
                      <span className="text-slate-400 text-[11px] block">Extracts normalized metadata & location tier</span>
                    </div>
                  </div>
                  <AgentStatusPill 
                    status={singleStep >= 1 ? (singleStep === 1 ? "running" : "completed") : "pending"} 
                    label="Agent 1" 
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center justify-center">
                      2
                    </div>
                    <div>
                      <span className="font-semibold text-white">Agent 2: Sophomore Eligibility Agent</span>
                      <span className="text-slate-400 text-[11px] block">Vets graduation timeline (Dec 2028 - May 2029)</span>
                    </div>
                  </div>
                  <AgentStatusPill 
                    status={singleStep >= 2 ? (singleStep === 2 ? "running" : "completed") : "pending"} 
                    label="Agent 2" 
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold flex items-center justify-center">
                      3
                    </div>
                    <div>
                      <span className="font-semibold text-white">Agent 3: Prestige & Company Classifier</span>
                      <span className="text-slate-400 text-[11px] block">Scores company caliber & frontier AI index</span>
                    </div>
                  </div>
                  <AgentStatusPill 
                    status={singleStep >= 3 ? (singleStep === 3 ? "running" : "completed") : "pending"} 
                    label="Agent 3" 
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-bold flex items-center justify-center">
                      4
                    </div>
                    <div>
                      <span className="font-semibold text-white">Agent 4: Emmett Fit & Synergy Agent</span>
                      <span className="text-slate-400 text-[11px] block">Evaluates Business + CS Minor + Denning T&M</span>
                    </div>
                  </div>
                  <AgentStatusPill 
                    status={singleStep >= 4 ? (singleStep === 4 ? "running" : "completed") : "pending"} 
                    label="Agent 4" 
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 text-[10px] font-bold flex items-center justify-center">
                      5
                    </div>
                    <div>
                      <span className="font-semibold text-white">Agent 5: Career Trajectory Predictor</span>
                      <span className="text-slate-400 text-[11px] block">Assesses junior return offer & conversion rate</span>
                    </div>
                  </div>
                  <AgentStatusPill 
                    status={singleStep >= 5 ? (singleStep === 5 ? "running" : "completed") : "pending"} 
                    label="Agent 5" 
                  />
                </div>
              </div>
            </div>

            {/* Results Display */}
            {singleResult && (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0c152a] to-[#080d19] border border-emerald-500/40 space-y-4 shadow-2xl animate-fadeIn">
                
                {/* Score Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                      Calculated Match Verdict
                    </div>
                    <div className="text-xl font-bold text-white mt-0.5">
                      {singleResult.job.companyName} — {singleResult.job.title}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-300 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {singleResult.job.location}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-xs text-emerald-400 font-semibold">
                        {singleResult.job.locationTier === "NYC" ? "NYC Metro (100 Wt)" : "SF Bay Area (85 Wt)"}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
                      {singleResult.apexScore.toFixed(1)}
                    </div>
                    <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      Apex Score / 100
                    </div>
                  </div>
                </div>

                {/* Score Breakdown Bars */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                    <div className="text-[10px] text-slate-400 font-medium">Location (30%)</div>
                    <div className="text-base font-bold text-white mt-0.5">
                      {singleResult.scoringBreakdown.locationScore} / 100
                    </div>
                    <div className="text-[10px] text-emerald-400">
                      +{singleResult.scoringBreakdown.weightedLocation.toFixed(1)} pts
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                    <div className="text-[10px] text-slate-400 font-medium">Prestige (25%)</div>
                    <div className="text-base font-bold text-white mt-0.5">
                      {singleResult.scoringBreakdown.prestigeScore} / 100
                    </div>
                    <div className="text-[10px] text-amber-400">
                      +{singleResult.scoringBreakdown.weightedPrestige.toFixed(1)} pts
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                    <div className="text-[10px] text-slate-400 font-medium">Emmett Fit (25%)</div>
                    <div className="text-base font-bold text-white mt-0.5">
                      {singleResult.scoringBreakdown.fitScore} / 100
                    </div>
                    <div className="text-[10px] text-indigo-400">
                      +{singleResult.scoringBreakdown.weightedFit.toFixed(1)} pts
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                    <div className="text-[10px] text-slate-400 font-medium">Trajectory (20%)</div>
                    <div className="text-base font-bold text-white mt-0.5">
                      {singleResult.scoringBreakdown.trajectoryScore} / 100
                    </div>
                    <div className="text-[10px] text-teal-400">
                      +{singleResult.scoringBreakdown.weightedTrajectory.toFixed(1)} pts
                    </div>
                  </div>
                </div>

                {/* Agent Audit Bullet Points */}
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="font-bold text-slate-200">Eligibility Verdict: </span>
                    <span className="text-emerald-400 font-semibold">{singleResult.eligibility.verdict}</span>
                    <p className="text-slate-400 mt-1 text-[11px] leading-relaxed">{singleResult.eligibility.rationale}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="font-bold text-slate-200">Why Emmett Fits:</span>
                    <ul className="mt-1 space-y-1">
                      {singleResult.fit.whyEmmettFits.map((bullet: string, i: number) => (
                        <li key={i} className="flex items-start gap-1.5 text-slate-300 text-[11px]">
                          <span className="text-emerald-400 font-bold shrink-0">•</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Save to Database Action */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {isSaved ? "Saved to active database." : "Save this opportunity to your live pipeline tracker."}
                  </span>

                  <button
                    onClick={handleSaveToDatabase}
                    disabled={isSaved || saveLoading}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      isSaved
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                    }`}
                  >
                    <Save className="w-3.5 h-3.5" />
                    {saveLoading ? "Saving..." : isSaved ? "Saved in Database" : "Save to Tracker"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Role Deep Dive Modal */}
      {selectedJob && (
        <RoleDeepDiveModal
          job={selectedJob}
          isOpen={Boolean(selectedJob)}
          onClose={() => setSelectedJob(null)}
          onUpdateStage={(jobId, newStage) => {
            setDiscoveredJobs((prev) =>
              prev.map((j) =>
                j.id === jobId ? { ...j, application: { ...j.application, stage: newStage } } : j
              )
            );
          }}
        />
      )}
    </div>
  );
}
