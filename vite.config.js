import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
// https://github.com/vitejs/vite/issues/1973
export default defineConfig({
  // allow vite use process.env
  // define: {
  //   'process.env': process.env
  // },
  plugins: [react(), svgr()],
  // base: './'
  resolve: {
    alias: [
      { find: '~', replacement: '/src' }
    ]
  }
})
