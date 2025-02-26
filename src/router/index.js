import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SingleComicView from '../views/SingleComicView.vue'
import NotFound from '@/components/NotFound.vue'
import NetworkError from '@/components/NetworkError.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/comics/:id',
      name: 'single-comic',
      props: (route) => {
        return { id: parseInt(route.params.id) }
      },
      component: SingleComicView,
    },
    {
      path: '/:catchAll(.*)',
      name: 'NotFound',
      component: NotFound
    },
    {
      path: '/404/:resource',
      name: '404Resource',
      component: NotFound,
      props: true
    },
    {
      path: '/network-error',
      name: 'NetworkError',
      component: NetworkError
    }
  ],
})

export default router
