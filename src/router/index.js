import { createRouter, createWebHashHistory } from "vue-router";
const HomePage = () => import("@/views/home/index");
const routes = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
