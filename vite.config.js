import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:7246",
        changeOrigin: true,
        secure: false,
        timeout: 30000,
        configure: (proxy, options) => {
          proxy.on("error", (err, req, res) => {
            console.log(err, "proxy error");
          });
          proxy.on("proxyReq", (proxyReq, req, res) => {
            console.log("sending requst to target", req.method, req.url);
          });
          proxy.on("proxyRes", (proxyRes, req, res) => {
            console.log("received response from target", proxyRes.statusCode);
          });
        },
      },
    },
  },
});
