import { v } from 'convex/values'
import {
  internalMutation,
  mutation,
  query,
  QueryCtx,
} from './_generated/server'
import { Id } from './_generated/dataModel'
import { paginationOptsValidator } from 'convex/server'
import { getMediaUrls, getMessageCreator } from './messages'

export const getUserByClerkId = query({
  args: {
    clerkId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .filter(q => q.eq(q.field('clerkId'), args.clerkId))
      .unique()

    if (!user?.imageUrl || user.imageUrl.startsWith('http')) {
      return user
    }

    const url = await ctx.storage.getUrl(user.imageUrl as Id<'_storage'>)

    return {
      ...user,
      imageUrl: url,
    }
  },
})

export const getUserById = query({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId)
    if (!user?.imageUrl || user.imageUrl.startsWith('http')) {
      return user
    }

    const url = await ctx.storage.getUrl(user.imageUrl as Id<'_storage'>)

    return {
      ...user,
      imageUrl: url,
    }
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

export const updateUser = mutation({
  args: {
    _id: v.id('users'),
    bio: v.optional(v.string()),
    websiteUrl: v.optional(v.string()),
    profilePicture: v.optional(v.string()),
    pushToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await getCurrentUserOrThrow(ctx)

    const { _id, ...rest } = args
    return await ctx.db.patch(_id, rest)
  },
})

export const generateUploadUrl = mutation(async ctx => {
  await getCurrentUserOrThrow(ctx)

  return await ctx.storage.generateUploadUrl()
})

export const updateImage = mutation({
  args: { storageId: v.id('_storage'), _id: v.id('users') },
  handler: async (ctx, args) => {
    await ctx.db.patch(args._id, {
      imageUrl: args.storageId,
    })
  },
})

export const searchUsers = query({
  args: {
    search: v.string(),
  },
  handler: async (ctx, args) => {
    const users = await ctx.db
      .query('users')
      .withSearchIndex('searchUsers', q => q.search('username', args.search))
      .collect()

    const usersWithImage = await Promise.all(
      users.map(async user => {
        if (!user?.imageUrl || user.imageUrl.startsWith('http')) {
          user.imageUrl
          return user
        }

        const url = await ctx.storage.getUrl(user.imageUrl as Id<'_storage'>)
        user.imageUrl = url!
        return user
      }),
    )

    return usersWithImage
  },
})

// IDENTITY CHECK
// https://docs.convex.dev/auth/database-auth#mutations-for-upserting-and-deleting-users

export const current = query({
  args: {},
  handler: async ctx => {
    return await getCurrentUser(ctx)
  },
})

export const deleteFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  async handler(ctx, { clerkUserId }) {
    const user = await userByExternalId(ctx, clerkUserId)

    if (user !== null) {
      await ctx.db.delete(user._id)
    } else {
      console.warn(
        `Can't delete user, there is none for Clerk user ID: ${clerkUserId}`,
      )
    }
  },
})

export async function getCurrentUserOrThrow(ctx: QueryCtx) {
  const userRecord = await getCurrentUser(ctx)
  if (!userRecord) throw new Error("Can't get current user")
  return userRecord
}

export async function getCurrentUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity()
  if (identity === null) {
    return null
  }
  return await userByExternalId(ctx, identity.subject)
}

async function userByExternalId(ctx: QueryCtx, externalId: string) {
  return await ctx.db
    .query('users')
    .withIndex('byClerkId', q => q.eq('clerkId', externalId))
    .unique()
}

export const followUser = mutation({
  args: {
    followerId: v.id('users'), // ID of the user initiating the follow
    followingId: v.id('users'), // ID of the user to follow
  },
  handler: async (ctx, { followerId, followingId }) => {
    // Prevent users from following themselves
    if (followerId === followingId) {
      throw new Error("Users can't follow themselves")
    }

    // Check if the follow relationship already exists using the new index
    const existingFollow = await ctx.db
      .query('follows')
      .withIndex('byFollowerAndFollowing', q =>
        q.eq('followerId', followerId).eq('followingId', followingId),
      )
      .unique()

    if (existingFollow) {
      throw new Error('Follow relationship already exists')
    }

    // Create a new follow relationship
    await ctx.db.insert('follows', { followerId, followingId })

    // Increment the followersCount of the followed user
    const followedUser = await ctx.db.get(followingId)
    if (!followedUser) {
      throw new Error('User not found')
    }
    await ctx.db.patch(followingId, {
      followersCount: followedUser.followersCount + 1,
    })
  },
})

