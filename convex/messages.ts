import { v } from 'convex/values'
import { mutation } from './_generated/server'
import { getCurrentUserOrThrow } from './users'

export const addThreadMessage = mutation({
  args: {
    threadId: v.optional(v.id('messages')),
    mediaFiles: v.optional(v.array(v.string())),
    websiteUrl: v.optional(v.string()),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx)
    return await ctx.db.insert('messages', {
      ...args,
      userId: user._id,
      likeCount: 0,
      commentCount: 0,
      retweetCount: 0,
    })
  },
})
export const generateUploadUrl = mutation(async ctx => {
  await getCurrentUserOrThrow(ctx)

  return await ctx.storage.generateUploadUrl()
})
