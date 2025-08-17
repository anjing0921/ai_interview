import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateNewRoom = mutation({
    args: {
        coachingOption: v.string(),
        topic: v.string(),
        expertName: v.string(),
        uid: v.id('users')
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.insert('DiscussionRoom', {
            coachingOption: args.coachingOption,
            topic: args.topic,
            expertName: args.expertName,
            uid: args.uid
        });

        return result;
    }
})