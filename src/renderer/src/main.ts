import { createApp } from 'vue'
import App from './App.vue'
import './assets/css/tailwind.css'
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import SvgIcon from './components/SvgIcon/index.vue'
import SelectV2 from './components/Select/index.vue'
import 'virtual:svg-icons-register'
import router from './router/index'

const app = createApp(App)

app.component('SvgIcon', SvgIcon)
app.component('SelectV2', SelectV2)
app.use(ElementPlus, {
    // size用于设置表单组件的尺寸！不是全局
    size: "small"
})

app.use(router)
app.mount('#app')

