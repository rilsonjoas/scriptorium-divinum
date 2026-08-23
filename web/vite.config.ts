import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 3000,
  },
  plugins: [
    react(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("react-markdown") || id.includes("remark") || id.includes("unified") || id.includes("mdast") || id.includes("micromark") || id.includes("hast")) {
            return "markdown";
          }
          if (id.includes("/react/") || id.includes("/react-dom/") || id.includes("scheduler") || id.includes("react-router") || id.includes("@tanstack")) {
            return "vendor";
          }
        },
      },
    },
  },
}));
