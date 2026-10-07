import {createRouter, createWebHistory} from 'vue-router'

import HomePage from "@/pages/HomePage.vue";
import RatePage from "@/pages/RatePage.vue";
import ComparePage from "@/pages/ComparePage.vue";
import UpdateCompare from "@/pages/UpdateCompare.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: '/', component: HomePage},
    {path: '/rate', component: RatePage},
    {path: '/compare', component: ComparePage},
    {path: '/updates', component: UpdateCompare},
  ],
})

export default router
