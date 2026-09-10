import http from "http";
import cron from "node-cron";
import { syncSummer2027OpportunitiesWithGemini } from "../../lib/services/gemini-sourcing-service";
import { prisma } from "../../lib/prisma";

const PORT = parseInt(process.env.PORT || "8080", 10);
const CRON_SCHEDULE = process.env.CRON_SCHEDULE || "0 6 * * *"; // Daily at 6:00 AM UTC
const WEB_APP_URL = process.env.WEB_APP_URL || "";
const CRON_SECRET = process.env.CRON_SECRET || "";

interface WorkerState {
  status: "idle" | "running";
  lastSyncTime: string | null;
  lastSyncResult: any | null;
  totalRuns: number;
  uptimeStart: string;
}

const state: WorkerState = {
  status: "idle",
  lastSyncTime: null,
  lastSyncResult: null,
  totalRuns: 0,
  uptimeStart: new Date().toISOString()
};

async function executeSyncTask(source = "scheduled"): Promise<any> {
  if (state.status === "running") {
    console.log(`[Worker] Sync already in progress (requested by ${source}). Skipping.`);
    return { status: "already_running" };
  }

  state.status = "running";
  console.log(`\n======================================================`);
  console.log(`[Worker] Triggering Summer 2027 Ingestion via Gemini (${source})`);
  console.log(`[Worker] Time: ${new Date().toISOString()}`);
  console.log(`======================================================\n`);

  try {
    let result: any;

    // If a remote web app URL is provided, call its sync API
    if (WEB_APP_URL) {
      console.log(`[Worker] Forwarding sync request to Web App: ${WEB_APP_URL}/api/cron/sync...`);
      const headers: Record<string, string> = {
        "Content-Type": "application/json"
      };
      if (CRON_SECRET) {
        headers["Authorization"] = `Bearer ${CRON_SECRET}`;
      }

      const res = await fetch(`${WEB_APP_URL.replace(/\/$/, "")}/api/cron/sync`, {
        method: "POST",
        headers
      });

      result = await res.json();
      console.log(`[Worker] Remote Web App response:`, result);
    } else {
      // Direct Mode: execute local Gemini sourcing and Prisma DB update
      result = await syncSummer2027OpportunitiesWithGemini();
    }

    state.lastSyncTime = new Date().toISOString();
    state.lastSyncResult = result;
    state.totalRuns++;
    console.log(`[Worker] Ingestion run completed successfully (Run #${state.totalRuns}).\n`);
    return result;
  } catch (error: any) {
    console.error(`[Worker] Error during ingestion run:`, error.message);
    state.lastSyncResult = { error: error.message };
    return { error: error.message };
  } finally {
    state.status = "idle";
  }
}

// 1. Initialize Daily Cron Schedule
console.log(`[Worker] Registering daily cron schedule: "${CRON_SCHEDULE}"...`);
cron.schedule(CRON_SCHEDULE, () => {
  executeSyncTask("cron-scheduler");
});

// 2. HTTP Server for Health Checks, Cloud Run Lifecycle & Webhook Triggers
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host}`);

  // Health check endpoint (for Cloud Run probes)
  if (url.pathname === "/" || url.pathname === "/health") {
    let totalJobsInDb = 0;
    try {
      totalJobsInDb = await prisma.job.count();
    } catch {
      // Ignored if DB not connected
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      status: "healthy",
      service: "ApexPM Gemini Daily Ingestion Worker",
      schedule: CRON_SCHEDULE,
      totalJobsTracked: totalJobsInDb,
      lastSyncTime: state.lastSyncTime,
      totalRunsCompleted: state.totalRuns,
      uptimeStart: state.uptimeStart,
      state: state.status
    }, null, 2));
    return;
  }

  // Manual or Cloud Scheduler Trigger endpoint
  if (url.pathname === "/sync" || url.pathname === "/trigger") {
    const querySecret = url.searchParams.get("secret");
    if (CRON_SECRET && querySecret !== CRON_SECRET) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, error: "Unauthorized: Invalid secret." }));
      return;
    }

    const result = await executeSyncTask("http-trigger");
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: true, triggerResult: result }, null, 2));
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not Found" }));
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`[Worker] ApexPM Gemini Cron Worker listening on http://0.0.0.0:${PORT}`);
  console.log(`[Worker] Health endpoint: http://0.0.0.0:${PORT}/health`);
  console.log(`[Worker] Trigger endpoint: http://0.0.0.0:${PORT}/sync`);

  // Execute an initial synchronization on startup
  console.log("[Worker] Executing initial startup synchronization...");
  executeSyncTask("startup");
});
