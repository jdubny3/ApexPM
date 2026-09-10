import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyLiveOpportunity } from "@/lib/agents/live-verifier";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { url, jobId, verifyAll } = body;

    if (verifyAll) {
      const jobs = await prisma.job.findMany();
      const results = [];

      for (const job of jobs) {
        const check = await verifyLiveOpportunity(job.url);
        results.push({
          jobId: job.id,
          company: job.title,
          ...check,
        });

        // If inactive, mark status
        if (!check.isLive) {
          await prisma.job.update({
            where: { id: job.id },
            data: { status: "EXPIRED" },
          });
        }
      }

      return NextResponse.json({
        success: true,
        count: results.length,
        verifiedJobs: results,
      });
    }

    if (!url && !jobId) {
      return NextResponse.json(
        { success: false, error: "Please provide a URL or jobId to verify." },
        { status: 400 }
      );
    }

    let targetUrl = url;
    if (jobId) {
      const job = await prisma.job.findUnique({ where: { id: jobId } });
      if (job) targetUrl = job.url;
    }

    const check = await verifyLiveOpportunity(targetUrl);

    return NextResponse.json({
      success: true,
      verification: check,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to verify opportunity" },
      { status: 500 }
    );
  }
}
