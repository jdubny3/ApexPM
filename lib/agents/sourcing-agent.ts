import { RawJobInput, SourcingAgentResult } from "./types";

export function runSourcingAgent(input: RawJobInput): SourcingAgentResult {
  const locLower = (input.location || "").toLowerCase();
  let locationTier: "NYC" | "BAY_AREA" | "OTHER_TIER1" | "OTHER" = "OTHER";
  let locationScore = 30;

  if (
    locLower.includes("new york") ||
    locLower.includes("nyc") ||
    locLower.includes("manhattan") ||
    locLower.includes("brooklyn")
  ) {
    locationTier = "NYC";
    locationScore = 100; // Primary Target Location (1.00 weight)
  } else if (
    locLower.includes("san francisco") ||
    locLower.includes("bay area") ||
    locLower.includes("silicon valley") ||
    locLower.includes("san mateo") ||
    locLower.includes("mountain view") ||
    locLower.includes("palo alto") ||
    locLower.includes("sunnyvale") ||
    locLower.includes("menlo park")
  ) {
    locationTier = "BAY_AREA";
    locationScore = 85; // Secondary Target Location (0.85 weight)
  } else if (
    locLower.includes("seattle") ||
    locLower.includes("boston") ||
    locLower.includes("remote")
  ) {
    locationTier = "OTHER_TIER1";
    locationScore = 60;
  } else {
    locationTier = "OTHER";
    locationScore = 30;
  }

  // Determine workplace type
  let workplaceType: "HYBRID" | "ONSITE" | "REMOTE" = "HYBRID";
  if (locLower.includes("remote") || input.description.toLowerCase().includes("fully remote")) {
    workplaceType = "REMOTE";
  } else if (input.description.toLowerCase().includes("in-office 5 days") || input.description.toLowerCase().includes("onsite only")) {
    workplaceType = "ONSITE";
  }

  // Extract structured requirements
  const rawReqs = input.requirements
    ? input.requirements.split("\n").map(r => r.trim()).filter(Boolean)
    : input.description
        .split("\n")
        .filter(l => l.startsWith("-") || l.startsWith("•") || l.startsWith("*"))
        .map(l => l.replace(/^[-•*]\s*/, "").trim())
        .filter(l => l.length > 10)
        .slice(0, 6);

  const stipend = input.stipend || "$55 - $75 / hr + Housing Stipend / Relocation";
  const team = input.team || "Core Product & Platform";
  const deadline = input.deadline || "October 31, 2026 (Rolling Admissions - Priority Window)";
  const source = input.source || "Greenhouse API";

  return {
    title: input.title.trim(),
    companyName: input.companyName.trim(),
    location: input.location.trim(),
    locationTier,
    locationScore,
    workplaceType,
    stipend,
    team,
    cleanDescription: input.description.trim(),
    extractedRequirements: rawReqs.length > 0 ? rawReqs : [
      "Pursuing a Bachelor's degree in Business, Computer Science, or related technical field",
      "Demonstrated experience in product intuition, roadmapping, and data-informed decision making",
      "Strong cross-functional leadership, quantitative modeling, and communication skills",
      "Passionate about technology architecture, system design, and building delightful user experiences"
    ],
    url: input.url || `https://careers.${input.companyName.toLowerCase().replace(/[^a-z0-9]/g, "")}.com/jobs/apm-intern`,
    source,
    deadline,
    rawLog: `[Agent 1: Ingestion & Sourcing] Ingested "${input.title}" at "${input.companyName}". Detected location: "${input.location}" -> Assigned location tier ${locationTier} (Base score: ${locationScore}). Extracted ${rawReqs.length} core requirement vectors.`
  };
}
