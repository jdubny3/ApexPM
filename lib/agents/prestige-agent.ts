import { SourcingAgentResult, PrestigeAgentResult } from "./types";

interface CompanyKnowledge {
  name: string;
  tier: "TIER_1A" | "TIER_1B" | "TIER_2";
  tierLabel: string;
  baseScore: number;
  aiFocus: string;
  size: string;
  techStack: string;
  apmSummary: string;
  pedigreeAnalysis: string;
}

const PRESTIGE_DATABASE: Record<string, CompanyKnowledge> = {
  "openai": {
    name: "OpenAI",
    tier: "TIER_1A",
    tierLabel: "Tier 1A: Frontier AI Leader",
    baseScore: 100,
    aiFocus: "Frontier Foundation Models, GPT & Sora Architecture, Developer API Ecosystem",
    size: "1,500 - 3,000",
    techStack: "Python, PyTorch, Triton, Kubernetes, Rust, React",
    apmSummary: "Elite product rotation under direct guidance of principal research & product leaders. Highest industry brand equity in AI.",
    pedigreeAnalysis: "Absolute benchmark for modern AI product management. Strongest signal for venture capital and executive tier technical leadership."
  },
  "anthropic": {
    name: "Anthropic",
    tier: "TIER_1A",
    tierLabel: "Tier 1A: Frontier AI & Safety Leader",
    baseScore: 100,
    aiFocus: "Claude Enterprise Systems, Constitutional AI, Frontier Safety & Reasoning",
    size: "1,000 - 2,500",
    techStack: "Python, JAX, PyTorch, TypeScript, AWS Trainium, GCP TPU",
    apmSummary: "Deeply intellectual product culture bridging advanced research with enterprise API distribution and safety guardrails.",
    pedigreeAnalysis: "Gold standard for foundational AI research and enterprise trust. Unrivaled peer cohort of ex-OpenAI/Google research PMs."
  },
  "datadog": {
    name: "Datadog",
    tier: "TIER_1B",
    tierLabel: "Tier 1B: Hypergrowth Cloud & AI Observability Leader",
    baseScore: 95,
    aiFocus: "LLM Observability, Bits AI Copilot, Real-Time Cloud Infrastructure Telemetry",
    size: "5,500+",
    techStack: "Go, Python, React, TypeScript, Kafka, Cassandra, Kubernetes",
    apmSummary: "NYC's flagship hypergrowth software company. Product interns ship features to thousands of enterprise engineering organizations with direct VP exposure.",
    pedigreeAnalysis: "Elite engineering-driven product culture headquartered in Times Square, NYC. Strongest stepping stone for enterprise cloud and AI observability."
  },
  "coinbase": {
    name: "Coinbase",
    tier: "TIER_1A",
    tierLabel: "Tier 1A: Frontier Web3 & Financial Infrastructure",
    baseScore: 97,
    aiFocus: "AI Crypto Agent Rails, Decentralized Identity, High-Frequency Exchange Infrastructure",
    size: "4,000+",
    techStack: "Go, Ruby, React, React Native, Solidity, PostgreSQL, AWS",
    apmSummary: "Fast-paced crypto and fintech leader with extreme agency. PM interns manage mission-critical features with direct executive visibility to CPO and VP of Product.",
    pedigreeAnalysis: "Unmatched agency, rapid shipping cycles, and direct fintech scale. Exceptional synergy with Emmett's Finance Club and Startup Club background."
  },
  "roblox": {
    name: "Roblox",
    tier: "TIER_1A",
    tierLabel: "Tier 1A: World-Class Tech & Immersive Platform",
    baseScore: 97,
    aiFocus: "Generative 3D Worlds, Real-Time Physics AI, Creator Economy & Monetization",
    size: "2,500 - 4,000",
    techStack: "Luau/C++, Go, Distributed Systems, WebAssembly, Kafka",
    apmSummary: "Legendary APM program renowned for giving undergraduate interns end-to-end P&L and product roadmap ownership.",
    pedigreeAnalysis: "One of the most competitive APM programs globally. Known for rigorous analytical and product intuition bars."
  },
  "google": {
    name: "Google",
    tier: "TIER_1A",
    tierLabel: "Tier 1A: Gold Standard APM Pioneer",
    baseScore: 98,
    aiFocus: "Gemini Ecosystem, Android, Cloud AI Infrastructure, Search & Ads",
    size: "180,000+",
    techStack: "C++, Java, Go, Python, Flume, Borg, Angular, TensorFlow",
    apmSummary: "The quintessential APM program founded by Marissa Mayer. Global alumni network of unicorn founders and CPOs.",
    pedigreeAnalysis: "Unmatched APM brand equity. Provides structured executive mentorship, global rotation options, and instant pedigree."
  },
  "meta": {
    name: "Meta",
    tier: "TIER_1A",
    tierLabel: "Tier 1A: World-Class Tech & Open Source AI",
    baseScore: 97,
    aiFocus: "Llama Open Weights, Reality Labs, Recommendation Engines, Advertising AI",
    size: "65,000+",
    techStack: "Python, Hack/PHP, PyTorch, React, GraphQL, Thrift",
    apmSummary: "Data-driven product powerhouse known for unmatched scale (3B+ users) and rapid execution velocity.",
    pedigreeAnalysis: "Premier technical product management pedigree. Strong NYC offices (Hudson Yards & Astor Place) with immense executive visibility."
  },
  "stripe": {
    name: "Stripe",
    tier: "TIER_1A",
    tierLabel: "Tier 1A: Elite Financial Infrastructure",
    baseScore: 99,
    aiFocus: "Autonomous Financial Agents, Global Payments Engine, Radar Fraud ML",
    size: "8,000+",
    techStack: "Ruby (Sorbet), Go, Java, React, Envoy, MongoDB",
    apmSummary: "Universally celebrated writing culture, rigorous product craft, and high agency. Produces exceptional product thinkers.",
    pedigreeAnalysis: "Unrivaled product craft and developer ecosystem. Perfect synergy with Emmett's Finance Club and Startup Club background."
  },
  "americanexpress": {
    name: "American Express",
    tier: "TIER_1B",
    tierLabel: "Tier 1B: Global Financial Rails & Enterprise Scale",
    baseScore: 91,
    aiFocus: "Autonomous Fraud Detection ML, Conversational Amex Assistant, Real-Time Decisioning",
    size: "75,000+",
    techStack: "Java, Python, React, Node.js, Kafka, Big Data Lakehouse",
    apmSummary: "Prestigious New York headquarters internship in lower Manhattan with structured executive mentorship and high return offer conversion.",
    pedigreeAnalysis: "Iconic enterprise brand with massive scale. Offers direct exposure to digital transformation across global corporate cards and merchant networks."
  },
  "atlassian": {
    name: "Atlassian",
    tier: "TIER_1B",
    tierLabel: "Tier 1B: Hypergrowth Collaboration & Developer Tools Leader",
    baseScore: 92,
    aiFocus: "Atlassian Intelligence, Jira Agent Workflows, Confluence Knowledge Graph",
    size: "12,000+",
    techStack: "Java, Kotlin, React, TypeScript, GraphQL, AWS Cloud Native",
    apmSummary: "Renowned product culture championing team collaboration and developer autonomy. High intern satisfaction with competitive return offer conversions.",
    pedigreeAnalysis: "Beloved Silicon Valley & global developer platform. Interns own user-facing creative workflows and AI capabilities."
  },
  "mastercard": {
    name: "Mastercard",
    tier: "TIER_1B",
    tierLabel: "Tier 1B: Global Payment Infrastructure & Fintech",
    baseScore: 92,
    aiFocus: "Predictive Fraud Scoring, Tokenization Rails, Open Banking APIs",
    size: "30,000+",
    techStack: "Java, Spring, Python, React, Oracle, Kafka, Azure",
    apmSummary: "Global payment giant with high conversion into permanent technical product management tracks. Strong executive mentorship.",
    pedigreeAnalysis: "Global scale payment processing network. Great match for Emmett's dual business and technical background."
  },
  "homedepot": {
    name: "The Home Depot",
    tier: "TIER_2",
    tierLabel: "Tier 2: Fortune 20 Retail Tech Leader",
    baseScore: 82,
    aiFocus: "Autonomous Supply Chain Optimization, Computer Vision Store Navigation, Omnichannel ML",
    size: "400,000+",
    techStack: "Java, Spring Boot, React, Google Cloud Platform, BigQuery",
    apmSummary: "Premier Atlanta corporate technology program located minutes from Georgia Tech's campus. Direct recruiting ties to Scheller College of Business and Denning T&M.",
    pedigreeAnalysis: "Fortune 20 scale and direct corporate sponsor of Georgia Tech programs. Offers hands-on supply chain and customer experience product management."
  },
  "bny": {
    name: "BNY",
    tier: "TIER_1B",
    tierLabel: "Tier 1B: Institutional Fintech & Custody Giant",
    baseScore: 90,
    aiFocus: "AI Capital Market Operations, Predictive Custody Analytics, Digital Asset Rails",
    size: "50,000+",
    techStack: "Java, Python, C++, React, Kafka, Kubernetes",
    apmSummary: "Flagship institutional bank headquartered in Lower Manhattan overseeing $50 trillion in assets.",
    pedigreeAnalysis: "Premier institutional finance institution in Tribeca, NYC. Bridges financial engineering with capital market platforms."
  },
  "ramp": {
    name: "Ramp",
    tier: "TIER_1B",
    tierLabel: "Tier 1B: Hypergrowth Fintech & AI Unicorn",
    baseScore: 94,
    aiFocus: "Autonomous Corporate Spend, LLM Invoice Extraction, Real-Time Accounting",
    size: "800 - 1,500",
    techStack: "Python (FastAPI), React, PostgreSQL, AWS, OpenAI API",
    apmSummary: "Fastest growing NYC fintech unicorn in history. Interns own shipping critical features with direct executive exposure.",
    pedigreeAnalysis: "Highest velocity tech environment in NYC. Direct synergy with Emmett's Finance Club Director role."
  }
};

