import { EMMETT_PROFILE } from "../candidate-profile";

export interface PitchGeneratorOptions {
  jobTitle: string;
  companyName: string;
  location: string;
  team?: string;
  keyRequirements?: string[];
  tone?: "technical" | "growth" | "executive";
}

export interface PitchGeneratorResult {
  coverLetter: string;
  resumeBullets: string[];
  keyPitchThemes: string[];
  coldEmailDraft: string;
}

export function generateTailoredPitch(options: PitchGeneratorOptions): PitchGeneratorResult {
  const { jobTitle, companyName, location, team = "Product", keyRequirements = [], tone = "technical" } = options;

  let paragraph1 = "";
  let paragraph2 = "";
  let paragraph3 = "";

  // Paragraph 1: Hook, Georgia Tech background, 4.0 GPA, Denning T&M program, why this specific company
  paragraph1 = `Dear ${companyName} Product Recruiting Team,\n\nI am writing to express my enthusiastic candidacy for the ${jobTitle} position with ${companyName}'s ${team} team in ${location}. As a Georgia Tech sophomore majoring in Business Administration (Strategy & Innovation) with a Computer Science minor (Intelligence & Systems), a 4.0 Cumulative GPA, and selection into the premier Denning Technology & Management (T&M) Program, I have deliberately engineered my academic career at the exact nexus of cutting-edge software architecture and strategic product execution. I have long followed ${companyName}'s relentless product velocity and category leadership, and I am eager to apply my hybrid technical and commercial instincts to drive high-impact customer outcomes for your team this summer.`;

  // Paragraph 2: CS Minor depth + Denning T&M + Club Leadership (Finance Club & Startup Club)
  if (tone === "growth" || companyName.toLowerCase().includes("ramp") || companyName.toLowerCase().includes("stripe") || companyName.toLowerCase().includes("roblox")) {
    paragraph2 = `My background is defined by quantitative rigor, rapid user discovery, and economic modeling. As Finance Director of Georgia Tech's Finance Club, I steward a $45,000+ operating budget and architect unit-economic models that optimize resource allocation across eight executive committees. Concurrently, as VP of Recruiting for GT's Startup Exchange, I have evaluated 60+ early-stage venture teams and built direct recruiting channels with Y Combinator founders. Pairing this with my Computer Science coursework in data structures, algorithms, and system architecture, I can seamlessly transition between modeling monetization loops with finance stakeholders and reviewing API latency specs with backend engineers.`;
  } else {
    paragraph2 = `In the classroom and across campus leadership, I thrive on translating ambiguous problems into structured, scalable product roadmaps. Through Georgia Tech's Denning T&M Program—an elite cross-disciplinary cohort uniting top engineers and business scholars—I collaborate directly with corporate executives to deconstruct enterprise technology challenges. In parallel, serving as VP of Recruiting for GT's Startup Exchange, I have vetted 60+ collegiate venture teams, sharpening my intuition for product-market fit, customer retention, and feature prioritization. My CS minor coursework in distributed computing and machine learning provides the technical fluency needed to communicate effectively with engineering teams and anticipate technical trade-offs on day one.`;
  }

  // Paragraph 3: Executive poise, Scheller Ambassador, passion for the role, call to action
  paragraph3 = `As a Scheller College of Business Ambassador, I regularly represent Georgia Tech to Fortune 500 executive guests, prospective scholars, and advisory boards, cultivating the executive poise, transparent communication, and stakeholder alignment essential for an Associate Product Manager. I am energized by the prospect of bringing high agency, obsessive user empathy, and a tireless work ethic to ${companyName}. Thank you for your time and consideration, and I welcome the opportunity to discuss how my technical depth, quantitative acumen, and leadership experience will contribute to ${companyName}'s continued growth.`;

  const coverLetter = `${paragraph1}\n\n${paragraph2}\n\n${paragraph3}\n\nSincerely,\n\nEmmett\nGeorgia Institute of Technology | Scheller College of Business\nCandidate for B.S. Business Administration & Minor in Computer Science | Class of 2029\nDenning Technology & Management Scholar | 4.0 Cumulative GPA`;

  // 3 Targeted Resume Bullets aligned with JD requirements
  const resumeBullets: string[] = [
    `Cross-Functional Technical Roadmapping: Engineered end-to-end PRDs and system interface specifications bridging Scheller business strategy and College of Computing CS minor coursework (4.0 GPA), aligning engineering, design, and executive stakeholders on roadmap trade-offs.`,
    `Quantitative Product Modeling & Unit Economics: Directed $45K+ operational capital allocation and designed dynamic financial sensitivity models as Finance Director of GT Finance Club, applying quantitative rigor to feature valuation, pricing tiers, and monetization loops.`,
    `High-Agency Venture Execution & User Discovery: Led evaluation and founder-team matching for 60+ student-led startups as VP of Recruiting at GT Startup Exchange, conducting user interviews, validating TAM/SAM market potential, and accelerating venture incubation velocity.`
  ];

  // Cold Outreach Email for GT Alumni / Recruiters
  const coldEmailDraft = `Subject: Georgia Tech Sophomore (Denning T&M, 4.0 GPA) – ${companyName} ${jobTitle} (${location})

Hi [Name],

I hope you're having a great week! My name is Emmett, and I'm currently a sophomore at Georgia Tech studying Business Administration with a Computer Science minor (4.0 GPA) and a scholar in the Denning Technology & Management (T&M) Program. 

I've been closely following ${companyName}'s work in ${team} and was excited to see the ${jobTitle} role open in ${location}. Given your journey from GT to ${companyName}, I would love to learn briefly about your experience on the product team and what attributes differentiate standout interns at ${companyName}.

Would you have 10-15 minutes for a brief coffee chat or call over the coming weeks? Either way, thank you for your time and Go Jackets!

Best regards,
Emmett
Georgia Tech '29 | 4.0 GPA | Denning T&M Scholar
LinkedIn: linkedin.com/in/emmett-gt`;

  return {
    coverLetter,
    resumeBullets,
    keyPitchThemes: [
      "4.0 Cumulative GPA at Georgia Tech (Academic Excellence)",
      "Denning Technology & Management (T&M) Program Cohort",
      "CS Minor (Technical Fluency with Research/Engineering Teams)",
      "Finance Club Finance Director ($45K Budget & Unit Economics)",
      "Startup Club VP Recruiting (Founder Agency & 60+ Team Vetting)",
      "Scheller Ambassador (Executive Presence & Stakeholder Diplomacy)"
    ],
    coldEmailDraft
  };
}
