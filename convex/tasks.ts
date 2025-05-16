import { mutation, query } from '@/convex/_generated/server'
import { v } from 'convex/values'
import schema from './schema'


export const get = query({
  args: {
  },
  handler: async (ctx) => {
    return ctx.db.query('tasks').collect()
  },
})

export const create = mutation({
  args: {
    ...schema.tables.tasks.validator.fields,
  },
  handler: async (ctx, args) => {
    return ctx.db.insert('tasks', args)
  },
})

export const remove = mutation({
  args: {
    id: v.id('tasks'),
  },
  handler: async (ctx, args) => {
    return ctx.db.delete(args.id)
  },
})

export const pickCurrentSessionTasks = query({
  args: {
    id: v.id('sessions'),
  },
  handler: async (ctx, args) => {
    return ctx.db.query('tasks').filter(q => q.eq(q.field('sessionId'), args.id)).collect()
  },
})

export const pickCurrentTask = query({
  args: {},
  handler: async (ctx) => {
    const currentSession = await ctx.db.query('sessions').filter(q => q.eq(q.field('end'), 'Active')).first()
    return ctx.db.query('tasks').filter(q => q.eq(q.field('sessionId'), currentSession?._id)).first()
  },
})
