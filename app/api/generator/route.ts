import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateTailoredPitch } from "@/lib/agents/pitch-generator";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { jobId, tone = "technical" } = body;

    let jobTitle = body.jobTitle;
    let companyName = body.companyName;
    let location = body.location;
    let team = body.team;
    let requirements: string[] = [];

    if (jobId) {
      const job = await prisma.job.findUnique({
        where: { id: jobId },
        include: { company: true },
      });

      if (job) {
        jobTitle = job.title;
        companyName = job.company.name;
        location = job.location;
        team = job.team || "Product Team";
        requirements = job.requirements.split("\n").filter(Boolean);
      }
    }

    if (!jobTitle || !companyName) {
      return NextResponse.json(
        { success: false, error: "Job title and company name are required." },
        { status: 400 }
      );
    }

    const pitch = generateTailoredPitch({
      jobTitle,
      companyName,
      location: location || "New York, NY",
      team: team || "Product",
      keyRequirements: requirements,
      tone: tone as any,
    });

    // If jobId provided, persist to application record
    if (jobId) {
      await prisma.application.update({
        where: { jobId },
        data: {
          tailoredCoverLetter: pitch.coverLetter,
          tailoredResumeBullets: JSON.stringify(pitch.resumeBullets),
        },
      }).catch(() => null);
    }

    return NextResponse.json({
      success: true,
      pitch,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate tailored materials" },
      { status: 500 }
    );
  }
}
