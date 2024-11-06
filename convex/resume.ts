import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

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
      theme: "default",
      isPublished: false,
    });

    return resumeId;
  },
});

export const getResume = query({
  args: {
    id: v.id("resumes"),
    collaboratorId: v.string(),
  },
  handler: async (ctx, args) => {
    const { db } = ctx;

    const resume = await db.get(args.id);

    if (
      resume.isPublished ||
      resume.collaboratorIds.includes(args.collaboratorId)
    ) {
      return resume;
    } else {
      return null;
    }
  },
});

export const getAllResumes = query({
  args: {
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { db } = ctx;

    const allResumes = await db.query("resumes").collect();

    return allResumes.filter((resume) =>
      resume.collaboratorIds.includes(args.userId)
    );
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
    _creationTime: v.optional(v.number()),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
    theme: v.optional(v.string()),
    collaboratorIds: v.optional(v.array(v.string())),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    try {
      const { db } = ctx;

      const resume = await db.get(args._id);

      await db.patch(args._id, {
        title: args.title || resume.title,
        basicDetails: args.basicDetails || resume.basicDetails,
        createdAt: args.createdAt || resume.createdAt,
        updatedAt: args.updatedAt || Date.now(),
        theme: args.theme || resume.theme,
        collaboratorIds: args.collaboratorIds || resume.collaboratorIds,
        isPublished: args.isPublished || false,
      });

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
});
