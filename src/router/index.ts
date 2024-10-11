import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

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
      component: HomeView
    },
    {
      path: '/submission',
      name: 'submission',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/Submission.vue')
    }
  ]
})

import { alert_close, encode, verify } from '@/tools/secret'
router.beforeEach((to, from, next) => {
  let key = localStorage.getItem('secret_key')

  let session_token = sessionStorage.getItem('token')
  if (session_token == null) {
    let token = prompt('input your token')
    if (token != '123') {
      alert('wrong token')
    }
  }


  if (key != null && key != undefined && key.trim() != '') {
    let token = localStorage.getItem('token')

    if (token == null || token == undefined || token.trim() == '') {
      alert_close()
      return
    }
    
    if (verify(encode(token, key), '332d69e43466a23a1afde44e889f47f6')) {
      next()
    } else {
      alert_close('Invalid Token!')
    }
    
  } else {
    alert_close()
  }
})

export default router
