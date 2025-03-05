import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()], // Remove @tailwindcss/vite
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
