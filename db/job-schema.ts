import {
  timestamp,
  pgTable,
  text,
  integer,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users-schema";

// Experience Levels Table
export const experienceLevels = pgTable("experience_levels", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  label: text("label").notNull(),
  value: text("value").notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
  createdBy: text("createdBy")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
});
export const experienceLevelRelations = relations(
  experienceLevels,
  ({ many }) => ({
    jobs: many(jobs),
  })
);

// Job Types Table
export const jobTypes = pgTable("job_types", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  label: text("label").notNull(),
  value: text("value").notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
  createdBy: text("createdBy")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
});
export const jobTypeRelations = relations(jobTypes, ({ many }) => ({
  jobs: many(jobs),
}));

// Job Locations Table
export const jobLocations = pgTable("job_locations", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  label: text("label").notNull(),
  value: text("value").notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
  createdBy: text("createdBy")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
});
export const jobLocationRelations = relations(jobLocations, ({ many }) => ({
  jobs: many(jobs),
}));

// Company Table
export const company = pgTable("company", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  description: text("description"),
  website: text("website"),
  logoUrl: text("logoUrl"),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  followers: text("followers").array().default([]),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
  createdBy: text("createdBy")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  approved: text({ enum: ["APPROVED", "REJECTED", "PENDING"] }).$default(
    () => "PENDING"
  ),
  approvedBy: text("approvedBy").references(() => users.id, {
    onDelete: "set null",
  }),
  approvedDate: timestamp("approvedDate", { mode: "date" }),
});
export const companyRelations = relations(company, ({ many }) => ({
  jobs: many(jobs),
}));

// Skills Table
export const skills = pgTable("skills", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  label: text("label").notNull(),
  value: text("value").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
  createdBy: text("createdBy")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
});

export const jobSkills = pgTable(
  "job_skills",
  {
    jobId: text("jobId")
      .references(() => jobs.id, { onDelete: "cascade" })
      .notNull(),
    skillId: text("skillId")
      .references(() => skills.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => ({
    pk: primaryKey(table.jobId, table.skillId),
  })
);

export const jobSkillRelations = relations(jobSkills, ({ one }) => ({
  job: one(jobs, { fields: [jobSkills.jobId], references: [jobs.id] }),
  skill: one(skills, { fields: [jobSkills.skillId], references: [skills.id] }),
}));

export const skillRelations = relations(skills, ({ many }) => ({
  jobs: many(jobSkills),
}));

// Jobs Table
export const jobs = pgTable("jobs", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description").notNull(),
  salary: integer("salary").notNull(),
  applicants: text("applicants").array().default([]),
  currencyType: text({ enum: ["USD", "EUR", "GBP", "NGN", "INR"] }).$default(
    () => "USD"
  ),
  experienceLevelId: text("experienceLevelId")
    .references(() => experienceLevels.id, { onDelete: "cascade" })
    .notNull(),
  jobTypeId: text("jobTypeId")
    .references(() => jobTypes.id, { onDelete: "cascade" })
    .notNull(),
  companyId: text("companyId")
    .references(() => company.id, { onDelete: "cascade" })
    .notNull(),
  jobLocationId: text("jobLocationId")
    .references(() => jobLocations.id, { onDelete: "cascade" })
    .notNull(),
  postedBy: text("postedBy")
    .references(() => users.id, { onDelete: "set null" })
    .notNull(),
  postedDate: timestamp("postedDate", { mode: "date" }).defaultNow().notNull(),
  deadline: timestamp("deadline", { mode: "date" }).notNull(),
  status: text({ enum: ["OPEN", "CLOSED"] }).$default(() => "OPEN"),
  approved: text({ enum: ["APPROVED", "REJECTED", "PENDING"] }).$default(
    () => "PENDING"
  ),
  approvedBy: text("approvedBy").references(() => users.id, {
    onDelete: "set null",
  }),
  approvedDate: timestamp("approvedDate", { mode: "date" }),
});

export const jobRelations = relations(jobs, ({ one, many }) => ({
  experienceLevel: one(experienceLevels, {
    fields: [jobs.experienceLevelId],
    references: [experienceLevels.id],
  }),
  jobType: one(jobTypes, {
    fields: [jobs.jobTypeId],
    references: [jobTypes.id],
  }),
  company: one(company, { fields: [jobs.companyId], references: [company.id] }),
  jobLocation: one(jobLocations, {
    fields: [jobs.jobLocationId],
    references: [jobLocations.id],
  }),
  postedByUser: one(users, { fields: [jobs.postedBy], references: [users.id] }),
  jobSkills: many(jobSkills),
}));

// Applied as Recruiter Table
export const appliedAsRecruiter = pgTable("applied_as_recruiter", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  appliedDate: timestamp("date", { mode: "date" }).defaultNow().notNull(),
  approved: text({ enum: ["APPROVED", "REJECTED", "PENDING"] }).$default(
    () => "PENDING"
  ),
  maximumTimeAllowed: integer("maximumTimeAllowed").default(5).notNull(),
});
export const appliedAsRecruiterRelations = relations(
  appliedAsRecruiter,
  ({ one }) => ({
    user: one(users, {
      fields: [appliedAsRecruiter.userId],
      references: [users.id],
    }),
  })
);
