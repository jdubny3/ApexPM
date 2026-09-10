export interface CandidateProfile {
  name: string;
  university: string;
  school: string;
  classYear: string;
  gradDate: string;
  standing: string;
  gpa: number;
  major: string;
  minor: string;
  programs: string[];
  leadership: {
    role: string;
    organization: string;
    summary: string;
    impact: string;
  }[];
  targetRoles: string[];
  locations: {
    primary: {
      name: string;
      code: string;
      weight: number;
      label: string;
    };
    secondary: {
      name: string;
      code: string;
      weight: number;
      label: string;
    };
    tier1Others: {
      names: string[];
      weight: number;
    };
  };
  skills: {
    product: string[];
    technical: string[];
    business: string[];
  };
  keyStrengths: string[];
}

export const EMMETT_PROFILE: CandidateProfile = {
  name: "Emmett",
  university: "Georgia Institute of Technology",
  school: "Scheller College of Business & College of Computing",
  classYear: "Class of 2029",
  gradDate: "May 2029 (Rising Junior Summer 2027)",
  standing: "Sophomore (2nd Year Undergraduate)",
  gpa: 4.0,
  major: "Business Administration (Concentration in Strategy & Innovation)",
  minor: "Computer Science (Intelligence & Systems)",
  programs: [
    "Denning Technology & Management (T&M) Program",
    "Scheller Business Ambassador",
  ],
  leadership: [
    {
      role: "Finance Director",
      organization: "Georgia Tech Finance Club",
      summary: "Directs $45K+ operational budget, financial forecasting, and corporate banking sponsorship relations.",
      impact: "Developed quantitative unit-economic models and managed capital allocations across 8 executive committees.",
    },
    {
      role: "VP of Recruiting",
      organization: "Georgia Tech Startup Exchange / Startup Club",
      summary: "Heads talent scouting, venture incubator cohorts, and founder-team matching.",
      impact: "Vetted 60+ student-led startups and orchestrated direct recruiting pipelines with YC and top-tier seed funds.",
    },
    {
      role: "Ambassador",
      organization: "Scheller College of Business",
      summary: "Selected among top 2% of business undergrads to represent Georgia Tech to executive boards, keynote guests, and prospective scholars.",
      impact: "Regularly briefs Fortune 500 tech executives and manages VIP corporate delegations.",
    },
  ],
  targetRoles: [
    "Associate Product Manager (APM) Intern",
    "Product Management Intern",
    "Technical Product Manager (TPM) Intern",
  ],
  locations: {
    primary: {
      name: "New York City Metro",
      code: "NYC",
      weight: 1.00,
      label: "Highest Priority (100 pts)",
    },
    secondary: {
      name: "San Francisco / Silicon Valley Bay Area",
      code: "BAY_AREA",
      weight: 0.85,
      label: "High Priority (85 pts)",
    },
    tier1Others: {
      names: ["Seattle, WA", "Boston, MA", "Remote"],
      weight: 0.60,
    },
  },
  skills: {
    product: [
      "Product Strategy & Roadmapping",
      "User Empathy & PRD Authoring",
      "A/B Testing & Data Analysis",
      "Growth Loops & Monetization",
      "Feature Prioritization (RICE/Kano)",
    ],
    technical: [
      "Python (Data Science, PyTorch)",
      "Object-Oriented Programming (Java/C++)",
      "SQL & Data Modeling",
      "APIs & System Architecture",
      "LLM Prompt Orchestration & RAG",
    ],
    business: [
      "Unit Economics & DCF Modeling",
      "Venture Capital & Market Sizing (TAM/SAM/SOM)",
      "Competitive Intelligence",
      "Executive Storytelling & Pitching",
      "Cross-Functional Team Leadership",
    ],
  },
  keyStrengths: [
    "Rare blend of Scheller Business acumen and College of Computing CS technical rigor",
    "Selected for the prestigious Denning Technology & Management (T&M) cohort",
    "Perfect 4.0 Cumulative GPA across challenging quantitative coursework",
    "Proven executive presence through Scheller Ambassador and Student Club leadership",
    "Deep interest in AI-native platforms, fintech rails, and world-class consumer/enterprise software",
  ],
};
