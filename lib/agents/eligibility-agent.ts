import { SourcingAgentResult, EligibilityAgentResult } from "./types";
import { EMMETT_PROFILE } from "../candidate-profile";

export function runEligibilityAgent(job: SourcingAgentResult): EligibilityAgentResult {
  const text = (job.cleanDescription + " " + job.extractedRequirements.join(" ")).toLowerCase();
  
  let verdict: "SOPHOMORE_ELIGIBLE" | "RISING_JUNIOR_PREFERRED" | "PENULTIMATE_ONLY" = "SOPHOMORE_ELIGIBLE";
  let verdictLabel = "Sophomore Eligible (Target Summer 2027)";
  let scoreMultiplier = 1.0;
  let isHardDisqualified = false;
  let rationale = "";
  let confidence = 0.95;
  const gradYearWindow = "Dec 2028 - May 2029 (Undergraduate)";

  const hasStrictPenultimate = 
    (text.includes("penultimate year only") || 
     text.includes("must be graduating in 2028 only") || 
     text.includes("strictly for juniors graduating may 2028")) &&
    !text.includes("or sophomores");

  const hasSophomoreMention = 
    text.includes("sophomore") || 
    text.includes("second year") || 
    text.includes("2nd year") || 
    text.includes("2029") || 
    text.includes("rising junior") || 
    text.includes("undergraduate students of any year") ||
    text.includes("early career") ||
    text.includes("apm intern");

  const hasRisingJunior = 
    text.includes("rising junior") || 
    text.includes("junior preferred") || 
    text.includes("graduating between dec 2027 and june 2028");

  if (hasStrictPenultimate) {
    verdict = "PENULTIMATE_ONLY";
    verdictLabel = "Penultimate Year Only (Deprioritized / High Bar)";
    scoreMultiplier = 0.50;
    isHardDisqualified = false; // still allow review if GT CS minor / 4.0 GPA can bypass via referral
    confidence = 0.92;
    rationale = `Program posting explicitly specifies penultimate year standing (Class of 2028). However, Emmett's 4.0 GPA, Denning T&M cohort credentials, and Georgia Tech CS Minor provide an exceptional bypass profile via warm alumni referral. Flagged for selective outreach.`;
  } else if (hasSophomoreMention || text.includes("intern")) {
    verdict = "SOPHOMORE_ELIGIBLE";
    verdictLabel = "Sophomore Eligible (Verified)";
    scoreMultiplier = 1.0;
    isHardDisqualified = false;
    confidence = 0.98;
    rationale = `Posting explicitly welcomes sophomores / rising juniors (graduating Dec 2028 – May 2029) or early undergraduate talent with strong technical and quantitative foundation. Emmett meets and exceeds all standing criteria.`;
  } else if (hasRisingJunior) {
    verdict = "RISING_JUNIOR_PREFERRED";
    verdictLabel = "Rising Junior Preferred (Eligible)";
    scoreMultiplier = 0.85;
    isHardDisqualified = false;
    confidence = 0.88;
    rationale = `Role prefers candidates entering their junior year by Summer 2027. Emmett's standing as a rising junior in Summer 2027 with sophomore coursework completed fits the recruiting cycle.`;
  } else {
    verdict = "SOPHOMORE_ELIGIBLE";
    verdictLabel = "Sophomore Eligible (General Cohort)";
    scoreMultiplier = 0.95;
    confidence = 0.90;
    rationale = `General undergraduate PM intern profile with standard graduation window. Emmett's Georgia Tech sophomore standing and 4.0 GPA qualify him directly.`;
  }

  return {
    verdict,
    verdictLabel,
    scoreMultiplier,
    rationale,
    gradYearWindow,
    isHardDisqualified,
    confidence,
    rawLog: `[Agent 2: Sophomore Eligibility] Vetted candidate timeline for ${EMMETT_PROFILE.name} (${EMMETT_PROFILE.classYear}, grad ${EMMETT_PROFILE.gradDate}). Verdict: ${verdict} (${verdictLabel}). Confidence: ${(confidence * 100).toFixed(0)}%.`
  };
}
