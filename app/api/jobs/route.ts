import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runAgentPipeline } from "@/lib/agents/orchestrator";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.toLowerCase() || "";
    const locationTier = searchParams.get("locationTier"); // "NYC", "BAY_AREA", "ALL"
    const tier = searchParams.get("tier");
    const eligibility = searchParams.get("eligibility");

    // Strictly enforce NYC or SF Bay Area locations only
    const locationCondition =
      locationTier && locationTier !== "ALL"
        ? locationTier
        : { in: ["NYC", "BAY_AREA"] };

    const jobs = await prisma.job.findMany({
      where: {
        locationTier: locationCondition,
      },
      include: {
        company: {
          include: {
            alumni: true,
          },
        },
        evaluation: true,
        application: true,
      },
      orderBy: {
        apexScore: "desc",
      },
    });

    let filtered = jobs;

    if (search) {
      filtered = filtered.filter(
        (j) =>
          j.title.toLowerCase().includes(search) ||
          j.company.name.toLowerCase().includes(search) ||
          j.location.toLowerCase().includes(search) ||
          (j.team && j.team.toLowerCase().includes(search))
      );
    }

    if (tier && tier !== "ALL") {
      filtered = filtered.filter((j) => j.company.tier === tier);
    }

    if (eligibility && eligibility !== "ALL") {
      filtered = filtered.filter(
        (j) => j.evaluation?.eligibilityVerdict === eligibility
      );
    }

    return NextResponse.json({
      success: true,
      count: filtered.length,
      jobs: filtered,
    });
  } catch (error: any) {
    console.error("Failed to fetch jobs:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, companyName, location, description, requirements, stipend, team, url, source, deadline } = body;

    if (!title || !companyName || !location || !description) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: title, companyName, location, description" },
        { status: 400 }
      );
    }

    // Run 5-agent pipeline
    const pipelineResult = runAgentPipeline({
      title,
      companyName,
      location,
      description,
      requirements,
      stipend,
      team,
      url,
      source,
      deadline,
    });

    // Enforce NYC or Bay Area constraint
    if (pipelineResult.job.locationTier !== "NYC" && pipelineResult.job.locationTier !== "BAY_AREA") {
      return NextResponse.json(
        { 
          success: false, 
          error: `Location "${location}" is not in NYC or SF Bay Area. Emmett's target criteria strictly filters for New York City and SF Bay Area.` 
        },
        { status: 400 }
      );
    }

    const slug = `${companyName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${title.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Date.now()}`;
    const compSlug = companyName.toLowerCase().replace(/[^a-z0-9]/g, "-");

    // Find or create company
    let company = await prisma.company.findUnique({
      where: { slug: compSlug },
    });

    if (!company) {
      company = await prisma.company.create({
        data: {
          name: companyName,
          slug: compSlug,
          tier: pipelineResult.prestige.tier,
          tierLabel: pipelineResult.prestige.tierLabel,
          hqLocation: location,
          aiFocus: pipelineResult.prestige.aiFocus,
          companySize: pipelineResult.prestige.companySize,
          techStack: pipelineResult.prestige.techStack,
          apmProgramSummary: pipelineResult.prestige.apmProgramSummary,
          websiteUrl: `https://${compSlug}.com`,
        },
      });
    }

    // Create job
    const job = await prisma.job.create({
      data: {
        title,
        slug,
        companyId: company.id,
        location,
        locationTier: pipelineResult.job.locationTier,
        workplaceType: pipelineResult.job.workplaceType,
        stipend: pipelineResult.job.stipend,
        team: pipelineResult.job.team,
        description,
        requirements: requirements || pipelineResult.job.extractedRequirements.join("\n"),
        url: pipelineResult.job.url,
        source: pipelineResult.job.source,
        deadline: pipelineResult.job.deadline,
        apexScore: pipelineResult.apexScore,
        locationScore: pipelineResult.scoringBreakdown.locationScore,
        prestigeScore: pipelineResult.scoringBreakdown.prestigeScore,
        fitScore: pipelineResult.scoringBreakdown.fitScore,
        trajectoryScore: pipelineResult.scoringBreakdown.trajectoryScore,
      },
    });

    // Create agent evaluation
    const evaluation = await prisma.agentEvaluation.create({
      data: {
        jobId: job.id,
        eligibilityVerdict: pipelineResult.eligibility.verdict,
        eligibilityRationale: pipelineResult.eligibility.rationale,
        gradYearWindow: pipelineResult.eligibility.gradYearWindow,
        prestigeTier: pipelineResult.prestige.tier,
        prestigeRationale: pipelineResult.prestige.rationale,
        fitScore: pipelineResult.fit.fitScore,
        whyEmmettFits: JSON.stringify(pipelineResult.fit.whyEmmettFits),
        fitRationale: pipelineResult.fit.fitRationale,
        trajectoryScore: pipelineResult.trajectory.trajectoryScore,
        trajectoryRationale: pipelineResult.trajectory.trajectoryRationale,
        returnOfferEstimate: pipelineResult.trajectory.returnOfferEstimate,
        mentorshipQuality: pipelineResult.trajectory.mentorshipQuality,
        agentAuditLog: JSON.stringify(pipelineResult.auditLogs),
      },
    });

    // Create application entry in tracker
    const application = await prisma.application.create({
      data: {
        jobId: job.id,
        stage: "DISCOVERED",
        priority: pipelineResult.apexScore > 95 ? "CRITICAL" : "HIGH",
        targetDeadline: deadline || null,
        notes: `Auto-evaluated by ApexPM 5-agent pipeline. Location Score: ${pipelineResult.scoringBreakdown.locationScore}, Prestige: ${pipelineResult.scoringBreakdown.prestigeScore}, Fit: ${pipelineResult.scoringBreakdown.fitScore}, Trajectory: ${pipelineResult.scoringBreakdown.trajectoryScore}.`,
      },
    });

    return NextResponse.json({
      success: true,
      job: {
        ...job,
        company,
        evaluation,
        application,
      },
      pipelineResult,
    });
  } catch (error: any) {
    console.error("Failed to create job:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create job" },
      { status: 500 }
    );
  }
}
