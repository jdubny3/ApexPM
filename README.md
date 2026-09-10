# ApexPM — Agentic PM Internship Discovery & Matching Engine

An elite, full-stack multi-agent platform designed to discover, vet, score, and track Product Management (PM) and Associate Product Manager (APM) internships for **Emmett**, a standout Georgia Tech sophomore (Class of 2029 / Rising Junior Summer 2027).

Built with **Next.js 14 App Router**, **TypeScript**, **Tailwind CSS**, **Prisma**, **SQLite**, and an autonomous **Multi-Agent Evaluation Fleet**.

---

## 🎯 Candidate Persona & Target Criteria

| Attribute | Specification | Agent Guidance |
|---|---|---|
| **Candidate** | **Emmett** | Personalized dashboard, tailored application briefs |
| **University & Year** | Georgia Tech, Sophomore (Class of 2029 / Rising Junior Summer 2027) | Verifies undergraduate sophomore eligibility (Dec 2028 – May 2029 grad) |
| **Major & Minor** | B.S. Business Administration (Strategy & Innovation) & CS Minor (Intelligence & Systems) | Evaluates dual technical & business synergy |
| **Honors & Leadership** | 4.0 GPA, Denning Technology & Management (T&M) Program, Finance Club Finance Director, Startup Exchange VP Recruiting | Tailors 3 high-conviction proof points for every role |
| **Target Hubs** | **Strictly NYC Metro** (#1 Priority, 100 pts) & **San Francisco Bay Area** (#2 Priority, 85 pts) | Hard geofencing enforced across backend and UI |
| **Target Roles** | Product Management Intern, APM Intern, AI Product Manager Intern | Undergrad internships only |
| **Recruiting Cycle** | **Summer 2027** | Live verified direct ATS applications |

---

## 🤖 Multi-Agent Orchestration Fleet

ApexPM runs an autonomous multi-agent pipeline that evaluates every candidate job:

1. **Ingestion & Sourcing Agent (`lib/agents/sourcing-agent.ts`)**: Ingests postings, extracts requirements, and enforces location scoring (NYC = 100, SF = 85).
2. **Sophomore Eligibility Agent (`lib/agents/eligibility-agent.ts`)**: Validates class standing, graduation dates, and filters out non-sophomore roles.
3. **Prestige & Pedigree Classifier (`lib/agents/prestige-agent.ts`)**: Classifies companies into Tier 1A (Elite AI/Tech), Tier 1B (Hypergrowth Unicorns), and Tier 2 (Enterprise Software).
4. **Emmett Fit & Synergy Agent (`lib/agents/fit-agent.ts`)**: Evaluates alignment with Emmett's CS minor, 4.0 GPA, and student executive leadership, generating 3 custom proof points.
5. **Career Trajectory Predictor (`lib/agents/trajectory-agent.ts`)**: Models return offer conversion rates and junior-year stepping stones.
6. **Live Verification Agent (`lib/agents/live-verifier.ts`)**: Conducts real-time HTTP health audits to ensure every link connects directly to the active application form (no search results or generic career portals).
7. **Pitch & Tailored Brief Generator (`lib/agents/pitch-generator.ts`)**: Generates custom cover letters, resume bullets, and GT alumni cold outreach emails.

---

## 🌐 Verified Live Opportunities (Summer 2027)

Every opportunity has been verified live (HTTP 200) directly to its ATS application form:

- **Coinbase** — Product Manager Intern (HR Tech) | **New York, NY** | Apex: **97.7** | [Direct Greenhouse Embed](https://boards.greenhouse.io/embed/job_app?token=8175504)
- **Datadog** — Product Management Intern | **New York, NY** | Apex: **95.5** | [Direct Greenhouse Req](https://careers.datadoghq.com/detail/8108241/?gh_jid=8108241)
- **American Express** — PM Intern (Global Commercial Services) | **New York, NY** | Apex: **95.0** | [Direct Oracle HCM](https://egug.fa.us2.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_1/job/26012558)
- **BNY** — PM Intern (Global Platforms) | **New York, NY** | Apex: **94.7** | [Direct Oracle HCM](https://eofe.fa.us2.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_1001/job/81345)
- **American Express** — Product Development Intern (Global Servicing) | **New York, NY** | Apex: **94.5** | [Direct Oracle HCM](https://egug.fa.us2.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_1/job/26012749)
- **Roblox** — Product Management Intern | **San Mateo, CA** | Apex: **94.4** | [Direct Greenhouse Req](https://careers.roblox.com/jobs/8143981?gh_jid=8143981)
- **Coinbase** — APM Intern (Multiple Teams) | **San Francisco, CA** | Apex: **92.7** | [Direct Greenhouse Embed](https://boards.greenhouse.io/embed/job_app?token=8168322)
- **Atlassian** — Product Management Intern | **San Francisco, CA** | Apex: **90.2** | [Direct iCIMS Req](https://careers-americas.icims.com/jobs/26274/product-management-intern%2c-2027-summer-u.s./job)
- **TikTok** — AI PM Intern (Product Social) | **San Jose, CA** | Apex: **88.2** | [Direct Simplify Verified](https://simplify.jobs/p/7fff5796-fc88-4d04-a6fa-be35e0bdb2e0/AI-Product-Manager-Intern)
- **Databricks** — Product Management Intern | **Mountain View / SF, CA** | Apex: **87.2** | [Direct Greenhouse Embed](https://boards.greenhouse.io/embed/job_app?token=6883068002)

---

## 🚀 Running Locally

### 1. Prerequisites
- Node.js 18+ (Node 20 recommended)
- npm 9+

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/jdubny3/ApexPM.git
cd ApexPM

# Install dependencies
npm install

# Initialize Prisma Client and SQLite Database
npx prisma generate
npx prisma db push

# Seed verified Summer 2027 opportunities
npm run seed
```

### 3. Run Development Server
```bash
npm run dev
# Open http://localhost:3000
```

### 4. Build & Run Production
```bash
npm run build
npm start
```

---

## ☁️ Deploying to Google Cloud Run

This repository is pre-configured with a production **`Dockerfile`**, **`docker-entrypoint.sh`**, and **`cloudbuild.yaml`** designed for automatic detection and deployment by Google Cloud Run.

### Option A: Automatic Continuous Deployment via GitHub (Recommended)

1. Go to the **[Google Cloud Run Console](https://console.cloud.google.com/run)**.
2. Click **Create Service**.
3. Select **Continuously deploy from a repository** and click **Set up with Cloud Build**.
4. Choose **GitHub** as the provider and select `jdubny3/ApexPM`.
5. Under Build Configuration:
   - Branch: `^main$`
   - Build Type: **Dockerfile** (Path: `/Dockerfile`)
6. Under Service settings:
   - Allow unauthenticated invocations: **Checked**
   - Port: **8080** (automatically detected from Dockerfile `EXPOSE 8080`)
   - Autoscaling: 1 to 5 instances
7. Click **Create**.
Cloud Run will automatically build the container image, run database migrations and seeds, and launch the live application on a public `.run.app` HTTPS URL. Every subsequent push to `main` triggers a live zero-downtime deployment.

### Option B: Deploy via Google Cloud CLI

Run the following command from the project root:

```bash
gcloud run deploy apexpm \
  --source . \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080
```

### Option C: Google Cloud Build

Submit the build using the included `cloudbuild.yaml`:

```bash
gcloud builds submit --config cloudbuild.yaml
```

---

## 🤖 Daily Automated Ingestion Service (Powered by Gemini)

ApexPM includes a dedicated daily background worker service that queries Google Gemini to surface newly posted Summer 2027 PM/APM undergraduate internships in NYC and the SF Bay Area.

### How It Works:
1. **Gemini Ingestion (`lib/services/gemini-sourcing-service.ts`)**:
   - Queries Gemini with Emmett's profile (4.0 GPA, Business + CS Minor, Denning T&M, Finance Club Director).
   - Extracts opportunities strictly for **Summer 2027** in **NYC** or **SF Bay Area** with direct ATS links.
   - Formats opportunities into the exact database schema.
2. **Multi-Agent Evaluation**:
   - Automatically runs each discovered opportunity through the 5-agent evaluation fleet to compute the Apex Score and generate 3 custom Georgia Tech proof points.
3. **Live ATS Verification**:
   - Conducts an automated HTTP 200 health check against the application portal.
4. **Database Upsert**:
   - Atomically updates `Company`, `Job`, `AgentEvaluation`, `Application`, and `AlumniContact` in the database.

### Running the Worker Container

ApexPM includes `Dockerfile.worker` for running the automated worker service:

```bash
# Build the dedicated worker container
docker build -t apexpm-worker -f Dockerfile.worker .

# Run the container with your Gemini API key
docker run -d -p 8080:8080 \
  -e GEMINI_API_KEY="your-gemini-api-key" \
  -e CRON_SCHEDULE="0 6 * * *" \
  apexpm-worker
```

### Deploying the Worker to Google Cloud Run

```bash
# Deploy as a Cloud Run background service
gcloud run deploy apexpm-worker \
  --source . \
  --dockerfile Dockerfile.worker \
  --region us-central1 \
  --set-env-vars GEMINI_API_KEY="your-gemini-api-key",CRON_SCHEDULE="0 6 * * *" \
  --allow-unauthenticated
```

### Cloud Scheduler Daily Trigger (Alternative)

You can also trigger daily updates directly on your primary web app via Google Cloud Scheduler:
1. Go to **Google Cloud Scheduler** -> **Create Job**.
2. Frequency: `0 6 * * *` (Daily at 6 AM).
3. Target type: **HTTP**.
4. URL: `https://[YOUR_CLOUD_RUN_URL]/api/cron/sync`
5. HTTP Method: **POST**.

---

## 📁 Repository Structure

```
ApexPM/
├── app/
│   ├── api/
│   │   ├── agents/run/         # Live multi-agent execution pipeline
│   │   ├── agents/verify/      # Automated HTTP ATS link verification
│   │   ├── applications/       # Kanban application lifecycle
│   │   ├── generator/          # Pitch & cover letter generation
│   │   └── jobs/               # Hard-geofenced NYC & SF PM jobs query
│   ├── generator/              # Cover letter & pitch generator page
│   ├── pipeline/               # Multi-agent runner & telemetry
│   ├── tracker/                # 6-stage Kanban board
│   ├── layout.tsx              # Root layout & navigation
│   └── page.tsx                # Executive dashboard & opportunity feed
├── components/
│   ├── candidate-header.tsx    # Emmett GT profile executive banner
│   ├── role-deep-dive-modal.tsx# 5-agent breakdown & "Ping Live ATS"
│   └── tracker-column.tsx      # Kanban stage column
├── lib/
│   ├── agents/                 # Multi-agent fleet implementation
│   ├── candidate-profile.ts    # Emmett GT profile & weights
│   └── prisma.ts               # Prisma ORM client
├── prisma/
│   ├── schema.prisma           # Database schema (Jobs, Evaluations, Applications)
│   └── dev.db                  # Pre-seeded SQLite database
├── scripts/
│   └── seed.ts                 # Seeding script with 10 verified opportunities
├── Dockerfile                  # Cloud Run multi-stage Docker build
├── docker-entrypoint.sh        # Cloud Run container entrypoint & DB self-heal
├── cloudbuild.yaml             # Cloud Build deployment automation
└── README.md
```

---

## 📄 License
MIT
