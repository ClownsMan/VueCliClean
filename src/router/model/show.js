// 路由懒加载
const First = () => import(/* webpackChunkName: "show" */ '@/views/show/first');
const Second = () => import(/* webpackChunkName: "show" */ '@/views/show/second');


const showRouteMap = [
  {
    path: '/show/first',
    component: First,
    meta: {
      title: '二级菜单1'
    }
  },
  {
    path: '/show/second',
    component: Second,
    meta: {
      title: '二级菜单2'
    }
  },
];

export default showRouteMap;
