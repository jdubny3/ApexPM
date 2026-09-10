"use client";

import { useEffect, useState } from "react";
import { 
  Kanban, 
  MapPin, 
  Calendar, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  MessageSquare, 
  GraduationCap, 
  FileText, 
  ExternalLink,
  Plus,
  Clock,
  AlertCircle,
  CheckCircle,
  RefreshCw
} from "lucide-react";
import Link from "next/link";
import { RoleDeepDiveModal } from "@/components/role-deep-dive-modal";

const STAGES = [
  { id: "DISCOVERED", label: "Discovered", color: "border-slate-700 text-slate-300" },
  { id: "REVIEWING", label: "Reviewing", color: "border-blue-500/50 text-blue-400" },
  { id: "TAILORING", label: "Tailoring Materials", color: "border-amber-500/50 text-amber-400" },
  { id: "APPLIED", label: "Applied", color: "border-indigo-500/50 text-indigo-400" },
  { id: "INTERVIEWING", label: "Interviewing", color: "border-purple-500/50 text-purple-400" },
  { id: "OFFER", label: "Offer Received", color: "border-emerald-500/50 text-emerald-400" },
];

export default function TrackerPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/applications");
      const data = await res.json();
      if (data.success) {
        setApplications(data.applications);
      }
    } catch (err) {
      console.error("Failed to load applications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStageChange = async (appId: string, newStage: string) => {
    try {
      const res = await fetch("/api/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: appId, stage: newStage }),
      });
      const data = await res.json();
      if (data.success) {
        setApplications((prev) =>
          prev.map((app) => (app.id === appId ? { ...app, stage: newStage } : app))
        );
      }
    } catch (err) {
      console.error("Failed to update stage:", err);
    }
  };

  const handleSaveNote = async (appId: string) => {
    try {
      const res = await fetch("/api/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: appId, notes: noteText }),
      });
      const data = await res.json();
      if (data.success) {
        setApplications((prev) =>
          prev.map((app) => (app.id === appId ? { ...app, notes: noteText } : app))
        );
        setEditingNoteId(null);
      }
    } catch (err) {
      console.error("Failed to save note:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Title & Quick Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Application Pipeline & Kanban Tracker
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Summer 2027
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage your recruitment lifecycle from initial agent ingestion through technical interviews and offer letters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchApplications}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Sync Tracker
          </button>
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow"
          >
            + Vetted Roles Feed
          </Link>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 items-start">
        {STAGES.map((stage) => {
          const columnApps = applications.filter((app) => app.stage === stage.id);

          return (
            <div
              key={stage.id}
              className="flex flex-col rounded-2xl bg-[#0b1222] border border-slate-800/90 overflow-hidden min-h-[500px]"
            >
              {/* Column Header */}
              <div className="p-3.5 bg-[#0e1629] border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    stage.id === "OFFER" ? "bg-emerald-400" : stage.id === "INTERVIEWING" ? "bg-purple-400" : "bg-slate-400"
                  }`} />
                  <span className="font-bold text-xs text-white">{stage.label}</span>
                </div>
                <span className="px-2 py-0.2 rounded-full bg-slate-800 text-[10px] font-bold text-slate-400">
                  {columnApps.length}
                </span>
              </div>

              {/* Column Cards */}
              <div className="p-2.5 space-y-2.5 flex-1 overflow-y-auto">
                {columnApps.map((app) => {
                  const job = app.job;
                  if (!job) return null;
                  const isNyc = job.locationTier === "NYC";
                  const alumniCount = job.company?.alumni?.length || 0;

                  return (
                    <div
                      key={app.id}
                      className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 shadow-md space-y-2.5 group transition-all"
                    >
                      {/* Company & Apex */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-bold text-white text-sm group-hover:text-emerald-300 transition-colors">
                            {job.company.name}
                          </div>
                          <div className="text-[11px] text-slate-300 line-clamp-1">
                            {job.title}
                          </div>
                        </div>

                        <span className="px-1.5 py-0.5 rounded bg-[#070b14] border border-slate-700 text-xs font-black text-white shrink-0">
                          {job.apexScore.toFixed(1)}
                        </span>
                      </div>

                      {/* Location & Alumni Badge */}
                      <div className="flex flex-wrap items-center gap-1 text-[10px]">
                        <span className={`px-2 py-0.5 rounded-full font-semibold ${
                          isNyc ? "badge-nyc" : "badge-bayarea"
                        }`}>
                          <MapPin className="w-2.5 h-2.5 inline mr-0.5" />
                          {job.location.split("(")[0].trim()}
                        </span>

                        {alumniCount > 0 && (
                          <span className="px-1.5 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20 font-semibold">
                            {alumniCount} GT Alum
                          </span>
                        )}
                      </div>

                      {/* Deadline Tag */}
                      {app.targetDeadline && (
                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>Deadline: {app.targetDeadline}</span>
                        </div>
                      )}

                      {/* Notes snippet / editor */}
                      {editingNoteId === app.id ? (
                        <div className="space-y-1 pt-1">
                          <textarea
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            placeholder="Add recruiter/alumni contacts, interview notes..."
                            className="w-full p-2 text-xs rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                            rows={2}
                          />
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setEditingNoteId(null)}
                              className="px-2 py-0.5 text-[10px] text-slate-400 hover:text-white"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSaveNote(app.id)}
                              className="px-2 py-0.5 text-[10px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div 
                          onClick={() => {
                            setEditingNoteId(app.id);
                            setNoteText(app.notes || "");
                          }}
                          className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 hover:border-slate-700 cursor-pointer flex items-center justify-between gap-1"
                        >
                          <span className="line-clamp-1 italic">
                            {app.notes || "Click to add custom notes & contacts..."}
                          </span>
                          <MessageSquare className="w-3 h-3 text-slate-500 shrink-0" />
                        </div>
                      )}

                      {/* Card Action Bar */}
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        {/* Move Stage Dropdown */}
                        <select
                          value={app.stage}
                          onChange={(e) => handleStageChange(app.id, e.target.value)}
                          className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-semibold text-slate-300 focus:outline-none focus:border-emerald-500"
                        >
                          {STAGES.map((s) => (
                            <option key={s.id} value={s.id}>
                              Move: {s.label}
                            </option>
                          ))}
                        </select>

                        <div className="flex items-center gap-1">
                          <Link
                            href={`/generator?jobId=${job.id}`}
                            className="p-1 rounded text-slate-400 hover:text-amber-300"
                            title="Generate Pitch & Cover Letter"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => setSelectedJob(job)}
                            className="p-1 rounded text-slate-400 hover:text-emerald-400"
                            title="Inspect Role Deep Dive"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}

                {columnApps.length === 0 && (
                  <div className="h-32 flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
                    <span>No roles in {stage.label}</span>
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Deep Dive Modal */}
      <RoleDeepDiveModal
        job={selectedJob}
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        onUpdateStage={handleStageChange}
      />
    </div>
  );
}
