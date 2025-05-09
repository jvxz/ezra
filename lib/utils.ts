import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import * as dtz from 'date-fns-tz'
import { Duration } from 'effect'
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

  const res = Duration.format(dur)

  return res === '0' ? '0s' : res
}

export function calcEarnings(durationInSeconds: number, rate: number) {
  const hrs = durationInSeconds / 3600
  return Number((hrs * rate).toFixed(2))
}

export function calcEfficiency(durationInSecs: number, aetInMins: number): number {
  const aetInSecs = aetInMins * 60
  const res = Number(((aetInSecs / durationInSecs) * 100).toFixed(2))
  return res === Infinity ? 0 : res
}

export function getTaskProgress(durationInSeconds: number, aetInMinutes: number) {
  const durationInMinutes = durationInSeconds / 60
  return (durationInMinutes / aetInMinutes) * 100 > 100 ? 100 : (durationInMinutes / aetInMinutes) * 100
}
