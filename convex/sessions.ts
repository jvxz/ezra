import { mutation, query } from '@/convex/_generated/server'
import { v } from 'convex/values'
import schema from './schema'
import { calcEfficiency } from '@/lib/utils'

export const collect = query({
  args: {
  },
  handler: async (ctx) => {
    return ctx.db.query('sessions').collect()
  },
})

export const create = mutation({
  args: {
    ...schema.tables.sessions.validator.fields
  },
  handler: async (ctx, session) => {
    return ctx.db.insert('sessions', session)
  },
})

export const remove = mutation({
  args: {
    id: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    return ctx.db.delete(args.id)
  },
})

export const collectWithTasks = query({
  args: {},
  handler: async (ctx) => {
    const sessions = await ctx.db.query('sessions').collect()
    const tasks = await ctx.db.query('tasks').collect()

    const duration = tasks.reduce((acc, task) => acc + task.duration, 0)
    const aet = tasks.reduce((acc, task) => acc + task.aet, 0)
    const efficiency = calcEfficiency(duration, aet)
    const earnings = tasks.reduce((acc, task) => acc + task.earnings, 0)

    return sessions.map(session => ({
      ...session,
      tasks: tasks.filter(task => task.sessionId === session._id),
      duration,
      earnings,
      efficiency,
      aet
    }))
  },
})

// pick a session with task data
export const pickWithTasks = query({
  args: {
    id: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    return ctx.db.query('tasks').filter(q => q.eq(q.field('sessionId'), args.id)).collect()
  },
})

export const pickCurrentSession = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query('sessions').filter(q => q.eq(q.field('end'), 'Active')).first()
  },
})

export const pickCurrentSessionWithTasks = query({
  args: {},
  handler: async (ctx) => {
    const session = await ctx.db.query('sessions').filter(q => q.eq(q.field('end'), 'Active')).first()
    const tasks = await ctx.db.query('tasks').filter(q => q.eq(q.field('sessionId'), session?._id)).collect()

    return {
      session,
      tasks
    }
  },
})

export const endCurrentSession = mutation({
  args: {},
  handler: async (ctx) => {
    const session = await ctx.db.query('sessions').filter(q => q.eq(q.field('end'), 'Active')).first()

    if (!session) {
      throw new Error('No active session found')
    }

    return ctx.db.patch(session._id, {
      end: Date.now(),
    })
  },
})
