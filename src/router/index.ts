import { createRouter, createWebHistory } from 'vue-router'

import HomePage from "@/pages/HomePage.vue";
import RatePage from "@/pages/RatePage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: HomePage },
    { path: '/rate', component: RatePage },
  ],
})

export default router
