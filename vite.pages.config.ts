import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// A relative base keeps the generated site portable between a user site and a
// project site, where GitHub Pages serves content beneath the repository name.
export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    outDir: "dist-pages",
    emptyOutDir: true,
  },
});
