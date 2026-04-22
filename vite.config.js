import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import compression from "vite-plugin-compression";
import { visualizer } from "rollup-plugin-visualizer";
import { sentryVitePlugin } from "@sentry/vite-plugin";

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
  plugins: [
    react({
      fastRefresh: true,
    }),
    // Brotli compression (best compression, Vercel serves this automatically)
    compression({
      algorithm: "brotliCompress",
      ext: ".br",
      threshold: 1024, // Only compress files > 1KB
      deleteOriginFile: false,
    }),
    // Note: Removed gzip compression - Vercel handles this automatically if browser doesn't support Brotli
    // This reduces deployment artifacts by 50% and improves build time

    // Sentry Vite Plugin for source map upload (production only)
    process.env.NODE_ENV === 'production' &&
      process.env.SENTRY_AUTH_TOKEN &&
      sentryVitePlugin({
        org: process.env.SENTRY_ORG || "hificopy-llc",
        project: process.env.SENTRY_PROJECT || "axolop-crm-frontend",
        authToken: process.env.SENTRY_AUTH_TOKEN,

        // Upload source maps to Sentry
        sourcemaps: {
          assets: "./dist/**",
          ignore: ["node_modules"],
          rewriteSourcesPattern: "~^.*?/(?=js/|assets/|fonts/|images/)",
        },

        // Release configuration
        release: {
          name: `axolop-crm-frontend@${process.env.npm_package_version || "1.2.0"}`,
          cleanArtifacts: true, // Delete maps after upload
          finalize: true, // Mark release as deployed
        },

        // Only run if auth token is provided
        disable: !process.env.SENTRY_AUTH_TOKEN || process.env.NODE_ENV !== 'production',
      }),

    // Bundle analyzer (only in build mode)
    process.env.ANALYZE &&
      visualizer({
        filename: "dist/stats.html",
        open: true,
        gzipSize: true,
        brotliSize: true,
      }),
  ].filter(Boolean),
  root: ".",
  base: "/",
  publicDir: "public",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: 'hidden', // Generate hidden source maps for Sentry (not exposed publicly)
    target: "esnext",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === "production",
        drop_debugger: true,
        pure_funcs: [
          "console.log",
          "console.info",
          "console.debug",
          "console.warn",
        ],
        passes: 3,
      },
      mangle: {
        safari10: true,
        properties: {
          regex: /^_/, // Mangle private variables
        },
      },
      format: {
        comments: false,
      },
    },
    rollupOptions: {
      input: "./index.html",
      output: {
        // Phase 5: Safe manual chunks - avoids React circular dependency issues
        // Strategy: Keep React ecosystem together, separate heavy vendor libraries
        manualChunks: (id) => {
          // Never split React - must stay together to avoid ReactCurrentOwner errors
          if (id.includes('node_modules/react') ||
              id.includes('node_modules/react-dom') ||
              id.includes('node_modules/scheduler') ||
              id.includes('node_modules/react-is')) {
            return 'react-vendor';
          }

          // Heavy charting library - separate chunk for dashboard
          if (id.includes('node_modules/recharts') ||
              id.includes('node_modules/d3-')) {
            return 'recharts-vendor';
          }

          // Animation libraries - loaded on demand
          if (id.includes('node_modules/framer-motion')) {
            return 'framer-motion';
          }
          if (id.includes('node_modules/gsap')) {
            return 'gsap-vendor';
          }

          // PDF generation - only needed for exports
          if (id.includes('node_modules/html2pdf') ||
              id.includes('node_modules/jspdf') ||
              id.includes('node_modules/html2canvas')) {
            return 'pdf-vendor';
          }

          // Rich text editor - only needed in form builder
          if (id.includes('node_modules/@tiptap') ||
              id.includes('node_modules/prosemirror')) {
            return 'editor-vendor';
          }

          // Radix UI components - common across app
          if (id.includes('node_modules/@radix-ui')) {
            return 'radix-ui';
          }

          // TanStack libraries
          if (id.includes('node_modules/@tanstack')) {
            return 'tanstack-vendor';
          }

          // Date utilities
          if (id.includes('node_modules/date-fns')) {
            return 'date-fns';
          }

          // Keep other node_modules as automatic chunks
        },
        // FIX: Ensure main entry and all chunks go to the same directory
        // This fixes dynamic import path resolution for GSAP and other frameworks
        entryFileNames: () => {
          return `js/[name]-[hash].js`;
        },
        chunkFileNames: () => {
          return `js/[name]-[hash].js`;
        },
        assetFileNames: (assetInfo) => {
          const extType = assetInfo.name?.split(".").pop() || "asset";
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            return `images/[name]-[hash][extname]`;
          }
          if (/woff|woff2|ttf|otf/i.test(extType)) {
            return `fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
      external: [],
    },
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./frontend"),
      "@branding": path.resolve(__dirname, "../branding"),
      "@shared": path.resolve(__dirname, "./src/shared"),
      "@components": path.resolve(__dirname, "./frontend/components"),
      "@pages": path.resolve(__dirname, "./frontend/pages"),
      "@services": path.resolve(__dirname, "./frontend/services"),
      "@utils": path.resolve(__dirname, "./frontend/utils"),
      "@/lib": path.resolve(__dirname, "./frontend/lib"),
      "@/context": path.resolve(__dirname, "./frontend/context"),
      "@/hooks": path.resolve(__dirname, "./frontend/hooks"),
      "@/data": path.resolve(__dirname, "./frontend/data"),
    },
    // Explicitly include .jsx extension for module resolution
    extensions: [".mjs", ".js", ".mts", ".ts", ".jsx", ".tsx", ".json"],
    // Ensure React is deduplicated across all dependencies
    dedupe: ["react", "react-dom", "react/jsx-runtime"],
  },
  server: {
    host: true,
    port: 3012,
    allowedHosts: ['axolop.antieq.com', 'localhost', '127.0.0.1'],
    hmr: {
      overlay: true,
    },
    proxy: {
      "/api": {
        target: "http://localhost:3007",
        changeOrigin: true,
        ws: true,
      },
      "/socket.io": {
        target: "http://localhost:3007",
        changeOrigin: true,
        ws: true,
      },
    },
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@tanstack/react-table",
      "@tanstack/react-query",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "zustand",
      "date-fns",
      "lucide-react",
      // GSAP must be pre-bundled together to ensure correct initialization order
      // ScrollTrigger depends on gsap core being loaded first
      "gsap",
      "gsap/ScrollTrigger",
    ],
    // Force single version of React
    dedupe: ["react", "react-dom"],
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    // Ensure VITE_ env vars are available - loadEnv may not expose them automatically
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY),
  },
  css: {
    devSourcemap: true,
  },
};
});