export const unfollowUser = mutation({
  args: {
    followerId: v.id('users'),
    followingId: v.id('users'),
  },
  handler: async (ctx, { followerId, followingId }) => {
    // Find the follow relationship using the new index
    const follow = await ctx.db
      .query('follows')
      .withIndex('byFollowerAndFollowing', q =>
        q.eq('followerId', followerId).eq('followingId', followingId),
      )
      .unique()

    if (!follow) {
      throw new Error('Follow relationship does not exist')
    }

    // Delete the follow relationship
    await ctx.db.delete(follow._id)

    const unfollowedUser = await ctx.db.get(followingId)
    if (!unfollowedUser) {
      throw new Error('User not found')
    }
    await ctx.db.patch(followingId, {
      followersCount: Math.max(unfollowedUser.followersCount - 1, 0),
    })
  },
})

export const getFollowingThreads = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    // Get the current user
    const currentUser = await getCurrentUserOrThrow(ctx)

    // Fetch the IDs of users the current user is following
    const following = await ctx.db
      .query('follows')
      .withIndex('byFollower', q => q.eq('followerId', currentUser._id))
      .collect()

    const followingIds = following.map(f => f.followingId)

    if (followingIds.length === 0) {
      return {
        page: [],
        isDone: true,
      }
    }

    // Query messages from followed users using `or` for multiple conditions
    const threadsQuery = ctx.db.query('messages').filter(q => {
      let query = q.eq(q.field('threadId'), undefined) // Only parent threads
      if (followingIds.length === 1) {
        query = q.and(query, q.eq(q.field('userId'), followingIds[0]))
      } else {
        const conditions = followingIds.map(id => q.eq(q.field('userId'), id))
        query = q.and(query, q.or(...conditions))
      }
      return query
    })

    const threads = await threadsQuery
      .order('desc')
      .paginate(args.paginationOpts)

    // Fetch additional data for the threads
    const threadsWithDetails = await Promise.all(
      threads.page.map(async thread => {
        const creator = await getMessageCreator(ctx, thread.userId)
        const mediaUrls = await getMediaUrls(ctx, thread.mediaFiles)

        return {
          ...thread,
          creator,
          mediaFiles: mediaUrls,
        }
      }),
    )

    return {
      ...threads,
      page: threadsWithDetails,
    }
  },
})

export const getFollowStatus = query({
  args: {
    followerId: v.id('users'),
    followingId: v.id('users'),
  },
  handler: async (ctx, { followerId, followingId }) => {
    const follow = await ctx.db
      .query('follows')
      .withIndex('byFollowerAndFollowing', q =>
        q.eq('followerId', followerId).eq('followingId', followingId),
      )
      .unique()

    return {
      isFollowing: !!follow,
    }
  },
})

export const getAllUnfollowedUser = query({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, { userId }) => {
    // Fetch all followed users
    const followedUsers = await ctx.db
      .query('follows')
      .withIndex('byFollower', q => q.eq('followerId', userId))
      .collect()

    const followedUserIds = followedUsers.map(f => f.followingId)

    // Fetch all users excluding the current user
    const allUsers = await ctx.db
      .query('users')
      .filter(q => q.neq(q.field('_id'), userId))
      .collect()

    // Filter out followed users
    const unfollowedUsers = allUsers.filter(
      user => !followedUserIds.includes(user._id),
    )

    // Add image URLs if needed
    const usersWithImageUrls = await Promise.all(
      unfollowedUsers.map(async user => {
        if (!user.imageUrl || user.imageUrl.startsWith('http')) {
          return user
        }
        const imageUrl = await ctx.storage.getUrl(
          user.imageUrl as Id<'_storage'>,
        )
        return {
          ...user,
          imageUrl,
        }
      }),
    )

    return usersWithImageUrls
  },
})
