import { BasicLayout } from '@/layouts' // 基础页面

// 路由懒加载
const Home = () => import(/* webpackChunkName: "homepages" */ '@/views/home/index');

// 其他模块
import showRouteMap from './show'; // 模板菜单

export const localRouteMap = [
  {
    path: '/',
    component: BasicLayout,
    redirect: '/home',
    children: [
      {
        path: '/home',
        component: Home,
        name: 'home',
        meta: { title: '首页' },
      },
      // 其余模块
      ...showRouteMap
    ],
  },
];
