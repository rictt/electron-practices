import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import vueJSX from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/preload/index.ts'),
          capture: resolve(__dirname, 'src/preload/index.ts'),
        }
      }
    },
  },
  renderer: {
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/renderer/index.html'),
          capture: resolve(__dirname, 'src/renderer/capture.html'),
        },
        output: {
          dir: "./out/renderer",
        }
      }
    },
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src/'),
        '@ipc': resolve('src/ipc')
      }
    },
    plugins: [
      vue(),
      vueJSX(),
      createSvgIconsPlugin({
        iconDirs: [resolve(process.cwd(), 'src/renderer/src/assets/svg')],
        symbolId: 'icon-[dir]-[name]'
      }),
    ]
  }
})