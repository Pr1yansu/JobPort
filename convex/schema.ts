import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  resumes: defineTable({
    isPublished: v.optional(v.boolean()),
    createdBy: v.string(),
    collaboratorIds: v.optional(v.array(v.string())),
    title: v.string(),
    basicDetails: v.object({
      fullName: v.string(),
      contactEmail: v.string(),
      phone: v.string(),
      address: v.string(),
    }),
    sections: v.array(v.id("sections")),
    createdAt: v.number(),
    updatedAt: v.number(),

    theme: v.object({
      templateName: v.string(),
      fontFamily: v.optional(v.string()),
      textTransform: v.optional(v.string()),
      lineHeight: v.optional(v.number()),
      fontSizes: v.optional(
        v.object({
          h1: v.optional(v.number()),
          h2: v.optional(v.number()),
          h3: v.optional(v.number()),
          h4: v.optional(v.number()),
          h5: v.optional(v.number()),
          h6: v.optional(v.number()),
          p: v.optional(v.number()),
          a: v.optional(v.number()),
          li: v.optional(v.number()),
        })
      ),
      primaryColor: v.optional(v.string()),
      secondaryColor: v.optional(v.string()),
      margin: v.optional(v.number()),
    }),

    metadata: v.object({
      version: v.optional(v.string()),
      layout: v.optional(v.string()),
    }),
  }),

  sections: defineTable({
    resumeId: v.id("resumes"),
    type: v.string(),
    content: v.object({
      title: v.string(),
      items: v.array(v.any()),
    }),
    order: v.number(),
    isVisible: v.optional(v.boolean()),
    createdAt: v.number(),
    updatedAt: v.number(),

    sectionStyles: v.optional(
      v.object({
        backgroundColor: v.optional(v.string()),
        textColor: v.optional(v.string()),
        fontWeight: v.optional(v.string()),
      })
    ),
  }),
});
