import type { ClassValue } from 'clsx'
import { MsgResponse } from '@/lib/messages'
import { clsx } from 'clsx'
import * as dtz from 'date-fns-tz'
import { Duration, Effect } from 'effect'
import { twMerge } from 'tailwind-merge'

const tz = Intl.DateTimeFormat().resolvedOptions().timeZone

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimestamp(timestampInMillis: number, type: 'date' | 'time') {
  switch (type) {
    case 'date':
      return dtz.formatInTimeZone(timestampInMillis, tz, 'MMM dd, yyyy')
    case 'time':
      return dtz.formatInTimeZone(timestampInMillis, tz, 'h:mm a')
  }
}

export function formatDuration(durationInSeconds: number, unit: 'hrs' | 'mins' | 'secs') {
  let dur: Duration.Duration

  switch (unit) {
    case 'hrs':
      dur = Duration.hours(durationInSeconds)
      break
    case 'mins':
      dur = Duration.minutes(durationInSeconds)
      break
    case 'secs':
      dur = Duration.seconds(durationInSeconds)
      break
  }

  return Duration.format(dur)
}

export async function gen<T, E extends { message?: string, cause?: unknown }>(program: Effect.Effect<T, E>) {
  return program
    .pipe(Effect.catchAll(e => Effect.succeed(new MsgResponse(false, `${e.message || 'Unknown error'}: ${String(e.cause || 'Unknown cause')}`))))
    .pipe(Effect.runPromise)
}

export function calcEarnings(durationInSeconds: number, rate: number) {
  const hrs = durationInSeconds / 3600
  return Number((hrs * rate).toFixed(2))
}
