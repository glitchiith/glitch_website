import { PrismaClient } from "@prisma/client";
import { HOSTELS } from "../lib/constants/hostels";
const prisma = new PrismaClient();
// Seed hostel names only. Never inject fabricated players into a real leaderboard.
async function main() {
  for (const [id, name] of Object.entries(HOSTELS)) {
    await prisma.hostels.upsert({ where: { id: Number(id) }, update: { name }, create: { id: Number(id), name } });
  }
}
main().catch(() => { console.error("Hostel seed failed."); process.exitCode = 1; }).finally(() => prisma.$disconnect());
