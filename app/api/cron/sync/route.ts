import { NextResponse } from "next/server";
import { syncSummer2027OpportunitiesWithGemini } from "@/lib/services/gemini-sourcing-service";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return handleSync(request);
}

export async function POST(request: Request) {
  return handleSync(request);
}

async function handleSync(request: Request) {
  const cronSecret = process.env.CRON_SECRET;

  // If a CRON_SECRET is defined, verify Authorization header or query secret
  if (cronSecret) {
    const authHeader = request.headers.get("authorization");
    const { searchParams } = new URL(request.url);
    const querySecret = searchParams.get("secret");

    const isAuthorized =
      authHeader === `Bearer ${cronSecret}` || querySecret === cronSecret;

    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Invalid cron secret." },
        { status: 401 }
      );
    }
  }

  try {
    const report = await syncSummer2027OpportunitiesWithGemini();
    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error: any) {
    console.error("[Cron Sync Route Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to sync opportunities." },
      { status: 500 }
    );
  }
}
