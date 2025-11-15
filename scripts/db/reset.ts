// Path aliases and env are preloaded via tsx -r in package.json
import { db } from "@/config/db";
import { sql } from "drizzle-orm";
import {
  accounts,
  users,
  verificationTokens,
} from "@/db/users-schema";
import {
  applicants,
  appliedAsRecruiter,
  company,
  experienceLevels,
  jobLocations,
  jobSkills,
  jobTypes,
  jobs,
  skills,
} from "@/db/job-schema";
import { resumes, resumeSections } from "@/db/resume-schema";
import { orders } from "@/db/order";

async function countTable(table: any): Promise<number> {
  const rows = await db.select({ count: sql<number>`count(*)` }).from(table);
  const c = (rows?.[0] as any)?.count ?? 0;
  return Number(c);
}

async function logClear(label: string, table: any) {
  const before = await countTable(table);
  if (before > 0) {
    await db.delete(table);
  } else {
    // still execute delete to be safe
    await db.delete(table);
  }
  console.log(`Cleared ${before} from ${label}`);
}

async function reset() {
  console.log("Starting database clear...");
  // Delete in dependency order to satisfy FK constraints
  await logClear("job_skills", jobSkills);
  await logClear("applicants", applicants);
  await logClear("applied_as_recruiter", appliedAsRecruiter);
  await logClear("jobs", jobs);
  await logClear("skills", skills);
  await logClear("company", company);
  await logClear("experience_levels", experienceLevels);
  await logClear("job_types", jobTypes);
  await logClear("job_locations", jobLocations);
  await logClear("resume_sections", resumeSections);
  await logClear("resumes", resumes);
  await logClear("orders", orders);
  await logClear("account", accounts);
  await logClear("verificationToken", verificationTokens);
  await logClear("user", users);
  console.log("Database clear complete.");
}

reset()
  .then(() => {
    console.log("Database cleared successfully.");
  })
  .catch((err) => {
    console.error("Failed to clear database:", err);
  });
