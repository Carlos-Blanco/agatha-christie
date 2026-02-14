import { createRouter, createWebHistory } from "vue-router";
import store from "../store"
import BookDetail from "../views/BookDetail.vue";
import Home from "../views/Home.vue";
import SignUp from "../views/SignUp.vue";
import Login from "../views/Login.vue";
import Profile from "../views/Profile.vue";
import ReadingHistory from "../views/ReadingHistory.vue";
import Collections from "../views/Collections.vue";
import NotFound from "../views/NotFound.vue";

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
  history: createWebHistory(process.env.BASE_URL),
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
