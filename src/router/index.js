import { createRouter, createWebHashHistory } from "vue-router";
const HomePage = () => import("@/views/home/index");
const LoginPage = () => import("@/views/login/index");
const MyPage = () => import("@/views/my/index");
const routes = [
  // 首页模块
  {
    path: "/",
    name: "Home",
    component: HomePage,
  },
  // 登录模块
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
  },
  // 个人中心模块
  {
    path: "/my",
    name: "My",
    component: MyPage,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
