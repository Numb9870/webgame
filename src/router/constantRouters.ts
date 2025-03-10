import Layout from '@/layout/normal/index.vue';

export const constantRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: '/index',
        name: 'Index',
        component: () => import('@/view/main/index.vue'),
        meta: {
          title: '首页',
        },
      },
    ],
  },
];
