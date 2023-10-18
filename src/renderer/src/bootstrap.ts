import { Component, createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import SvgIcon from './components/SvgIcon/index.vue'
import SelectV2 from './components/Select/index.vue'
import 'virtual:svg-icons-register'
import type { Router } from 'vue-router'

type BootstrapParams = {
  useElementUI?: Boolean
  container: Component
  router?: Router
}

export function bootstrap(params: BootstrapParams) {
  const { router, useElementUI = false, container } = params

  const app = createApp(container)
  app.component('SvgIcon', SvgIcon)
  app.component('SelectV2', SelectV2)

  if (useElementUI) {
    app.use(ElementPlus, {
      size: 'small'
    })
  }

  if (router) {
    app.use(router)
  }
  app.mount('#app')

  return app
}
