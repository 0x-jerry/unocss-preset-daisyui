# UnoCSS Preset Daisyui

A UnoCSS preset for [daisyui](https://daisyui.com/).

## Install

```sh
pnpm i @0x-jerry/unocss-preset-daisyui daisyui -D
```

## Usage

`unocss.config.ts`

```ts
import { defineConfig, presetMini } from "unocss";
import { presetDaisyui } from "@0x-jerry/unocss-preset-daisyui";

export default defineConfig({
  presets: [presetMini(), presetDaisyui()],
});
```

`main.ts`

```ts
import "uno.css";
import "daisyui/theme/light.css";
```
