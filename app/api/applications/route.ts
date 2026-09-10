import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const applications = await prisma.application.findMany({
      include: {
        job: {
          include: {
            company: {
              include: {
                alumni: true,
              },
            },
            evaluation: true,
          },
        },
      },
      orderBy: {
        job: {
          apexScore: "desc",
        },
      },
    });

    return NextResponse.json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, stage, priority, notes, targetDeadline, interviewDate } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Application ID is required" },
        { status: 400 }
      );
    }

    const data: any = {};
    if (stage !== undefined) data.stage = stage;
    if (priority !== undefined) data.priority = priority;
    if (notes !== undefined) data.notes = notes;
    if (targetDeadline !== undefined) data.targetDeadline = targetDeadline;
    if (interviewDate !== undefined) data.interviewDate = interviewDate;

    const updated = await prisma.application.update({
      where: { id },
      data,
      include: {
        job: {
          include: {
            company: true,
            evaluation: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      application: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update application" },
      { status: 500 }
    );
  }
}
