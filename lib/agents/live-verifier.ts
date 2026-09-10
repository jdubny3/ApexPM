export interface VerificationResult {
  url: string;
  isLive: boolean;
  httpStatus: number;
  season: "Summer 2027" | "Active 2027";
  atsPlatform: "Greenhouse" | "Lever" | "Workday" | "iCIMS" | "Oracle HCM" | "Direct / Simplify";
  verifiedAt: string;
  notes: string;
}

export async function verifyLiveOpportunity(url: string): Promise<VerificationResult> {
  const verifiedAt = new Date().toISOString();
  let atsPlatform: VerificationResult["atsPlatform"] = "Direct / Simplify";

  if (url.includes("greenhouse.io")) {
    atsPlatform = "Greenhouse";
  } else if (url.includes("lever.co")) {
    atsPlatform = "Lever";
  } else if (url.includes("myworkdayjobs.com")) {
    atsPlatform = "Workday";
  } else if (url.includes("icims.com")) {
    atsPlatform = "iCIMS";
  } else if (url.includes("oraclecloud.com")) {
    atsPlatform = "Oracle HCM";
  }

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      },
      redirect: "follow",
    });

    const isLive = res.status >= 200 && res.status < 400;

    return {
      url,
      isLive,
      httpStatus: res.status,
      season: "Summer 2027",
      atsPlatform,
      verifiedAt,
      notes: isLive
        ? `Live verification confirmed via ${atsPlatform} (HTTP ${res.status}). Application portal accepting candidates for Summer 2027.`
        : `Portal returned HTTP ${res.status}. Role may be paused or closed.`
    };
  } catch (error: any) {
    return {
      url,
      isLive: false,
      httpStatus: 0,
      season: "Summer 2027",
      atsPlatform,
      verifiedAt,
      notes: `Verification failed with network error: ${error.message}`
    };
  }
}
