import { v } from 'convex/values'
import { mutation, query, QueryCtx } from './_generated/server'
import { getCurrentUserOrThrow } from './users'
import { paginationOptsValidator } from 'convex/server'
import { Id } from './_generated/dataModel'

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

export const getThreads = query({
  args: {
    paginationOpts: paginationOptsValidator,
    userId: v.optional(v.id('users')),
  },
  handler: async (ctx, args) => {
    let threads
    if (args.userId) {
      threads = await ctx.db
        .query('messages')
        .filter(q => q.eq(q.field('userId'), args.userId))
        .order('desc')
        .paginate(args.paginationOpts)
    } else {
      threads = await ctx.db
        .query('messages')
        .filter(q => q.eq(q.field('threadId'), undefined))
        .order('desc')
        .paginate(args.paginationOpts)
    }

    const threadsWithMedia = await Promise.all(
      threads.page.map(async thread => {
        const creator = await getMessageCreator(ctx, thread.userId)

        return {
          ...thread,
          creator,
        }
      }),
    )

    return {
      ...threads,
      page: threadsWithMedia,
    }
  },
})

const getMessageCreator = async (ctx: QueryCtx, userId: Id<'users'>) => {
  const user = await ctx.db.get(userId)
  if (!user?.imageUrl || user.imageUrl.startsWith('http')) {
    return user
  }

  const url = await ctx.storage.getUrl(user.imageUrl as Id<'_storage'>)

  return {
    ...user,
    imageUrl: url,
  }
}
