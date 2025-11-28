import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
   server: {
    host: true,           // ✅ allows external access
    port: 5173,           // optional, custom port
    allowedHosts: ["store-oxsn.onrender.com","store-qk5w.onrender.com"], // ✅ optional in Render
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
