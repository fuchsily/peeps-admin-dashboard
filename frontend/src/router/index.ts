import { defineRouter } from '#q-app';
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router';

import routes from './routes';
import { auth } from '../services/firebase';

export default defineRouter(() => {
  const createHistory = import.meta.env.SERVER
    ? createMemoryHistory
    : import.meta.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(import.meta.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach(async (to) => {
    await auth.authStateReady();

    const user = auth.currentUser;

    if (to.matched.some((record) => record.meta.requiresAuth) && !user) {
      return {
        path: '/login',
        query: { redirect: to.fullPath },
      };
    }

    if (to.path === '/login' && user) {
      return '/';
    }

    return true;
  });

  return Router;
});
