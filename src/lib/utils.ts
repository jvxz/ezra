import type { ClassValue } from 'clsx'
import { MsgResponse } from '@/lib/messages'
import { clsx } from 'clsx'
import * as d from 'date-fns-tz'
import { Effect } from 'effect'
import { twMerge } from 'tailwind-merge'

const tz = Intl.DateTimeFormat().resolvedOptions().timeZone

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimestamp(timestampInMillis: number, type: 'date' | 'time') {
  switch (type) {
    case 'date':
      return d.formatInTimeZone(timestampInMillis, tz, 'MMM dd, yyyy')
    case 'time':
      return d.formatInTimeZone(timestampInMillis, tz, 'h:mm a')
  }
}

export async function gen<T, E extends { message?: string, cause?: unknown }>(program: Effect.Effect<T, E>) {
  return program
    .pipe(Effect.catchAll(e => Effect.succeed(new MsgResponse(false, `${e.message || 'Unknown error'}: ${String(e.cause || 'Unknown cause')}`))))
    .pipe(Effect.runPromise)
}
