import { createRouter, createWebHashHistory } from 'vue-router'
import { demos } from './demos'

export const router = createRouter({
  // hash history needs no 404 fallback on GitHub Pages
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('./pages/Home.vue') },
    { path: '/reference', name: 'reference', component: () => import('./pages/Reference.vue') },
    ...demos.map((demo) => ({
      path: demo.path,
      name: demo.title,
      component: demo.component,
      meta: { demo },
    })),
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('./pages/NotFound.vue') },
  ],
  scrollBehavior: () => ({ top: 0 }),
})
