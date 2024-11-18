import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new resume
export const createResume = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const { db } = ctx;

    const resumeId = await db.insert("resumes", {
      title: args.title,
      createdBy: args.createdBy,
      collaboratorIds: args.collaboratorIds || [],
      basicDetails: args.basicDetails,
      sections: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),

      // Default theme configuration for new resumes
      theme: {
        textTransform: "none",
        lineHeight: 1.5,
        templateName: "default",
        fontFamily: "Arial",
        fontSizes: {
          h1: 24,
          h2: 20,
          h3: 18,
          h4: 16,
          h5: 14,
          h6: 12,
          p: 12,
          a: 12,
          li: 12,
        },
        primaryColor: "#000000",
        secondaryColor: "#666666",
        margin: 10,
      },
      metadata: {
        version: "1.0",
        layout: "single-column",
      },
      isPublished: args.isPublished || false,
    });

    return resumeId;
  },
});

// Fetch a specific resume
export const getResume = query({
  args: {
    id: v.id("resumes"),
    collaboratorId: v.string(),
  },
  handler: async (ctx, args) => {
    const { db } = ctx;

    const resume = await db.get(args.id);

    if (!resume) {
      return null;
    }

    if (
      resume.isPublished ||
      resume.collaboratorIds?.includes(args.collaboratorId)
    ) {
      return resume;
    } else {
      return null;
    }
  },
});

// Fetch all resumes created by a specific user
export const getAllResumes = query({
  args: {
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { db } = ctx;

    const allResumes = await db.query("resumes").collect();

    const filteredResumes = allResumes.filter((resume) => {
      return resume.createdBy === args.userId;
    });

    return filteredResumes;
  },
});

export const updateResume = mutation({
  args: {
    _id: v.id("resumes"),
    title: v.optional(v.string()),
    createdBy: v.optional(v.string()),
    basicDetails: v.optional(
      v.object({
        fullName: v.string(),
        contactEmail: v.string(),
        phone: v.string(),
        address: v.string(),
      })
    ),
    theme: v.optional(
      v.object({
        templateName: v.optional(v.string()),
        fontFamily: v.optional(v.string()),
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
        textTransform: v.optional(v.string()),
        lineHeight: v.optional(v.number()),
        primaryColor: v.optional(v.string()),
        secondaryColor: v.optional(v.string()),
        margin: v.optional(v.number()),
      })
    ),
    metadata: v.optional(
      v.object({
        version: v.optional(v.string()),
        layout: v.optional(v.string()),
      })
    ),
    collaboratorIds: v.optional(v.array(v.string())),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    try {
      const { db } = ctx;

      const resume = await db.get(args._id);

      if (!resume) {
        return false;
      }

      await db.patch(args._id, {
        title: args.title || resume.title,
        basicDetails: args.basicDetails || resume.basicDetails,
        theme: {
          templateName: args.theme?.templateName || resume.theme.templateName,
          fontFamily: args.theme?.fontFamily || resume.theme.fontFamily,
          fontSizes: args.theme?.fontSizes || resume.theme.fontSizes,
          primaryColor: args.theme?.primaryColor || resume.theme.primaryColor,
          secondaryColor:
            args.theme?.secondaryColor || resume.theme.secondaryColor,
          margin: args.theme?.margin || resume.theme.margin,
        },
        metadata: args.metadata || resume.metadata,
        collaboratorIds: args.collaboratorIds || resume.collaboratorIds,
        isPublished:
          args.isPublished !== undefined
            ? args.isPublished
            : resume.isPublished,
        updatedAt: Date.now(),
      });

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
});
