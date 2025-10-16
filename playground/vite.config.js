import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import uno from 'unocss/vite'
import inspect from 'vite-plugin-inspect'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [vue(), uno(), inspect()],
})
