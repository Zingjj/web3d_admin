import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

Vue.use(Router)

import Layout from '@/layout'

import AsyncRoutes from './modules/asyncRoutes'
import { Message } from 'element-ui'
import getTitle from '@/utils/getTitle'

/**
 * 路由相关属性说明
 * hidden: 当设置hidden为true时，意思不在sideBars侧边栏中显示
 * meta{
 * title: xxx,  设置sideBars侧边栏名称
 * icon: xxx,  设置ideBars侧边栏图标
 * noCache: true  当设置为true时不缓存该路由页面
 * }
 */

/*通用routers*/
export const currencyRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login'),
    meta: { title: '登录页' },
    hidden: true
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/error-page/404.vue'),
    hidden: true
  },
  {
    path: '/',
    name: 'Home',
    component: Layout,
    redirect: '/dashbord',
    children: [
      {
        path: 'dashbord',
        name: 'Dashbord',
        component: () => import('@/views/dashboard'),
        meta: { title: '首页', icon: 'el-icon-s-data' }
      }
    ]
  },
  {
    path: '/personal',
    name: 'Personal',
    component: Layout,
    redirect: '/personal/index',
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'Personal-index',
        component: () => import('@/views/personal'),
        meta: { title: '个人中心' }
      }
    ]
  },
  // {
  //   path: '/driver',
  //   name: 'Driver',
  //   component: Layout,
  //   redirect: '/driver/index',
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Driver-index',
  //       component: () => import('@/views/driver-page'),
  //       meta: { title: '引导指南', icon: 'el-icon-s-flag' }
  //     }
  //   ]
  // }
  ...AsyncRoutes
]
/*动态添加routers*/
export const asyncRoutes = [
  // {
  //   path: '/table',
  //   name: 'Table',
  //   redirect: '/table/base-table',
  //   component: Layout,
  //   meta: {
  //     title: 'Table',
  //     icon: 'el-icon-table iconfont'
  //   },
  //   children: [
  //     {
  //       path: 'base-table',
  //       name: 'BaseTable',
  //       component: () => import('@/views/table/common-table'),
  //       meta: { title: '普通表格' }
  //     },
  //     {
  //       path: 'complex-table',
  //       name: 'ComplexTable',
  //       component: () => import('@/views/table/complex-table'),
  //       meta: { title: '复杂表格' }
  //     }
  //   ]
  // },
  
]
const creatRouter = () => {
  return new Router({
    routes: currencyRoutes,
    scrollBehavior() {
      return { x: 0, y: 0 }
    }
  })
}

const router = creatRouter()

// 解决addRoute不能删除动态路由问题
export function resetRouter() {
  const reset = creatRouter()
  router.matcher = reset.matcher
}

// 导航守卫
router.beforeEach(async (to, from, next) => {
  document.title = getTitle(to.meta.title)
  if (to.path === '/login') {
    next()
  } else {
    // console.log(store.getters);
    if (store.getters.token) {
      const hasRoles = store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          const { roles } = await store.dispatch('user/_getInfo')
          const addRoutes = await store.dispatch(
            'permission/getAsyncRoutes',
            roles
          )
          router.addRoutes(addRoutes)

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          Message.error(error)
        }
      }
    } else {
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      })
    }
  }
})
export default router
