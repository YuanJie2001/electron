import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "/",
    redirect:"/index",
  },
  {
    path: "/index",
    name: "/index",
    component: () => import("@/view/index.vue"),
  },
  {
    path: "/add",
    name: "add",
    component: () => import("@/view/deviceAtlas.vue"),
  },
  {
    path: "/historyAdd",
    name: "historyAdd",
    component: () => import("@/view/historyDeviceAtlas.vue"),
  },
  {
    path: "/browse",
    name: "browse",
    component: () => import("@/view/browse.vue"),
  },
  {
    path: "/test",
    name: "test",
    component: () => import("@/view/deviceLog.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
