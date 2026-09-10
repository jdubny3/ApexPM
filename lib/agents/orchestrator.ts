import { RawJobInput, AgentPipelineResult } from "./types";
import { runSourcingAgent } from "./sourcing-agent";
import { runEligibilityAgent } from "./eligibility-agent";
import { runPrestigeAgent } from "./prestige-agent";
import { runFitAgent } from "./fit-agent";
import { runTrajectoryAgent } from "./trajectory-agent";

export function runAgentPipeline(input: RawJobInput): AgentPipelineResult {
  const now = new Date().toISOString();
  const auditLogs: AgentPipelineResult["auditLogs"] = [];

  // Stage 1: Sourcing & Ingestion Agent
  const job = runSourcingAgent(input);
  auditLogs.push({
    step: 1,
    agentName: "Agent 1: Ingestion & Sourcing Agent",
    action: "Extract & Normalize Job Schema",
    summary: `Ingested ${job.title} at ${job.companyName}. Identified Location Tier: ${job.locationTier} (${job.locationScore} pts).`,
    details: job.rawLog,
    timestamp: now
  });

  // Stage 2: Sophomore Eligibility Agent
  const eligibility = runEligibilityAgent(job);
  auditLogs.push({
    step: 2,
    agentName: "Agent 2: Sophomore Eligibility Agent",
    action: "Graduation Date & Class Standing Verification",
    summary: `Verdict: ${eligibility.verdictLabel}. Grad Window: ${eligibility.gradYearWindow}.`,
    details: eligibility.rawLog,
    timestamp: new Date(Date.now() + 150).toISOString()
  });

  // Stage 3: Prestige & Company Classifier Agent
  const prestige = runPrestigeAgent(job);
  auditLogs.push({
    step: 3,
    agentName: "Agent 3: Prestige & Company Classifier",
    action: "Enterprise Pedigree & AI Leadership Scoring",
    summary: `Tier: ${prestige.tierLabel} (${prestige.prestigeScore}/100). Focus: ${prestige.aiFocus}.`,
    details: prestige.rawLog,
    timestamp: new Date(Date.now() + 300).toISOString()
  });

  // Stage 4: Emmett Fit & Synergy Agent
  const fit = runFitAgent(job, eligibility, prestige);
  auditLogs.push({
    step: 4,
    agentName: "Agent 4: Emmett Fit & Synergy Agent",
    action: "Academic & Leadership Synergy Evaluation",
    summary: `Fit Score: ${fit.fitScore}/100. Generated 3 GT Business + CS Minor tailored proof points.`,
    details: fit.rawLog,
    timestamp: new Date(Date.now() + 450).toISOString()
  });

  // Stage 5: Career Trajectory Predictor Agent
  const trajectory = runTrajectoryAgent(job, prestige);
  auditLogs.push({
    step: 5,
    agentName: "Agent 5: Career Trajectory Predictor",
    action: "Return Offer & Stepping Stone Modeling",
    summary: `Trajectory Score: ${trajectory.trajectoryScore}/100. Conversion Est: ${trajectory.returnOfferEstimate}.`,
    details: trajectory.rawLog,
    timestamp: new Date(Date.now() + 600).toISOString()
  });

  // Ranking Algorithm & Scoring Formula:
  // Apex Score = (S_Location * 0.30) + (S_Prestige * 0.25) + (S_Fit * 0.25) + (S_Trajectory * 0.20)
  const locationWeighted = job.locationScore * 0.30;
  const prestigeWeighted = prestige.prestigeScore * 0.25;
  const fitWeighted = fit.fitScore * 0.25;
  const trajectoryWeighted = trajectory.trajectoryScore * 0.20;

  let totalApexScore = locationWeighted + prestigeWeighted + fitWeighted + trajectoryWeighted;
  
  // Minor adjustment if eligibility requires penalization
  if (eligibility.scoreMultiplier < 1.0) {
    totalApexScore = totalApexScore * eligibility.scoreMultiplier;
  }
  
  totalApexScore = Math.round(totalApexScore * 10) / 10;

  return {
    job,
    eligibility,
    prestige,
    fit,
    trajectory,
    apexScore: totalApexScore,
    scoringBreakdown: {
      locationScore: job.locationScore,
      locationWeighted: Math.round(locationWeighted * 10) / 10,
      prestigeScore: prestige.prestigeScore,
      prestigeWeighted: Math.round(prestigeWeighted * 10) / 10,
      fitScore: fit.fitScore,
      fitWeighted: Math.round(fitWeighted * 10) / 10,
      trajectoryScore: trajectory.trajectoryScore,
      trajectoryWeighted: Math.round(trajectoryWeighted * 10) / 10,
      totalApexScore
    },
    auditLogs
  };
}
