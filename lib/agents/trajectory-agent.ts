import { SourcingAgentResult, PrestigeAgentResult, TrajectoryAgentResult } from "./types";

export function runTrajectoryAgent(
  job: SourcingAgentResult,
  prestige: PrestigeAgentResult
): TrajectoryAgentResult {
  const comp = job.companyName.toLowerCase();
  
  let trajectoryScore = 85;
  let returnOfferEstimate = "80% - 88% historical conversion to rising-junior return / full-time APM";
  let mentorshipQuality = "Senior PM Mentor + Dedicated Peer Cohort Buddy";
  let careerSteppingStoneValue = "Exceptional credential unlocking top 1% junior PM recruiting and venture opportunities.";
  let trajectoryRationale = "";

  if (comp.includes("google") || comp.includes("roblox")) {
    trajectoryScore = 98;
    returnOfferEstimate = "90% - 95% historical return offer rate to junior APM / full-time APM cohort";
    mentorshipQuality = "Executive VP / Director Mentorship + 1-on-1 CPO Sessions + Global APM Alumni Network";
    careerSteppingStoneValue = "Pinnacle APM program brand. Immediate credibility across the entire technology ecosystem.";
    trajectoryRationale = `${job.companyName}'s APM program is widely recognized as a premier breeding ground for future tech executives and startup founders. Interns are heavily groomed for accelerated junior return offers and permanent APM slots.`;
  } else if (comp.includes("openai") || comp.includes("anthropic")) {
    trajectoryScore = 99;
    returnOfferEstimate = "88% - 94% retention with high conversion into core research PM and technical product teams";
    mentorshipQuality = "Direct collaboration with Principal Researchers, Head of Product, and Foundation Model Leads";
    careerSteppingStoneValue = "Frontier AI pedigree that positions Emmett at the cutting edge of the next 20 years of computing.";
    trajectoryRationale = `Frontier AI leaders offer unprecedented career acceleration. Experience here instantly establishes Emmett as a standout technical PM capable of commercializing state-of-the-art AI systems.`;
  } else if (comp.includes("stripe") || comp.includes("databricks")) {
    trajectoryScore = 96;
    returnOfferEstimate = "85% - 92% conversion to junior-year internships and fast-track full-time offers";
    mentorshipQuality = "Lead PM 1-on-1 mentorship, executive design reviews, and cross-functional engineering leads";
    careerSteppingStoneValue = "Elite infrastructure & developer platform brand with immense industry respect.";
    trajectoryRationale = `Both Stripe and Databricks are gold-standard technology institutions where product craft and technical excellence are deeply rewarded, opening every door for Summer 2028 and beyond.`;
  } else if (comp.includes("ramp") || comp.includes("figma") || comp.includes("notion")) {
    trajectoryScore = 93;
    returnOfferEstimate = "82% - 90% return offer rate with high leadership velocity";
    mentorshipQuality = "Founding PM & Executive Leadership mentorship with weekly direct demo days";
    careerSteppingStoneValue = "Hypergrowth unicorn pedigree demonstrating speed, extreme agency, and user craftsmanship.";
    trajectoryRationale = `Hypergrowth environments cultivate high agency and rapid product velocity. Emmett's work will directly impact millions of users, providing undeniable portfolio pieces for his junior year.`;
  } else {
    trajectoryScore = prestige.tier === "TIER_1A" ? 92 : prestige.tier === "TIER_1B" ? 86 : 78;
    returnOfferEstimate = "75% - 85% return offer rate based on performance milestones";
    mentorshipQuality = "Assigned Senior PM Mentor with bi-weekly formal 1-on-1 check-ins";
    careerSteppingStoneValue = "Strong enterprise foundation validating large-scale cross-functional execution.";
    trajectoryRationale = `Solid career stepping stone that validates Emmett's ability to drive product roadmaps within structured engineering organizations.`;
  }

  return {
    trajectoryScore,
    trajectoryRationale,
    returnOfferEstimate,
    mentorshipQuality,
    careerSteppingStoneValue,
    rawLog: `[Agent 5: Career Trajectory Predictor] Computed Trajectory Score: ${trajectoryScore}/100 for ${job.companyName}. Return offer conversion estimate: ${returnOfferEstimate}. Mentorship tier: ${mentorshipQuality}.`
  };
}
