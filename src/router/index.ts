import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router: Array<RouteRecordRaw> = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/documentation',
      name: 'documentation',
      component: () =>
        import(/* webpackChunkName: "Documentation" */ "../views/DocumentationView.vue"),
    },
    {
      path: '/contacts',
      name: 'contacts',
      component: () =>
        import(/* webpackChunkName: "Contacts" */ "../views/ContactsView.vue"),
    },
    {
      path: '/login',
      name: 'login',
      component: () =>
        import(/* webpackChunkName: "Auth" */ "../views/AuthView.vue"),
    },
    {
      path: '/results',
      name: 'results',
      component: () =>
        import(/* webpackChunkName: "Auth" */ "../views/ResultsView.vue"),
    },
  ]
})

export default router
