import { NextResponse } from "next/server";
import { runAgentPipeline } from "@/lib/agents/orchestrator";
import { syncSummer2027OpportunitiesWithGemini } from "@/lib/services/gemini-sourcing-service";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const triggerSync = searchParams.get("sync") === "true";

    let syncReport = null;
    if (triggerSync) {
      syncReport = await syncSummer2027OpportunitiesWithGemini();
    }

    const allJobs = await prisma.job.findMany({
      where: {
        locationTier: { in: ["NYC", "BAY_AREA"] },
      },
      include: {
        company: {
          include: { alumni: true },
        },
        evaluation: true,
        application: true,
      },
      orderBy: {
        apexScore: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      mode: "scour",
      report: syncReport,
      count: allJobs.length,
      jobs: allJobs,
    });
  } catch (error: any) {
    console.error("GET agent pipeline failed:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to query agent pipeline" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      mode,
      scour,
      action,
      title,
      companyName,
      location,
      description,
      requirements,
      stipend,
      team,
      url,
      source,
      deadline
    } = body;

    // Mode 1: Full Autonomous Web Scour via Gemini & Live Portals
    // Triggered when mode="scour", scour=true, action="scour", or when no custom description is supplied
    const isSingleRoleAudit = mode === "single" || (Boolean(description) && Boolean(title) && mode !== "scour");

    if (!isSingleRoleAudit) {
      console.log("[API /api/agents/run] Running full autonomous web-scouring fleet via Gemini for Summer 2027 PM roles...");
      const syncReport = await syncSummer2027OpportunitiesWithGemini();

      const allJobs = await prisma.job.findMany({
        where: {
          locationTier: { in: ["NYC", "BAY_AREA"] },
        },
        include: {
          company: {
            include: { alumni: true },
          },
          evaluation: true,
          application: true,
        },
        orderBy: {
          apexScore: "desc",
        },
      });

      return NextResponse.json({
        success: true,
        mode: "scour",
        report: syncReport,
        count: allJobs.length,
        jobs: allJobs,
      });
    }

    // Mode 2: Single Role Custom Audit
    const result = runAgentPipeline({
      title: title || "Associate Product Manager Intern",
      companyName: companyName || "Tech Unicorn",
      location: location || "New York, NY",
      description: description || "",
      requirements: requirements || "",
      stipend: stipend || "",
      team: team || "",
      url: url || "",
      source: source || "Manual Ingestion",
      deadline: deadline || ""
    });

    return NextResponse.json({
      success: true,
      mode: "single",
      result
    });
  } catch (error: any) {
    console.error("Agent pipeline run failed:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to run agent pipeline" },
      { status: 500 }
    );
  }
}
