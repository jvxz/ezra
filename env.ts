import { createEnv } from '@t3-oss/env-core'
import { type } from 'arktype'

export const env = createEnv({
  clientPrefix: 'VITE_',

  client: {
    VITE_CONVEX_URL: type('string.url'),
  },

  isServer: false,

  runtimeEnv: import.meta.env,

  onInvalidAccess: (variable) => {
    throw new Error(`Invalid access to ${variable}`)
  },

  emptyStringAsUndefined: true,
})
