"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  FileText, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  Send, 
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { EMMETT_PROFILE } from "@/lib/candidate-profile";

function GeneratorContent() {
  const searchParams = useSearchParams();
  const initialJobId = searchParams.get("jobId") || "";
  const initialCompany = searchParams.get("company") || "";
  const initialTitle = searchParams.get("title") || "";
  const initialLocation = searchParams.get("location") || "";

  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState(initialJobId);
  const [companyName, setCompanyName] = useState(initialCompany || "Databricks");
  const [jobTitle, setJobTitle] = useState(initialTitle || "Product Management Intern - AI & Lakehouse Platform");
  const [location, setLocation] = useState(initialLocation || "New York, NY");
  const [team, setTeam] = useState("Mosaic AI & Platform");
  const [tone, setTone] = useState<"technical" | "growth" | "executive">("technical");

  const [isGenerating, setIsGenerating] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeBullets, setResumeBullets] = useState<string[]>([]);
  const [coldEmail, setColdEmail] = useState("");
  const [copiedLetter, setCopiedLetter] = useState(false);
  const [copiedBullets, setCopiedBullets] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Fetch available jobs for selector
  useEffect(() => {
    fetch("/api/jobs")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setJobs(d.jobs);
          if (initialJobId) {
            const found = d.jobs.find((j: any) => j.id === initialJobId);
            if (found) {
              setCompanyName(found.company.name);
              setJobTitle(found.title);
              setLocation(found.location);
              setTeam(found.team || "Core Product");
            }
          }
        }
      });
  }, [initialJobId]);

  const handleSelectJob = (id: string) => {
    setSelectedJobId(id);
    const found = jobs.find((j) => j.id === id);
    if (found) {
      setCompanyName(found.company.name);
      setJobTitle(found.title);
      setLocation(found.location);
      setTeam(found.team || "Product");
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);

    try {
      const res = await fetch("/api/generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: selectedJobId || undefined,
          jobTitle,
          companyName,
          location,
          team,
          tone,
        }),
      });

      const data = await res.json();
      if (data.success && data.pitch) {
        setCoverLetter(data.pitch.coverLetter);
        setResumeBullets(data.pitch.resumeBullets);
        setColdEmail(data.pitch.coldEmailDraft);
      }
    } catch (err: any) {
      alert("Failed to generate materials: " + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // Run on first load if parameters exist
  useEffect(() => {
    handleGenerate();
  }, [companyName, tone]);

  const handleCopy = (text: string, type: "letter" | "bullets" | "email") => {
    navigator.clipboard.writeText(text);
    if (type === "letter") {
      setCopiedLetter(true);
      setTimeout(() => setCopiedLetter(false), 2000);
    } else if (type === "bullets") {
      setCopiedBullets(true);
      setTimeout(() => setCopiedBullets(false), 2000);
    } else if (type === "email") {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const handleDownloadMarkdown = () => {
    const content = `# Application Pitch Package — ${companyName} (${jobTitle})
**Candidate**: ${EMMETT_PROFILE.name} | Georgia Tech '29 | 4.0 GPA | Denning T&M Scholar
**Target Hub**: ${location} | **Tone**: ${tone.toUpperCase()}

---

## 3-Paragraph Tailored Cover Letter

${coverLetter}

---

## 3 Targeted Resume Bullets

${resumeBullets.map((b, i) => `${i + 1}. ${b}`).join("\n\n")}

---

## Georgia Tech Alumni Warm Outreach Draft

${coldEmail}
`;

    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ApexPM_${companyName.replace(/\s+/g, "_")}_Pitch.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <FileText className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Tailored Pitch & Cover Letter Generator
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Synthesizes Emmett&apos;s Georgia Tech 4.0 GPA, Denning T&M Program credentials, CS minor, and student executive leadership into bespoke application materials for any PM internship.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadMarkdown}
            disabled={!coverLetter}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            Download .md
          </button>
          <Link
            href="/tracker"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow"
          >
            View Tracker
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Role & Tone Selector Bar */}
      <div className="p-5 rounded-2xl bg-[#0b1222] border border-slate-800/90 grid grid-cols-1 md:grid-cols-4 gap-4 shadow-xl">
        
        {/* Job Select Dropdown */}
        <div className="space-y-1">
          <label className="text-xs text-slate-400 font-semibold block">Select Vetted Target Role</label>
          <select
            value={selectedJobId}
            onChange={(e) => handleSelectJob(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="">Custom Role Entry...</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.company.name} — {j.title} ({j.location.split("(")[0].trim()})
              </option>
            ))}
          </select>
        </div>

        {/* Company Name */}
        <div className="space-y-1">
          <label className="text-xs text-slate-400 font-semibold block">Company Name</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-semibold focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Location & Team */}
        <div className="space-y-1">
          <label className="text-xs text-slate-400 font-semibold block">Target Hub & Team</label>
          <input
            type="text"
            value={`${location} • ${team}`}
            onChange={(e) => {
              const parts = e.target.value.split("•");
              setLocation(parts[0]?.trim() || location);
              if (parts[1]) setTeam(parts[1].trim());
            }}
            className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Tone Selector */}
        <div className="space-y-1">
          <label className="text-xs text-slate-400 font-semibold block">Positioning Tone</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value as any)}
            className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-amber-300 focus:outline-none focus:border-amber-500"
          >
            <option value="technical">Technical & Systems PM (CS Minor emphasis)</option>
            <option value="growth">Growth & Fintech PM (Finance Club $45K emphasis)</option>
            <option value="executive">Executive Generalist APM (Scheller Ambassador)</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: 3-Paragraph Cover Letter */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl bg-[#0b1222] border border-slate-800/90 p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-xs uppercase text-slate-300">
                  3-Paragraph Tailored Cover Letter / Pitch
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(coverLetter, "letter")}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  {copiedLetter ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy Text
                    </>
                  )}
                </button>
              </div>
            </div>

            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={16}
              className="w-full p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-200 leading-relaxed font-sans focus:outline-none focus:border-emerald-500 whitespace-pre-line"
            />

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>Tailored specifically for {companyName}&apos;s {team}</span>
              <span className="text-emerald-400 font-semibold">Georgia Tech 4.0 GPA & Denning T&M Highlighted</span>
            </div>
          </div>
        </div>

        {/* Right Column: 3 Targeted Resume Bullets & GT Alumni Cold Outreach */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Section 1: 3 Targeted Resume Bullets */}
          <div className="rounded-2xl bg-[#0b1222] border border-slate-800/90 p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-xs uppercase text-slate-300">
                  3 Targeted Resume Bullets
                </span>
              </div>

              <button
                onClick={() => handleCopy(resumeBullets.join("\n\n"), "bullets")}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                {copiedBullets ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy Bullets
                  </>
                )}
              </button>
            </div>

            <div className="space-y-2.5">
              {resumeBullets.map((bullet, idx) => (
                <div 
                  key={idx} 
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-1"
                >
                  <div className="flex items-center justify-between text-[10px] text-amber-400 font-bold uppercase">
                    <span>Bullet {idx + 1}</span>
                    <span className="text-slate-500">JD Aligned</span>
                  </div>
                  <p>{bullet}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: GT Alumni Cold Outreach Email */}
          <div className="rounded-2xl bg-[#0b1222] border border-slate-800/90 p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-indigo-400" />
                <span className="font-bold text-xs uppercase text-slate-300">
                  GT Alumni Informational Email Draft
                </span>
              </div>

              <button
                onClick={() => handleCopy(coldEmail, "email")}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy Email
                  </>
                )}
              </button>
            </div>

            <textarea
              value={coldEmail}
              onChange={(e) => setColdEmail(e.target.value)}
              rows={8}
              className="w-full p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px] text-slate-300 leading-relaxed font-mono focus:outline-none focus:border-indigo-500 whitespace-pre-line"
            />
          </div>

        </div>

      </div>

    </div>
  );
}

export default function GeneratorPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400 text-xs">Loading Pitch Generator...</div>}>
      <GeneratorContent />
    </Suspense>
  );
}
