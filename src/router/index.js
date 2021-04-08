import { createRouter, createWebHistory } from "vue-router";
import store from "../store"
import BookDetail from "../views/BookDetail.vue";
import Home from "../views/Home.vue";
import Signup from "../views/Signup.vue";
import Login from "../views/Login.vue";
import Profile from "../views/Profile.vue";
import NotFound from "../views/NotFound.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/:slug",
    name: "BookDetail",
    props: true,
    component: BookDetail
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/404",
    name: "404",
    component: NotFound
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: { name: "404" }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  // Requires auth & no user
  if (requiresAuth && !(await store.dispatch("getCurrentUser"))) {
    next({ name: "Signup" });
    // No requires auth and user (auth)
  } else if (!requiresAuth && (await store.dispatch("getCurrentUser"))) {
    next();
  } else {
    // Anything else
    next();
  }
});

export default router;
