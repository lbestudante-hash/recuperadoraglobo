import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
  },
});

export default defineConfig({
 "scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
