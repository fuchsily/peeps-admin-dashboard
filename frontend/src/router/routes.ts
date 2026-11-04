import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('../pages/LoginPage.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        component: () => import('../pages/OverviewPage.vue'),
      },
      {
        path: 'reports',
        component: () => import('../pages/ReportsPage.vue'),
      },
      {
        path: 'verifications',
        component: () => import('../pages/VerificationsPage.vue'),
      },
      {
        path: 'connectors',
        component: () => import('../pages/PlaceholderPage.vue'),
      },
      {
        path: 'users',
        component: () => import('../pages/UsersPage.vue'),
      },
      {
        path: 'analytics',
        component: () => import('../pages/PlaceholderPage.vue'),
      },
      {
        path: 'feedback',
        component: () => import('../pages/PlaceholderPage.vue'),
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('../pages/ErrorNotFound.vue'),
  },
];

export default routes;
