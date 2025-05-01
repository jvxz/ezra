import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import * as d from 'date-fns-tz'
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
