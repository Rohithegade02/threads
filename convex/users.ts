import { v } from 'convex/values'
import { internalMutation, mutation, query } from './_generated/server'
export const getAllUsers = query({
  args: {},
  handler: async ctx => {
    return await ctx.db.query('users').collect()
  },
})

export const createUser = internalMutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    first_name: v.optional(v.string()),
    last_name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    username: v.union(v.string(), v.null()),
    bio: v.optional(v.string()),
    websiteUrl: v.optional(v.string()),
    followersCount: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.db.insert('users', {
      ...args,
      username: args.username || `${args.first_name}${args.last_name}`,
    })
    return userId
  },
})
