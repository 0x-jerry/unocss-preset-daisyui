# UnoCSS Preset Daisyui

A UnoCSS preset for [daisyui](https://daisyui.com/).
Due to the implementation, this is 100% compatible with daisyui with some [trade-offs](#limitations).

## Install

```sh
pnpm i @0x-jerry/unocss-preset-daisyui daisyui -D
```

## Usage

`unocss.config.ts`

```ts
import { defineConfig, presetMini, presetWind4 } from "unocss";
import { presetDaisyui } from "@0x-jerry/unocss-preset-daisyui";

export default defineConfig({
  presets: [
    presetMini(),
    // When use with wind4 preset, you need to disable reset preflight,
    // because preset daisyui already included it.
    presetWind4({
      preflights: {
        reset: false,
      },
    })
    presetDaisyui(),
  ],
});
```

`main.ts`

```ts
import "uno.css";
import "daisyui/theme/light.css";
```

## Limitations

Due to the implementation of this preset, here has some limitations:

1. All `daisyui` classes will only available in global scope.
2. `daisyui/theme/light.css` is required, or you can import any theme you want from `daisyui/theme`.
3. You can't use `@apply` with `daisyui` classes.
4. `daisyui` classes is not fully on-demand, so the bundle size may larger than expected.
