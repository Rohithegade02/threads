import { query } from './_generated/server'
export const getAllUsers = query({
  args: {},
  handler: async ctx => {
    return await ctx.db.query('users').collect()
  },
})
