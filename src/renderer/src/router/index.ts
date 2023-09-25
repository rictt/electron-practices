import { createRouter, RouteRecordRaw, createWebHashHistory } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/home/index.vue')
  },
  {
    path: '/resource',
    name: 'resource',
    component: () => import('../views/resource/index.vue')
  },
  {
    path: '/ffmpeg',
    name: 'ffmpeg',
    component: () => import('../views/ffmpeg/index.vue')
  },
  {
    path: '/ffmpeg/gif',
    name: 'ffmpeg:gif',
    component: () => import('../views/ffmpeg/gif.vue')
  },
  {
    path: '/ffmpeg/info',
    name: 'ffmpeg:info',
    component: () => import('../views/ffmpeg/info.vue')
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('../views/settings/index.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound', 
    component: () => import('../views/feedback/404.vue')
  }
]

// savedPosition 当且仅当 popstate 导航 (通过浏览器的 前进/后退 按钮触发) 时才可用。
const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: (to, from, savePosition) => {
    if (savePosition) {
      return savePosition
    }
    return {
      top: 0
    }
  }
})

export default router
