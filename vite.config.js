import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/wp-content/uploads/revista-digital/build/",
  plugins: [react()],
  envPrefix: 'SC_',
  resolve: {
    alias: {
      "@src": path.resolve(__dirname, "src"),
      "@public": path.resolve(__dirname, "public"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@components": path.resolve(__dirname, "src/components"),
      "@global": path.resolve(__dirname, "src/components/global"),
      "@context": path.resolve(__dirname, "src/context"),
      "@data": path.resolve(__dirname, "src/data"),
      "@schemas": path.resolve(__dirname, "src/data/schemas"),
      "@interfaces": path.resolve(__dirname, "src/data/interfaces"),
      "@middlewares": path.resolve(__dirname, "src/middlewares"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@router": path.resolve(__dirname, "src/router"),
      "@services": path.resolve(__dirname, "src/services"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@modules": path.resolve(__dirname, "node_modules"),
      "@styles": path.resolve(__dirname, "src/data/constants/styles"),
    },
  },
  build: {
    outDir: "build", // Cambia la carpeta de salida de dist a build
  },
});
