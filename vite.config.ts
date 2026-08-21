import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;

// GitHub Pages project path
const base =
  process.env.GITHUB_ACTIONS ||
  process.env.NODE_ENV === "production"
    ? "/OWtracker/"
    : "/";

// https://vite.dev/config/
export default defineConfig(async () => ({
  plugins: [react()],

  base,

  // Vite options tailored for Tauri development
  clearScreen: false,

  server: {
    port: 1420,
    strictPort: true,
    host: host || false,

    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,

    watch: {
      ignored: [
        "**/src-tauri/**",
      ],
    },
  },
}));