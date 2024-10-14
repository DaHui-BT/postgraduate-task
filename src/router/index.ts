import Database from '@/tools/mongodb'
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: {
        showNavbar: true,
        isNeedLogin: false
      }
    },
    {
      path: '/submission',
      name: 'submission',
      component: () => import('@/views/Submission.vue'),
      meta: {
        showNavbar: true,
        isNeedLogin: true
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/Profile.vue'),
      meta: {
        showNavbar: true,
        isNeedLogin: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: {
        showNavbar: false,
        isNeedLogin: false
      }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/Register.vue'),
      meta: {
        showNavbar: false,
        isNeedLogin: false
      }
    },
    {
      path: '/confirm',
      name: 'confirm',
      component: () => import('@/views/Confirm.vue'),
      meta: {
        showNavbar: false,
        isNeedLogin: false
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const database = new Database()
  
  if (to.meta.isNeedLogin) {
    if (database.isLogin) {
      next()
    } else {
      next({
        path: '/login',
        query: {
          'from': to.path
        }
      })
    }
  } else {
    next()
  }
})

export default router
