import { NextResponse } from "next/server";
import { runAgentPipeline } from "@/lib/agents/orchestrator";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title = "Associate Product Manager Intern",
      companyName = "Tech Unicorn",
      location = "New York, NY",
      description = "",
      requirements = "",
      stipend = "",
      team = "",
      url = "",
      source = "Manual Ingestion",
      deadline = ""
    } = body;

    if (!description && !title) {
      return NextResponse.json(
        { success: false, error: "Please provide a job title and description." },
        { status: 400 }
      );
    }

    // Execute pipeline through all 5 stages
    const result = runAgentPipeline({
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
    });

    return NextResponse.json({
      success: true,
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
