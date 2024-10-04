import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import path from "node:path";

export default defineConfig(({ command, mode }) => {
  process.env = {
    ...process.env,
    ...loadEnv(mode, path.join(process.cwd(), "..")),
  };
  return {
    base: "/",
    build: {
      outDir: "dist",
    },
    plugins: [react()],
    server: {
      port: 3000,
    },
    define: {
      APP_VERSION: JSON.stringify(process.env.npm_package_version),
    },
    resolve: {
      alias: {
        "@": "/src",
      },
    },
    assetsInclude: ["**/*.png"],
  };
});
