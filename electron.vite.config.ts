import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import vueJSX from '@vitejs/plugin-vue-jsx'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

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
          capture: resolve(__dirname, 'src/preload/index.ts')
        }
      }
    }
  },
  renderer: {
    css: {
      postcss: {
        plugins: [tailwindcss, autoprefixer]
      }
    },
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/renderer/index.html'),
          capture: resolve(__dirname, 'src/renderer/capture.html')
        },
        output: {
          dir: './out/renderer'
        }
      }
    },
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src/'),
        '@': resolve('src/renderer/src/')
      }
    },
    plugins: [
      vue(),
      vueJSX(),
      createSvgIconsPlugin({
        iconDirs: [resolve(process.cwd(), 'src/renderer/src/assets/svg')],
        symbolId: 'icon-[dir]-[name]'
      })
    ]
  }
})
