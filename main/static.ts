import * as path from "path";

process.env.ROOT = path.join(__dirname, "..");
process.env.DIST = path.join(process.env.ROOT, "dist-electron");
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? path.join(process.env.ROOT, "public")
  : path.join(process.env.ROOT, "dist");
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

export const preload = path.join(process.env.DIST, "preload.js");

export const pageRoot = {
  development: process.env.VITE_DEV_SERVER_URL as string,
  production: path.join(process.env.VITE_PUBLIC, "index.html"),
};
