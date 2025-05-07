/* eslint-disable ts/no-unsafe-argument */
/* eslint-disable ts/no-unsafe-assignment */
/* eslint-disable ts/no-unsafe-member-access */
import type { PluginOption } from 'vite'
import { defineConfig } from 'wxt'

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    permissions: [
      'storage',
      'tabs',
      'activeTab',
      'scripting',
      'webRequest',
      'alarms',
      'identity',
      'notifications',
    ],
    host_permissions: ['*://*.raterhub.com/*'],
  },
  react: {
    vite: {
      babel: {
        plugins: [['babel-plugin-react-compiler', {
        }]],
      },
    },
  },
  vite: () => ({
    plugins: [toUtf8()],
  }),
})

function strToUtf8(str: string) {
  return str
    .split('')
    .map(ch =>
      ch.charCodeAt(0) <= 0x7F
        ? ch
        : `\\u${(`0000${ch.charCodeAt(0).toString(16)}`).slice(-4)}`)
    .join('')
}

function toUtf8(): PluginOption {
  return {
    name: 'to-utf8',
    generateBundle(options: any, bundle: any) {
      // Iterate through each asset in the bundle
      for (const fileName in bundle) {
        if (bundle[fileName].type === 'chunk') {
          // Assuming you want to convert the chunk's code
          const originalCode = bundle[fileName].code
          const modifiedCode = strToUtf8(originalCode)

          // Update the chunk's code with the modified version
          bundle[fileName].code = modifiedCode
        }
      }
    },
  }
}
