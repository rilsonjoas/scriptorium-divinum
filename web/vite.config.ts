import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 3000,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "robots.txt", "ads.txt"],
      manifest: {
        name: "Scriptorium Divinum",
        short_name: "Scriptorium",
        description:
          "Biblioteca teológica clássica em domínio público — leia online os Padres da Igreja, reformadores e grandes teólogos.",
        lang: "pt-BR",
        theme_color: "#2c1e13",
        background_color: "#2c1e13",
        display: "standalone",
        start_url: "/",
        icons: [
          { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
        ],
      },
      workbox: {
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/api\//, /^\/uploads\//],
        runtimeCaching: [
          {
            urlPattern: new RegExp("^https://api-scriptorium\\.narniano\\.com/api/v1/books/[^/]+/text$"),
            handler: "NetworkFirst",
            options: {
              cacheName: "leituras-offline",
              expiration: { maxEntries: 60, maxAgeSeconds: 30 * 24 * 3600 },
            },
          },
          {
            urlPattern: new RegExp("^https://api-scriptorium\\.narniano\\.com/api/v1/(books|authors|categories)(\\?.*)?$"),
            handler: "NetworkFirst",
            options: {
              cacheName: "catalogo",
              expiration: { maxEntries: 40, maxAgeSeconds: 24 * 3600 },
            },
          },
        ],
      },
    }),
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
