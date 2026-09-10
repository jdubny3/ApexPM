import { SourcingAgentResult, EligibilityAgentResult, PrestigeAgentResult, FitAgentResult } from "./types";
import { EMMETT_PROFILE } from "../candidate-profile";

export function runFitAgent(
  job: SourcingAgentResult,
  eligibility: EligibilityAgentResult,
  prestige: PrestigeAgentResult
): FitAgentResult {
  const jdText = (job.cleanDescription + " " + job.extractedRequirements.join(" ")).toLowerCase();
  const comp = job.companyName.toLowerCase();

  let fitScore = 88; // High baseline for Emmett's 4.0 GPA + GT profile

  // 1. Technical synergy check (CS Minor, Systems, Data)
  const isTechnical = 
    jdText.includes("technical") || 
    jdText.includes("computer science") || 
    jdText.includes("api") || 
    jdText.includes("architecture") || 
    jdText.includes("data") || 
    jdText.includes("infrastructure") ||
    jdText.includes("ai") ||
    jdText.includes("machine learning");

  if (isTechnical) {
    fitScore += 6;
  }

  // 2. Financial / Monetization / Strategy PM synergy
  const isFintechOrGrowth = 
    comp.includes("stripe") || 
    comp.includes("ramp") || 
    comp.includes("roblox") ||
    jdText.includes("monetization") || 
    jdText.includes("pricing") || 
    jdText.includes("finance") || 
    jdText.includes("payments") || 
    jdText.includes("growth");

  if (isFintechOrGrowth) {
    fitScore += 5;
  }

  // 3. Denning T&M corporate synergy
  fitScore += 4;

  // Apply eligibility penalty if strictly penultimate
  if (eligibility.verdict === "PENULTIMATE_ONLY") {
    fitScore -= 12;
  }

  fitScore = Math.min(100, Math.max(50, fitScore));

  // Generate 3 customized "Why Emmett Excels Here" bullets
  const bullets: string[] = [];

  // Bullet 1: Technical & Systems Depth (CS Minor + 4.0 GPA)
  if (comp.includes("openai") || comp.includes("anthropic") || comp.includes("databricks")) {
    bullets.push(
      `Technical Rigor in AI & Data Systems: Emmett pairs a perfect 4.0 GPA at Georgia Tech with a Computer Science minor (focusing on intelligence and systems). He effortlessly translates complex foundation model architectures and API benchmarks into crisp product requirements for research engineers.`
    );
  } else if (comp.includes("stripe") || comp.includes("ramp")) {
    bullets.push(
      `Quantitative Financial Engineering & Systems Depth: Emmett bridges technical API infrastructure with deep financial acumen as Finance Director of Georgia Tech's Finance Club ($45K budget) combined with his CS Minor, enabling him to speak the language of payment engineers and risk analysts on day one.`
    );
  } else if (comp.includes("roblox")) {
    bullets.push(
      `Creator Monetization & Platform Architecture: Emmett's Computer Science minor and quantitative modeling experience directly map to Roblox's real-time economy and creator payouts, allowing him to model complex virtual currency dynamics and user retention loops with engineering precision.`
    );
  } else {
    bullets.push(
      `Scheller Business Acumen Meets College of Computing Technical Depth: Emmett combines a 4.0 GPA in Strategy & Innovation with a Computer Science minor at Georgia Tech, giving him the rare capability to bridge customer discovery, unit economics, and distributed systems architecture.`
    );
  }

  // Bullet 2: Denning T&M Enterprise Leadership
  bullets.push(
    `Elite Denning Technology & Management (T&M) Credentials: Hand-selected for Georgia Tech's premier cross-disciplinary cohort uniting top engineers and business scholars, Emmett is trained specifically to solve multifaceted enterprise product challenges alongside corporate sponsors.`
  );

  // Bullet 3: Startup Club Recruiting & Executive Presence
  if (comp.includes("ramp") || comp.includes("notion") || comp.includes("figma") || comp.includes("openai")) {
    bullets.push(
      `High-Velocity Venture Instincts & Founder Agency: As VP of Recruiting for Georgia Tech's Startup Exchange, Emmett has evaluated over 60+ early-stage venture teams and built talent pipelines with YC founders—bringing unmatched velocity, high agency, and a bias for action to ${job.companyName}.`
    );
  } else {
    bullets.push(
      `Executive Poise & Stakeholder Alignment: Serving as a Scheller Ambassador and leading 60+ candidate evaluations as VP of Recruiting in GT's Startup Club, Emmett possesses the executive presence, diplomatic stakeholder management, and clarity required to present roadmaps to C-level leaders.`
    );
  }

  const technicalSynergy = `Computer Science minor coursework (Data Structures, Algorithms, Systems) paired with 4.0 GPA provides instant fluency with ${job.companyName}'s engineering teams.`;
  const businessSynergy = `Scheller Business Administration major with Strategy & Innovation concentration + Denning T&M program provides mature product roadmapping, TAM sizing, and P&L understanding.`;
  const leadershipSynergy = `Finance Director (Finance Club) + VP of Recruiting (Startup Club) + Scheller Ambassador delivers high-agency execution and cross-functional leadership.`;

  return {
    fitScore,
    whyEmmettFits: bullets,
    fitRationale: `Emmett represents the ideal 99th percentile sophomore PM archetype for ${job.companyName}: a perfect 4.0 GPA at Georgia Tech, dual business and CS rigor, premier Denning T&M program affiliation, and proven student executive leadership.`,
    technicalSynergy,
    businessSynergy,
    leadershipSynergy,
    rawLog: `[Agent 4: Emmett Fit & Synergy] Evaluated candidate synergy for ${job.companyName} (${job.title}). Computed Fit Score: ${fitScore}/100. Generated 3 role-specific custom proof points highlighting CS minor, Denning T&M, and leadership track record.`
  };
}
