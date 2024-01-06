import { defineConfig } from "vite";
import path from "node:path";
import electron from "vite-plugin-electron/simple";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [
    vue(),
    electron({
      main: {
        entry: "main/index.ts",
      },
      preload: {
        input: path.join(__dirname, "main/preload.ts"),
      },
      renderer: {},
    }),
  ],
  resolve: {
    alias: [
      { find: "@/", replacement: `${__dirname}/src/` },
      { find: "@shared/", replacement: `${__dirname}/shared/` },
    ],
  },
  esbuild: {
    jsxFactory: "h",
    jsxFragment: "Fragment",
  },
});
