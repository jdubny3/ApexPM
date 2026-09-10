export interface RawJobInput {
  title: string;
  companyName: string;
  location: string;
  description: string;
  requirements?: string;
  stipend?: string;
  team?: string;
  url?: string;
  source?: string;
  deadline?: string;
}

export interface SourcingAgentResult {
  title: string;
  companyName: string;
  location: string;
  locationTier: "NYC" | "BAY_AREA" | "OTHER_TIER1" | "OTHER";
  locationScore: number;
  workplaceType: "HYBRID" | "ONSITE" | "REMOTE";
  stipend: string;
  team: string;
  cleanDescription: string;
  extractedRequirements: string[];
  url: string;
  source: string;
  deadline: string;
  rawLog: string;
}

export interface EligibilityAgentResult {
  verdict: "SOPHOMORE_ELIGIBLE" | "RISING_JUNIOR_PREFERRED" | "PENULTIMATE_ONLY";
  verdictLabel: string;
  scoreMultiplier: number;
  rationale: string;
  gradYearWindow: string;
  isHardDisqualified: boolean;
  confidence: number;
  rawLog: string;
}

export interface PrestigeAgentResult {
  tier: "TIER_1A" | "TIER_1B" | "TIER_2";
  tierLabel: string;
  prestigeScore: number;
  aiFocus: string;
  rationale: string;
  companySize: string;
  techStack: string;
  apmProgramSummary: string;
  rawLog: string;
}

export interface FitAgentResult {
  fitScore: number;
  whyEmmettFits: string[];
  fitRationale: string;
  technicalSynergy: string;
  businessSynergy: string;
  leadershipSynergy: string;
  rawLog: string;
}

export interface TrajectoryAgentResult {
  trajectoryScore: number;
  trajectoryRationale: string;
  returnOfferEstimate: string;
  mentorshipQuality: string;
  careerSteppingStoneValue: string;
  rawLog: string;
}

export interface AgentPipelineResult {
  job: SourcingAgentResult;
  eligibility: EligibilityAgentResult;
  prestige: PrestigeAgentResult;
  fit: FitAgentResult;
  trajectory: TrajectoryAgentResult;
  apexScore: number;
  scoringBreakdown: {
    locationScore: number;
    locationWeighted: number;
    prestigeScore: number;
    prestigeWeighted: number;
    fitScore: number;
    fitWeighted: number;
    trajectoryScore: number;
    trajectoryWeighted: number;
    totalApexScore: number;
  };
  auditLogs: {
    step: number;
    agentName: string;
    action: string;
    summary: string;
    details: string;
    timestamp: string;
  }[];
}
