import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncSummer2027OpportunitiesWithGemini, GeminiOpportunitySchema } from "@/lib/services/gemini-sourcing-service";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const clientJobs: any[] = Array.isArray(body.jobs) ? body.jobs : [];

    if (clientJobs.length === 0) {
      return NextResponse.json({ success: true, message: "No client jobs to sync." });
    }

    console.log(`[API /api/jobs/sync-client] Received ${clientJobs.length} client-persisted jobs for additive rehydration...`);

    // Transform client jobs to GeminiOpportunitySchema
    const rolesToSync: GeminiOpportunitySchema[] = clientJobs.map((cj) => ({
      companyName: cj.company?.name || cj.companyName || "Company",
      companySlug: cj.company?.slug || cj.companySlug || (cj.company?.name || cj.companyName || "").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      tier: cj.company?.tier || cj.tier || "TIER_1B",
      tierLabel: cj.company?.tierLabel || cj.tierLabel || "Tier 1B: Hypergrowth Tech Leader",
      hqLocation: cj.company?.hqLocation || cj.hqLocation || cj.location || "New York, NY",
      aiFocus: cj.company?.aiFocus || cj.aiFocus || "AI & Product Platform",
      companySize: cj.company?.companySize || cj.companySize || "1,000+ employees",
      techStack: cj.company?.techStack || cj.techStack || "Python, React, TypeScript",
      apmProgramSummary: cj.company?.apmProgramSummary || cj.apmProgramSummary || "High-impact product management internship.",
      websiteUrl: cj.company?.websiteUrl || cj.websiteUrl || "https://example.com",
      title: cj.title,
      jobSlug: cj.slug || cj.jobSlug || `${cj.company?.name || cj.companyName}-${cj.title}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      location: cj.location,
      locationTier: cj.locationTier || (cj.location?.toLowerCase().includes("new york") || cj.location?.toLowerCase().includes("nyc") ? "NYC" : "BAY_AREA"),
      stipend: cj.stipend || "$65 - $75 / hr",
      team: cj.team || "Core Product",
      workplaceType: cj.workplaceType || "HYBRID",
      deadline: cj.deadline || "Rolling Admissions",
      url: cj.url,
      source: cj.source || "ATS Portal Direct",
      description: cj.description || "",
      requirements: cj.requirements || "",
      alumni: cj.company?.alumni || cj.alumni || [],
    }));

    await syncSummer2027OpportunitiesWithGemini({
      additionalRoles: rolesToSync,
      skipLivePing: true,
    });

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
      count: allJobs.length,
      jobs: allJobs,
    });
  } catch (err: any) {
    console.error("Failed to sync client jobs:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to sync client jobs" },
      { status: 500 }
    );
  }
}
