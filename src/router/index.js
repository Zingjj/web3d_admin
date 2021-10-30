import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

Vue.use(Router)

import Layout from '@/layout'
import NavTest from './modules/nav-test'
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
  {
    path: '/campus',
    component: Layout,
    name: 'Campus',
    redirect: '/campus/manage',
    children: [
      {
        path: 'manage',
        name: 'CampusManage',
        component: () => import('@/views/manage/campus/manage'),
        meta: { title: '校区管理', icon: 'el-icon-school' }
      }
    ]
  },
  {
    path: '/college',
    component: Layout,
    name: 'College',
    redirect: '/college/manage',
    meta: {
      title: '学院管理',
      icon: 'el-icon-xueyuan iconfont'
    },
    children: [
      {
        path: 'manage',
        name: 'CollegeManage',
        component: () => import('@/views/manage/college/manage'),
        meta: { title: '学院数据管理', icon: 'el-icon-document' }
      },
      {
        path: 'sort',
        name: 'CollegeSort',
        component: () => import('@/views/manage/college/sort'),
        meta: { title: '学院分类管理', icon: 'el-icon-notebook-2' }
      }
    ]
  },
  {
    path: '/building',
    component: Layout,
    name: 'Building',
    redirect: '/building/manage',
    meta: {
      title: '建筑管理',
      icon: 'el-icon-office-building'
    },
    children: [
      {
        path: 'manage',
        name: 'BuildingManage',
        component: () => import('@/views/manage/building/manage'),
        meta: { title: '建筑数据管理', icon: 'el-icon-document' }
      },
      {
        path: 'sort',
        name: 'BuildingSort',
        component: () => import('@/views/manage/building/sort'),
        meta: { title: '建筑分类管理', icon: 'el-icon-notebook-2' }
      }
    ]
  },
  {
    path: '/public-service',
    component: Layout,
    name: 'PublicService',
    redirect: '/public-service/manage',
    meta: {
      title: '公共服务管理',
      icon: 'el-icon-knife-fork'
    },
    children: [
      {
        path: 'manage',
        name: 'PublicServiceManage',
        component: () => import('@/views/manage/public-service/manage'),
        meta: { title: '公共服务数据管理', icon: 'el-icon-document' }
      },
      {
        path: 'sort',
        name: 'PublicServiceSort',
        component: () => import('@/views/manage/public-service/sort'),
        meta: { title: '公共服务分类管理', icon: 'el-icon-notebook-2' }
      }
    ]
  },
  {
    path: '/path',
    component: Layout,
    name: 'Path',
    redirect: '/path/manage',
    children: [
      {
        path: 'manage',
        name: 'PathManage',
        component: () => import('@/views/manage/path/manage'),
        meta: { title: '路径管理', icon: 'el-icon-map-location' }
      }
    ]
  },
  // {
  //   path: '/components',
  //   component: Layout,
  //   name: 'Components',
  //   redirect: '/components/slide-yz',
  //   meta: { icon: 'el-icon-coin', title: '部分组件' },
  //   children: [
  //     {
  //       path: 'slide-yz',
  //       name: 'Sldie-yz',
  //       component: () => import('@/views/components/slide-yz'),
  //       meta: { icon: 'el-icon-s-claim', title: '滑动验证' }
  //     },
  //     {
  //       path: 'upload',
  //       name: 'Upload',
  //       component: () => import('@/views/components/pushImg'),
  //       meta: { icon: 'el-icon-upload', title: '上传图片' }
  //     },
  //     {
  //       path: 'carousel',
  //       name: 'Carousel',
  //       component: () => import('@/views/components/carousel'),
  //       meta: { icon: 'el-icon-lunbo iconfont', title: '轮播' }
  //     }
  //   ]
  // },
  {
    path: '/echarts',
    component: Layout,
    name: 'Echarts',
    redirect: '/echarts/slide-chart',
    meta: { icon: 'el-icon-s-marketing', title: '访问数据管理' },
    children: [
      {
        path: 'slide-chart',
        name: 'Sldie-chart',
        component: () => import('@/views/echarts/slide-chart'),
        meta: { title: '滑动charts' }
      },
      {
        path: 'dynamic-chart',
        name: 'Dynamic-chart',
        component: () => import('@/views/echarts/dynamic-chart'),
        meta: { title: '切换charts' }
      },
      {
        path: 'map-chart',
        name: 'Map-chart',
        component: () => import('@/views/echarts/map-chart'),
        meta: { title: 'map' }
      }
    ]
  },
  // {
  //   path: '/excel',
  //   component: Layout,
  //   name: 'Excel',
  //   redirect: '/excel-operate/excel-out',
  //   meta: { icon: 'el-icon-excel iconfont', title: 'Excel' },
  //   children: [
  //     {
  //       path: 'excel-out',
  //       name: 'Excel-out',
  //       component: () => import('@/views/excel-operate/excel-out'),
  //       meta: { title: 'Excel导出' }
  //     },
  //     {
  //       path: 'excel-in',
  //       name: 'Excel-in',
  //       component: () => import('@/views/excel-operate/excel-in'),
  //       meta: { title: 'Excel导入' }
  //     },
  //     {
  //       path: 'mutiheader-out',
  //       name: 'Mutiheader-out',
  //       component: () => import('@/views/excel-operate/mutiheader-out'),
  //       meta: { title: '多级表头导出' }
  //     }
  //   ]
  // },
  {
    path: '/error',
    component: Layout,
    name: 'Error',
    redirect: '/error/404',
    children: [
      {
        path: '404',
        name: 'Page404',
        component: () => import('@/views/error-page/404'),
        meta: { title: '404', icon: 'el-icon-s-release' }
      }
    ]
  },
  {
    path: 'http://202.194.14.238/#/p_index',
    name: 'web3d',
    meta: { icon: 'el-icon-link', title: '数字孪生平台链接' }
  },
  {
    path: '/permission',
    name: 'Permission',
    component: Layout,
    redirect: '/permission/page-use',
    meta: {
      title: '权限管理',
      icon: 'el-icon-lock'
    },
    children: [
      {
        path: 'page-user',
        name: 'PageUser',
        component: () => import('@/views/permission/page-user'),
        meta: { title: '用户页面', icon: 'el-icon-user' }
      },
      {
        path: 'page-admin',
        name: 'PageAdmin',
        component: () => import('@/views/permission/page-admin'),
        meta: {
          title: '管理员设置',
          icon: 'el-icon-user-solid'
        }
      },
      {
        path: 'roles',
        name: 'Roles',
        component: () => import('@/views/permission/roles'),
        meta: { title: '权限设置', icon: 'el-icon-s-tools' }
      }
    ]
  },
  // NavTest,
  {
    path: '*',
    name: '*404',
    redirect: '/404',
    hidden: true
  }
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
