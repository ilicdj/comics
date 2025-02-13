import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SingleComic from '../views/SingleComic.vue'

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
      props: true,
      component: SingleComic,
    },
  ],
})

export default router
