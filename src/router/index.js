import { createRouter, createWebHistory } from "vue-router";
import store from "../store"
const BookDetail = () => import("../views/BookDetail.vue");
const Home = () => import("../views/Home.vue");
const SignUp = () => import("../views/SignUp.vue");
const Login = () => import("../views/Login.vue");
const Profile = () => import("../views/Profile.vue");
const ReadingHistory = () => import("../views/ReadingHistory.vue");
const Collections = () => import("../views/Collections.vue");
const NotFound = () => import("../views/NotFound.vue");

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/signup",
    name: "SignUp",
    component: SignUp
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
    path: "/reading-history",
    name: "ReadingHistory",
    component: ReadingHistory,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/collections",
    name: "Collections",
    component: Collections,
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
    path: "/:slug",
    name: "BookDetail",
    props: true,
    component: BookDetail
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: { name: "404" }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  // Requires auth & no user
  if (requiresAuth && !(await store.dispatch("getCurrentUser"))) {
    next({ name: "SignUp" });
    // No requires auth and user (auth)
  } else if (!requiresAuth && (await store.dispatch("getCurrentUser"))) {
    next();
  } else {
    // Anything else
    next();
  }
});

export default router;
