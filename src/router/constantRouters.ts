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
      },
    ],
  },
  {
    path: '/PuzzleGames',
    component: Layout,
    redirect: '/PuzzleGames/index',
    children: [
      {
        path: '/PuzzleGames/index',
        name: 'PuzzleGames',
        component: () => import('@/view/PuzzleGames/index.vue'),
      },
      {
        path: '/PuzzleGames/GluttonousSnake',
        name: 'GluttonousSnake',
        component: () => import('@view/PuzzleGames/GluttonousSnake/GluttonousSnake.vue'),
      },
    ],
  },
];
