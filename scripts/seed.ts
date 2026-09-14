import { prisma } from "../lib/prisma";
import { syncSummer2027OpportunitiesWithGemini } from "../lib/services/gemini-sourcing-service";

async function main() {
  console.log("🚀 Starting ApexPM Additive Seeding Pipeline for Summer 2027 PM Internships...");

  // Synchronize all verified Summer 2027 opportunities additively (upsert mode - no deletion)
  const report = await syncSummer2027OpportunitiesWithGemini();

  const totalJobs = await prisma.job.count();
  console.log(`\n🎉 Additive seed completed successfully!`);
  console.log(`📊 Synchronized: ${report.totalEvaluated} evaluated (${report.newRolesCount} new, ${report.updatedRolesCount} updated).`);
  console.log(`✅ Total active opportunities in database: ${totalJobs}`);
}

main()
  .catch((e) => {
    console.error("❌ Additive seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
