import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
} from 'vue-router';
import { constantRoutes } from './constantRouters';

// console.log(import.meta.env.MODE);

export const router = createRouter({
  history:
    import.meta.env.MODE == 'development'
      ? createWebHistory()
      : createMemoryHistory(),
  routes: constantRoutes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

export function setupRouter(app: any) {
  app.use(router);
}
