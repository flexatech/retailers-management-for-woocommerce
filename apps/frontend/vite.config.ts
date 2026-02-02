import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import pluginExternal, { Options } from 'vite-plugin-external';

process.env = { ...process.env, ...loadEnv(process.env.mode || 'development', process.cwd()) };

const terserOptions = {
  output: {
    comments: /translators:/i,
  },
  compress: {
    passes: 2,
  },
  mangle: {
    reserved: ['__', '_n', '_nx', '_x'],
  },
};

const externalOptions: Options = {
  /** @type 'auto' */
  interop: 'auto',

  development: {
    externals: {
      '@wordpress/i18n': 'wp.i18n',
    },
  },

  production: {
    externals: {
      '@wordpress/i18n': 'wp.i18n',
      react: 'React',
      'react-dom': 'ReactDOM',
      'react-dom/client': 'ReactDOM',
    },
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  root: './src',

  plugins: [
    react({ jsxRuntime: 'classic' }),
    tailwindcss(),
    pluginExternal(externalOptions),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  esbuild: {
    loader: 'tsx',
    jsx: 'transform',
  },

  build: {
    minify: 'terser',
    terserOptions: terserOptions,
    manifest: false,
    emptyOutDir: true,
    outDir: path.resolve('../assets', 'dist', 'frontend'),
    assetsDir: '',
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        'product-retailers-frontend': path.resolve(__dirname, 'src/product-retailers-frontend.tsx'),
      },
      output: {
        entryFileNames: 'js/[name].js',
        assetFileNames: '[name].[ext]',
      },
    },
  },
  server: {
    cors: true,
    strictPort: true,
    port: 3001,
    origin: `${process.env.VITE_SERVER_ORIGIN}`,
    hmr: {
      port: 3001,
      host: 'localhost',
      protocol: 'ws',
    },
  },
});

