"use client";

import { useState } from "react";
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
  ChevronRight
} from "lucide-react";
import Link from "next/link";

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
        Executing...
      </span>
    );
  }
  return (
    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 font-bold">
      <CheckCircle2 className="w-2.5 h-2.5" />
      Verified
    </span>
  );
}

export default function PipelinePage() {
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

  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState<any | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

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
    setResult(null);
    setCurrentStep(0);
    setIsSaved(false);
  };

  const handleRunPipeline = async () => {
    setIsRunning(true);
    setCurrentStep(1);
    setResult(null);
    setIsSaved(false);

    try {
      // Step-by-step visual animation
      await new Promise((r) => setTimeout(r, 450));
      setCurrentStep(2);
      await new Promise((r) => setTimeout(r, 450));
      setCurrentStep(3);
      await new Promise((r) => setTimeout(r, 450));
      setCurrentStep(4);
      await new Promise((r) => setTimeout(r, 450));
      setCurrentStep(5);

      const res = await fetch("/api/agents/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setResult(data.result);
        setCurrentStep(6); // Done
      } else {
        alert("Pipeline execution failed: " + data.error);
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsRunning(false);
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
      } else {
        alert("Save failed: " + data.error);
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Cpu className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Multi-Agent Pipeline Orchestration Engine
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulate or execute the five-stage autonomous pipeline to vet candidate graduation timelines, evaluate enterprise prestige, compute Emmett&apos;s fit score, and forecast junior return offer trajectories.
          </p>
        </div>

        {/* Preset Role Fast Pickers */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 hidden lg:inline">Load Preset:</span>
          {PRESET_ROLES.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectPreset(preset)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-600 text-xs text-slate-200 font-semibold transition-colors"
            >
              {preset.companyName}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Job Input Form */}
        <div className="lg:col-span-5 rounded-2xl bg-[#0b1222] border border-slate-800/90 p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-300">
              Raw Opportunity Ingestion Form
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
              Live Input
            </span>
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
            onClick={handleRunPipeline}
            disabled={isRunning}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-all disabled:opacity-50"
          >
            {isRunning ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                Agents Evaluating in Orchestration...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                Launch 5-Agent Pipeline
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
                {currentStep === 0
                  ? "Ready"
                  : currentStep === 6
                  ? "All 5 Agents Verified"
                  : `Stage ${currentStep} of 5 Active`}
              </span>
            </div>

            {/* Agent Status Rows */}
            <div className="space-y-2">
              {/* Agent 1 */}
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
                  status={currentStep >= 1 ? (currentStep === 1 ? "running" : "completed") : "pending"} 
                  label="Agent 1" 
                />
              </div>

              {/* Agent 2 */}
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
                  status={currentStep >= 2 ? (currentStep === 2 ? "running" : "completed") : "pending"} 
                  label="Agent 2" 
                />
              </div>

              {/* Agent 3 */}
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
                  status={currentStep >= 3 ? (currentStep === 3 ? "running" : "completed") : "pending"} 
                  label="Agent 3" 
                />
              </div>

              {/* Agent 4 */}
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
                  status={currentStep >= 4 ? (currentStep === 4 ? "running" : "completed") : "pending"} 
                  label="Agent 4" 
                />
              </div>

              {/* Agent 5 */}
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
                  status={currentStep >= 5 ? (currentStep === 5 ? "running" : "completed") : "pending"} 
                  label="Agent 5" 
                />
              </div>
            </div>
          </div>

          {/* Results Display */}
          {result && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0c152a] to-[#080d19] border border-emerald-500/40 space-y-4 shadow-2xl animate-fadeIn">
              
              {/* Score Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    Calculated Match Verdict
                  </div>
                  <div className="text-xl font-bold text-white mt-0.5">
                    {result.job.companyName} — {result.job.title}
                  </div>
                </div>

                {/* Big Apex Gauge */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-2xl font-black text-white">
                      {result.apexScore.toFixed(1)}
                    </div>
                    <div className="text-[10px] font-bold text-emerald-400 uppercase">
                      Apex Score
                    </div>
                  </div>
                </div>
              </div>

              {/* Weighted Breakdown Matrix */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-emerald-500/20">
                  <div className="text-[10px] text-slate-400 font-semibold">Location (30%)</div>
                  <div className="text-base font-bold text-emerald-400 mt-0.5">
                    {result.scoringBreakdown.locationScore}
                  </div>
                  <div className="text-[9px] text-slate-500">+{result.scoringBreakdown.locationWeighted} pts</div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-amber-500/20">
                  <div className="text-[10px] text-slate-400 font-semibold">Prestige (25%)</div>
                  <div className="text-base font-bold text-amber-300 mt-0.5">
                    {result.scoringBreakdown.prestigeScore}
                  </div>
                  <div className="text-[9px] text-slate-500">+{result.scoringBreakdown.prestigeWeighted} pts</div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-indigo-500/20">
                  <div className="text-[10px] text-slate-400 font-semibold">Emmett Fit (25%)</div>
                  <div className="text-base font-bold text-indigo-300 mt-0.5">
                    {result.scoringBreakdown.fitScore}
                  </div>
                  <div className="text-[9px] text-slate-500">+{result.scoringBreakdown.fitWeighted} pts</div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-teal-500/20">
                  <div className="text-[10px] text-slate-400 font-semibold">Trajectory (20%)</div>
                  <div className="text-base font-bold text-teal-300 mt-0.5">
                    {result.scoringBreakdown.trajectoryScore}
                  </div>
                  <div className="text-[9px] text-slate-500">+{result.scoringBreakdown.trajectoryWeighted} pts</div>
                </div>
              </div>

              {/* Generated Bullets Preview */}
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase text-slate-400">
                  Agent 4 Generated &ldquo;Why Emmett Excels&rdquo; Proof Points:
                </div>
                <div className="space-y-1.5">
                  {result.fit.whyEmmettFits.map((bullet: string, i: number) => (
                    <div key={i} className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trajectory Outlook */}
              <div className="p-3 rounded-xl bg-[#09101f] border border-teal-500/30 text-xs text-slate-300 space-y-1">
                <div className="font-bold text-teal-300">
                  Trajectory & Conversion Forecast:
                </div>
                <div className="text-xs">{result.trajectory.returnOfferEstimate}</div>
                <div className="text-[11px] text-slate-400">{result.trajectory.trajectoryRationale}</div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  onClick={handleSaveToDatabase}
                  disabled={isSaved || saveLoading}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition-all ${
                    isSaved
                      ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/50 cursor-default"
                      : "bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95"
                  }`}
                >
                  <Save className="w-3.5 h-3.5" />
                  {isSaved ? "Saved to ApexPM Database" : saveLoading ? "Saving..." : "Add Scored Role to Database"}
                </button>

                <Link
                  href={`/generator?company=${encodeURIComponent(result.job.companyName)}&title=${encodeURIComponent(result.job.title)}&location=${encodeURIComponent(result.job.location)}`}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Generate Pitch Letter
                </Link>
              </div>

            </div>
          )}

          {/* Standby State */}
          {!result && !isRunning && (
            <div className="p-8 text-center rounded-2xl bg-[#0b1222] border border-slate-800/80 space-y-2 text-slate-400 text-xs">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center mx-auto text-slate-400">
                <Play className="w-4 h-4" />
              </div>
              <div className="font-bold text-slate-200">Awaiting Ingestion Stream</div>
              <p className="max-w-sm mx-auto text-[11px]">
                Click &ldquo;Launch 5-Agent Pipeline&rdquo; or pick one of the presets above to watch the autonomous evaluation pipeline execute in real-time.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
