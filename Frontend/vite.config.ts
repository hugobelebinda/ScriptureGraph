import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const rootEnvDir = path.resolve(__dirname, "..");
  const env = loadEnv(mode, rootEnvDir, "");
  const apiPort = Number(env.PORT) || 3000;

  return {
    // Read env vars from repo root (.env), not only Frontend/.env
    envDir: "..",
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        "/api": {
          target: `http://localhost:${apiPort}`,
          changeOrigin: true,
        },
      },
    },
  };
});
