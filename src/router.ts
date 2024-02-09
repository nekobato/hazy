import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/main",
    name: "Main",
    component: () => import("./pages/main.vue"),
    children: [
      {
        path: "timeline",
        name: "MainTimeline",
        component: () => import("./pages/main/timeline.vue"),
      },
      {
        path: "settings",
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
        path: "create",
        name: "PostCreate",
        component: () => import("./pages/post/create.vue"),
      },
      {
        path: "reaction",
        name: "PostReaction",
        component: () => import("./pages/post/reaction.vue"),
      },
    ],
  },
  {
    path: "/settings",
    name: "Settings",
    component: () => import("./pages/settings.vue"),
    children: [
      {
        path: "",
        name: "SettingsIndex",
        component: () => import("./pages/settings/index.vue"),
      },
    ],
  },
  {
    path: "/media-viewer",
    name: "MediaViewer",
    component: () => import("./pages/media-viewer.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
