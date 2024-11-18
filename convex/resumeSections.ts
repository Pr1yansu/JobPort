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

    // Filter items: Remove empty objects and objects with empty string values
    args.content.items = args.content.items.filter((item) => {
      // Check if item is an object and not empty
      if (
        typeof item === "object" &&
        item !== null &&
        Object.keys(item).length > 0
      ) {
        // Ensure no properties have empty string values
        return Object.values(item).some((value) =>
          typeof value === "string" ? value.trim() !== "" : true
        );
      }
      return false; // Exclude empty objects or invalid types
    });

    // Update the section in the database
    await db.patch(args._id, {
      ...args, // Spread args to map fields directly
      content: args.content, // Include filtered content
      updatedAt: Date.now(), // Add updatedAt field
    });

    return args._id;
  },
});
