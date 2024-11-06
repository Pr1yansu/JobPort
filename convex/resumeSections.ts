// convex/functions/sections.js
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const addSection = mutation({
  args: {
    resumeId: v.id("resumes"),
    type: v.string(),
    content: v.object({
      title: v.string(),
      items: v.array(v.any()),
    }),
    order: v.number(),
    isVisible: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { db } = ctx;

    const sectionId = await db.insert("sections", {
      resumeId: args.resumeId,
      type: args.type,
      content: args.content,
      order: args.order,
      isVisible: args.isVisible,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    await db.patch(args.resumeId, {
      sections: {
        $push: sectionId,
      },
      updatedAt: Date.now(),
    });

    return sectionId;
  },
});
