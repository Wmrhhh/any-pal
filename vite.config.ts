import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
// import { visualizer } from "rollup-plugin-visualizer"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    //  visualizer({
    //   filename: "stats.html",
    //   open: true,
    //   gzipSize: true,
    //   brotliSize: true,
    // }),
  ],

  server: {
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
});
