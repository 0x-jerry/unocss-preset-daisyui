import { defineConfig, presetWind4 } from 'unocss'
import { presetDaisyui } from '../src'

export default defineConfig({
  presets: [
    //
    // presetMini(),
    presetWind4({
      preflights: {
        // Do not needed, because preset daisyui already included it.
        reset: false,
      },
    }),
    presetDaisyui(),
  ],
})
