import { integer, json, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "@/db/users-schema";

export const resumes = pgTable("resumes", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .references(() => users.id)
    .notNull(),
  title: text("title").notNull(),
  sections: json("sections").notNull(),
  styling: json("styling").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const resumeSections = pgTable("resume_sections", {
  id: text("id").primaryKey(),
  resumeId: text("resumeId")
    .references(() => resumes.id)
    .notNull(),
  type: text("type").notNull(),
  content: json("content").notNull(),
  order: integer("order").notNull(),
});
