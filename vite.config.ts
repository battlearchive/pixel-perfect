import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
    // Add base path configuration for GitHub Pages
    router: {
      basename: "/pixel-perfect/",
    },
  },
  vite: {
    base: "/pixel-perfect/",
  },
  // Use the Netlify preset when deploying outside the Lovable sandbox.
  // In sandbox mode this is overridden to cloudflare-module automatically.
  nitro: { preset: "netlify" },
});
