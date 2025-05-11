import { defineConfig, presetMini } from 'unocss'
import { presetDaisyui } from '../src'

export default defineConfig({
  presets: [presetMini(), presetDaisyui()],
})
