import vue from '@vitejs/plugin-vue'
import vite from 'vite'
import path from 'path'

// https://vitejs.dev/config/
export default {
  root: path.resolve(process.cwd(), 'src'),
  base: '',
  build: {
    outDir: path.join(process.cwd(), 'dist/'),
    minify: 'esbuild',
  },
  plugins: [vue()],
  server: {
    host: 'localhost',
    port: 3000,
    strictPort: true,
    open: '/',
    hmr: {
      host: 'localhost'
    }
  },
  alias: {
    '/@components/': path.join(process.cwd(), 'src/components/'),
    '/@assets/': path.join(__dirname, 'src/assets/'),
    '/@plugins/': path.join(__dirname, 'src/plugins/'),
    '/@models/': path.join(__dirname, 'src/models/')
  },
} as vite.InlineConfig
