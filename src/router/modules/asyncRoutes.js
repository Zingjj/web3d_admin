import NavTest from './nav-test'
import Layout from '@/layout'
const asyncRoutes = [
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
    path: '/statistics',
    component: Layout,
    name: 'Statistics',
    redirect: '/statistics/slide-chart',
    meta: { icon: 'el-icon-s-marketing', title: '访问数据管理' },
    children: [
      {
        path: 'campus-visit',
        name: 'Campus-visit',
        component: () => import('@/views/statistics/campus-visit'),
        meta: { title: '校区访问统计' }
      },
      {
        path: 'module-visit',
        name: 'Module-visit',
        component: () => import('@/views/statistics/module-visit'),
        meta: { title: '模块点击统计' }
      },
      {
        path: 'model-visit',
        name: 'Model-visit',
        component: () => import('@/views/statistics/model-visit'),
        meta: { title: '模型点击统计' }
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

export default asyncRoutes