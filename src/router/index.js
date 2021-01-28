import { createRouter, createWebHistory } from "vue-router";
import BookDetail from '../views/BookDetail.vue'
import Home from '../views/Home.vue'
import SignUp from '../views/SignUp.vue'

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
    path: '/signup',
    name: 'SignUp',
    component: SignUp
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
