import { createRouter, createWebHistory } from "vue-router";
import BookDetail from '../views/BookDetail.vue'
import Home from '../views/Home.vue'
import Profile from '../views/Profile.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/book-detail/:id',
    name: 'BookDetail',
    props: true,
    component: BookDetail
  },
  {
    path: '/profile',
    name: 'Profilet',
    component: Profile
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
