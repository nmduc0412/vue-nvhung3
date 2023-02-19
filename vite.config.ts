import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import { resolve, dirname } from "node:path";
import vue from "@vitejs/plugin-vue";
const path = require("path");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      globalize$: path.resolve(
        __dirname,
        "node_modules/globalize/dist/globalize.js"
      ),
      globalize: path.resolve(
        __dirname,
        "node_modules/globalize/dist/globalize"
      ),
      cldr$: path.resolve(__dirname, "node_modules/cldrjs/dist/cldr.js"),
      cldr: path.resolve(__dirname, "node_modules/cldrjs/dist/cldr"),
    },
    extensions: [".ts", ".js", ".json", ".scss"],
  },
  build: {
    rollupOptions: {
      treeshake: false,
    },
  },
});
