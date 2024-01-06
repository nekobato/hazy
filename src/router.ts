import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/main",
    name: "Main",
    component: () => import("./pages/main.vue"),
    children: [
      {
        path: "/main/timeline",
        name: "MainTimeline",
        component: () => import("./pages/main/timeline.vue"),
      },
      {
        path: "/main/settings",
        name: "MainSettings",
        component: () => import("./pages/main/settings.vue"),
      },
    ],
  },
  {
    path: "/post",
    name: "Post",
    component: () => import("./pages/post.vue"),
    children: [
      {
        path: "/post/create",
        name: "PostCreate",
        component: () => import("./pages/post/create.vue"),
      },
      {
        path: "/post/reaction",
        name: "PostReaction",
        component: () => import("./pages/post/reaction.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
