import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export const sessionSchema = {
  id: v.string(),
  description: v.string(),
  start: v.number(),
  end: v.union(v.number(), v.literal('Active')),
}

export const taskSchema = {
  sessionId: v.id('sessions'),
  id: v.string(),
  description: v.string(),
  aet: v.number(),
  start: v.number(),
  duration: v.number(),
  efficiency: v.number(),
  earnings: v.number(),
}

export default defineSchema({
  sessions: defineTable(sessionSchema),
  tasks: defineTable(taskSchema),
})
