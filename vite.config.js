import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/Realtor/",
  build: { outDir: "dist" },
  server: {
    open: true,
    proxy: {
      "/api": "http://localhost:3000",  
    },
  },
});


