import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/shorten":   "http://localhost:8000",
      "/analytics": "http://localhost:8000",
    },
  },
});