export function runPrestigeAgent(job: SourcingAgentResult): PrestigeAgentResult {
  const compKey = job.companyName.toLowerCase().replace(/[^a-z0-9]/g, "");
  
  let matched: CompanyKnowledge | undefined;
  for (const [key, data] of Object.entries(PRESTIGE_DATABASE)) {
    if (compKey.includes(key) || key.includes(compKey)) {
      matched = data;
      break;
    }
  }

  if (matched) {
    return {
      tier: matched.tier,
      tierLabel: matched.tierLabel,
      prestigeScore: matched.baseScore,
      aiFocus: matched.aiFocus,
      rationale: matched.pedigreeAnalysis,
      companySize: matched.size,
      techStack: matched.techStack,
      apmProgramSummary: matched.apmSummary,
      rawLog: `[Agent 3: Prestige & Company Classifier] Verified enterprise pedigree for ${matched.name}. Classified as ${matched.tier} (${matched.tierLabel}) with prestige score ${matched.baseScore}/100. AI Focus: ${matched.aiFocus}.`
    };
  }

  const descLower = job.cleanDescription.toLowerCase();
  const isAiNative = descLower.includes("artificial intelligence") || descLower.includes("machine learning") || descLower.includes("llm");
  
  const tier: "TIER_1A" | "TIER_1B" | "TIER_2" = isAiNative ? "TIER_1B" : "TIER_2";
  const tierLabel = isAiNative ? "Tier 1B: Emerging AI / Tech Leader" : "Tier 2: Established Enterprise Tech";
  const prestigeScore = isAiNative ? 82 : 72;

  return {
    tier,
    tierLabel,
    prestigeScore,
    aiFocus: isAiNative ? "Applied Machine Learning & Automation" : "Enterprise Cloud & Software Systems",
    rationale: `Evaluated as ${tierLabel}. Strong operational maturity, standard industry product management framework, and solid market capitalization.`,
    companySize: "1,000 - 5,000",
    techStack: "Python, React, Cloud Native, SQL",
    apmProgramSummary: "Structured product internship with mentorship from senior PM leaders and cohort networking.",
    rawLog: `[Agent 3: Prestige & Company Classifier] Dynamically classified ${job.companyName} as ${tier} (${tierLabel}). Prestige score: ${prestigeScore}/100.`
  };
}
