import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
   plugins: [react()],
   base: "/my-electronics-store/",
   build: {
      rollupOptions: {
         output: {
            manualChunks: {
               react: ["react", "react-dom"],
            },
         },
      },
   },
});
