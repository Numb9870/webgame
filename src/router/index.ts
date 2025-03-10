import { createRouter, createWebHistory } from 'vue-router';

import { constantRoutes } from './constantRouters';

export const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

export function setupRouter(app: any) {
  app.use(router);
}
