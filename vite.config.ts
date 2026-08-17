// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import fs from "node:fs";
import path from "node:path";

export default defineConfig({
  nitro: false,
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    spa: {
      enabled: true,
      prerender: {
        outputPath: "index",
        onSuccess({ html }) {
          const distDir = path.resolve(process.cwd(), "dist");
          const clientDir = path.resolve(process.cwd(), "dist/client");
          if (!fs.existsSync(distDir)) {
            fs.mkdirSync(distDir, { recursive: true });
          }
          fs.writeFileSync(path.join(distDir, "index.html"), html, "utf-8");
          if (fs.existsSync(clientDir)) {
            fs.cpSync(clientDir, distDir, { recursive: true, force: true });
          }
        },
      },
    },
  },
});
