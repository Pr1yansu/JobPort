import { faker } from "@faker-js/faker";
import { db } from "@/config/db";
import {
  users,
  accounts,
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
import { hashPassword } from "@/lib/password";

// Unsplash Source helpers (link-only)
const unsplashAvatar = (seed: string) =>
  `https://source.unsplash.com/seed/${seed}/96x96/?portrait,person`;
const unsplashLogo = (seed: string) =>
  `https://source.unsplash.com/seed/${seed}/200x200/?logo,brand,abstract`;

async function clearAll() {
  console.log("[seed] Clearing database...");
  await db.delete(jobSkills);           console.log("[seed] Cleared job_skills");
  await db.delete(applicants);          console.log("[seed] Cleared applicants");
  await db.delete(appliedAsRecruiter);  console.log("[seed] Cleared applied_as_recruiter");
  await db.delete(jobs);                console.log("[seed] Cleared jobs");
  await db.delete(skills);              console.log("[seed] Cleared skills");
  await db.delete(company);             console.log("[seed] Cleared company");
  await db.delete(experienceLevels);    console.log("[seed] Cleared experience_levels");
  await db.delete(jobTypes);            console.log("[seed] Cleared job_types");
  await db.delete(jobLocations);        console.log("[seed] Cleared job_locations");
  await db.delete(resumeSections);      console.log("[seed] Cleared resume_sections");
  await db.delete(resumes);             console.log("[seed] Cleared resumes");
  await db.delete(orders);              console.log("[seed] Cleared orders");
  await db.delete(accounts);            console.log("[seed] Cleared account");
  await db.delete(verificationTokens);  console.log("[seed] Cleared verificationToken");
  await db.delete(users);               console.log("[seed] Cleared user");
  console.log("[seed] Clear complete.");
}

async function seed() {
  // Always clear first as requested
  await clearAll();

  // 1) Demo users
  console.log("[seed] Inserting users...");
  const demoPassword = "demo1234";
  const demo = {
    admin: {
      id: faker.string.uuid(),
      name: "Demo Admin",
      email: "admin@demo.com",
      image: unsplashAvatar("admin"),
      role: "ADMIN" as const,
      password: hashPassword(demoPassword),
      premium: true,
      isBanned: false,
    },
    recruiter: {
      id: faker.string.uuid(),
      name: "Demo Recruiter",
      email: "recruiter@demo.com",
      image: unsplashAvatar("recruiter"),
      role: "RECRUITER" as const,
      password: hashPassword(demoPassword),
      premium: true,
      isBanned: false,
    },
    user: {
      id: faker.string.uuid(),
      name: "Demo User",
      email: "user@demo.com",
      image: unsplashAvatar("user"),
      role: "USER" as const,
      password: hashPassword(demoPassword),
      premium: false,
      isBanned: false,
    },
  };

  await db.insert(users).values([demo.admin, demo.recruiter, demo.user]);
  console.log("[seed] Inserted 3 demo users");

  // More random users
  const extraUsers = Array.from({ length: 25 }).map(() => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    image: unsplashAvatar(faker.string.alphanumeric(8)),
    role: "USER" as const,
    password: hashPassword(faker.internet.password({ length: 10 })),
    premium: faker.datatype.boolean({ probability: 0.2 }),
    isBanned: false,
  }));
  await db.insert(users).values(extraUsers);
  console.log(`[seed] Inserted ${extraUsers.length} additional users`);

  const allUserIds = [demo.admin.id, demo.recruiter.id, demo.user.id, ...extraUsers.map((u) => u.id)];

  // 2) Job metadata
  const expLevels = [
    { label: "Intern", value: "intern", description: "Entry-level internship" },
    { label: "Junior", value: "junior", description: "1-2 years experience" },
    { label: "Mid", value: "mid", description: "3-5 years experience" },
    { label: "Senior", value: "senior", description: "6+ years experience" },
    { label: "Lead", value: "lead", description: "Team leadership" },
  ].map((e) => ({
    id: faker.string.uuid(),
    ...e,
    createdBy: demo.admin.id,
  }));
  await db.insert(experienceLevels).values(expLevels);
  console.log(`[seed] Inserted ${expLevels.length} experience_levels`);

  const jTypes = [
    { label: "Full-time", value: "fulltime", description: "40 hrs/week" },
    { label: "Part-time", value: "parttime", description: "Less than 30 hrs/week" },
    { label: "Contract", value: "contract", description: "Fixed-term" },
    { label: "Internship", value: "internship", description: "Internship" },
    { label: "Freelance", value: "freelance", description: "Independent contractor" },
  ].map((j) => ({ id: faker.string.uuid(), ...j, createdBy: demo.admin.id }));
  await db.insert(jobTypes).values(jTypes);
  console.log(`[seed] Inserted ${jTypes.length} job_types`);

  const jLocations = [
    { label: "Remote", value: "remote", description: "Work from anywhere" },
    { label: "Onsite", value: "onsite", description: "At office" },
    { label: "Hybrid", value: "hybrid", description: "Split remote/office" },
    { label: "EMEA", value: "emea", description: "Europe/Middle East/Africa" },
    { label: "Americas", value: "americas", description: "North & South America" },
  ].map((l) => ({ id: faker.string.uuid(), ...l, createdBy: demo.admin.id }));
  await db.insert(jobLocations).values(jLocations);
  console.log(`[seed] Inserted ${jLocations.length} job_locations`);

  // 3) Skills
  const skillSeeds = [
    "TypeScript","React","Node.js","PostgreSQL","Redis","AWS",
    "Python","Django","Go","Kubernetes","Docker","GraphQL",
    "TailwindCSS","Next.js","Prisma","Drizzle ORM",
  ];
  type SkillRow = { id: string; label: string; value: string; createdBy: string };
  const skillRows: SkillRow[] = skillSeeds.map((label) => ({
    id: faker.string.uuid(),
    label,
    value: label.toLowerCase().replace(/\s+/g, "-"),
    createdBy: demo.admin.id,
  }));
  await db.insert(skills).values(skillRows);
  console.log(`[seed] Inserted ${skillRows.length} skills`);

  // 4) Companies
  const companies = Array.from({ length: 8 }).map(() => {
    const id = faker.string.uuid();
    const followerSample = faker.helpers.arrayElements(allUserIds, {
      min: 2,
      max: 8,
    });
    return {
      id,
      name: faker.company.name(),
      description: faker.company.catchPhrase(),
      website: faker.internet.url(),
      logoUrl: unsplashLogo(id.slice(0, 8)),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      address: faker.location.streetAddress(),
      followers: followerSample,
      createdBy: demo.recruiter.id,
      approved: "APPROVED" as const,
      approvedBy: demo.admin.id,
      approvedDate: new Date(),
    };
  });
  await db.insert(company).values(companies);
  console.log(`[seed] Inserted ${companies.length} companies`);

  // 5) Jobs
  const jobRows = Array.from({ length: 25 }).map(() => {
    const comp = faker.helpers.arrayElement(companies);
    const exp = faker.helpers.arrayElement(expLevels);
    const jt = faker.helpers.arrayElement(jTypes);
    const loc = faker.helpers.arrayElement(jLocations);
    const approved = faker.datatype.boolean({ probability: 0.7 });
    return {
      id: faker.string.uuid(),
      title: faker.person.jobTitle(),
      description: faker.lorem.paragraphs({ min: 1, max: 3 }).slice(0, 1000),
      salary: faker.number.int({ min: 40000, max: 200000 }),
      currencyType: faker.helpers.arrayElement(["USD", "EUR", "GBP", "INR", "NGN"]) as any,
      experienceLevelId: exp.id,
      jobTypeId: jt.id,
      companyId: comp.id,
      jobLocationId: loc.id,
      postedBy: demo.recruiter.id,
      postedDate: new Date(),
      deadline: faker.date.soon({ days: 60 }),
      status: "OPEN" as const,
      approved: approved ? ("APPROVED" as const) : ("PENDING" as const),
      approvedBy: approved ? demo.admin.id : null,
      approvedDate: approved ? new Date() : null,
    };
  });
  await db.insert(jobs).values(jobRows);
  console.log(`[seed] Inserted ${jobRows.length} jobs`);

  // 6) Job skills mapping
  const jobSkillRows = jobRows.flatMap((j) => {
    const chosen: SkillRow[] = faker.helpers.arrayElements(skillRows, {
      min: 2,
      max: 5,
    });
    return chosen.map((s: SkillRow) => ({ jobId: j.id, skillId: s.id }));
  });
  await db.insert(jobSkills).values(jobSkillRows);
  console.log(`[seed] Inserted ${jobSkillRows.length} job_skills links`);

  // 7) Applicants
  const candidateIds = allUserIds.filter((id) => id !== demo.recruiter.id && id !== demo.admin.id);
  const applicantRows = Array.from({ length: 60 }).map(() => ({
    id: faker.string.uuid(),
    userId: faker.helpers.arrayElement(candidateIds),
    status: faker.helpers.arrayElement(["APPLIED", "INTERVIEWED", "OFFERED", "REJECTED"]) as any,
    appliedDate: faker.date.recent({ days: 20 }),
    resumeUrl: faker.internet.url(),
    job_id: faker.helpers.arrayElement(jobRows).id,
  }));
  await db.insert(applicants).values(applicantRows);
  console.log(`[seed] Inserted ${applicantRows.length} applicants`);

  // 8) Recruiter applications (for a few users)
  const rar = faker.helpers.arrayElements(candidateIds, { min: 3, max: 7 }).map((uid: string) => ({
    id: faker.string.uuid(),
    userId: uid,
    appliedDate: new Date(),
    approved: faker.helpers.arrayElement(["APPROVED", "PENDING", "REJECTED"]) as any,
    maximumTimeAllowed: faker.number.int({ min: 1, max: 10 }),
  }));
  if (rar.length) {
    await db.insert(appliedAsRecruiter).values(rar);
  }
  console.log(`[seed] Inserted ${rar.length} applied_as_recruiter`);

  // 9) Resumes via Convex (skipped)

  // 10) Orders (premium)
  const orderRows = faker.helpers.arrayElements(allUserIds, { min: 6, max: 10 }).map((uid: string, idx: number) => ({
    id: faker.string.uuid(),
    userId: uid,
    amount: faker.number.float({ min: 5, max: 99, multipleOf: 0.01 }).toFixed(2) as unknown as any,
    currency: faker.helpers.arrayElement(["USD", "INR", "EUR"]) as any,
    status: faker.helpers.arrayElement(["CREATED", "PAID", "FAILED"]) as any,
    receipt: `rcpt_${faker.string.alphanumeric(8)}`,
    razorpayOrderId: `order_${faker.string.alphanumeric(10)}`,
    razorpayPaymentId: idx % 2 === 0 ? `pay_${faker.string.alphanumeric(10)}` : null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
  if (orderRows.length) await db.insert(orders).values(orderRows);
  console.log(`[seed] Inserted ${orderRows.length} orders`);

  console.log("[seed] Seeding completed.");
  console.log("[seed] Demo: admin@demo.com / recruiter@demo.com / user@demo.com | pwd: demo1234");
}

seed()
  .then(() => {
    console.log("Seed complete.");
  })
  .catch((err) => {
    console.error("Seeding failed:", err);
  });
