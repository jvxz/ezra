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
  },
  react: {
    vite: {
      babel: {
        plugins: [['babel-plugin-react-compiler', {
        }]],
      },
    },
  },
  // vite: () => {
  //   return {
  //     plugins: [
  //       react({
  //         babel: {
  //           plugins: ['babel-plugin-react-compiler'],
  //         },
  //       }),
  //     ],
  //   }
  // },
})
