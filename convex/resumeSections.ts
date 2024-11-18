import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const addSection = mutation({
  args: {
    resumeId: v.id("resumes"),
    type: v.string(),
    content: v.object({
      title: v.string(),
      items: v.array(v.any()),
    }),
  },
  handler: async (ctx, args) => {
    const { db } = ctx;

    const sectionId = await db.insert("sections", {
      resumeId: args.resumeId,
      type: args.type,
      content: args.content,
      order: 0,
      isVisible: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      sectionStyles: {
        backgroundColor: "#ffffff",
        textColor: "#000000",
        fontWeight: "normal",
      },
    });

    const resume = await db.get(args.resumeId);
    if (resume) {
      await db.patch(args.resumeId, {
        sections: [...resume.sections, sectionId],
        updatedAt: Date.now(),
      });
    }

    return sectionId;
  },
});

export const getSections = query({
  args: {
    resumeId: v.optional(v.id("resumes")),
  },
  handler: async (ctx, args) => {
    const { db } = ctx;

    if (!args.resumeId) {
      return null;
    }

    const sections = await db
      .query("sections")
      .filter((q) => q.eq(q.field("resumeId"), args.resumeId))
      .collect();

    return sections;
  },
});

export const updateSection = mutation({
  args: {
    _id: v.id("sections"),
    type: v.string(),
    content: v.object({
      title: v.string(),
      items: v.array(v.any()),
    }),
    isVisible: v.boolean(),
    sectionStyles: v.object({
      backgroundColor: v.string(),
      textColor: v.string(),
      fontWeight: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const { db } = ctx;

    await db.patch(args._id, {
      type: args.type,
      content: args.content,
      isVisible: args.isVisible,
      sectionStyles: args.sectionStyles,
      updatedAt: Date.now(),
    });

    return args._id;
  },
});
