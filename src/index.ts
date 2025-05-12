import { definePreset, type Preflight, type Preset, type Rule } from 'unocss'
import { readFile } from 'node:fs/promises'
import * as cssTree from 'css-tree'
import path from 'node:path'
import fg from 'fast-glob'
import { getAllClassNames } from './utils'
import { createRequire } from 'node:module'
import type { EmptyObject } from '@0x-jerry/utils'
import postcss from 'postcss'
import nestingPlugin from 'postcss-nested'

const daisyuiBaseDir = path.dirname(
  createRequire(import.meta.url).resolve('daisyui/daisyui.css'),
)

async function calcClassContentMap() {
  const clxNameMap = new Map<string, Set<string>>()
  const fileMap = new Map<string, string>()

  const files = fg.sync(
    [
      'base/*.css',
      'components/*.css',
      'utilities/*.css',
      'colors/*.css',
      // 'theme/*.css',
    ],
    { cwd: daisyuiBaseDir },
  )

  const processor = postcss([nestingPlugin])
  const p = files.map(async (file) => {
    const content = await readFile(path.join(daisyuiBaseDir, file), 'utf-8')

    const postcssResult = await processor.process(content, {
      from: undefined,
    })
    fileMap.set(file, postcssResult.css)

    const names = getAllClassNames(cssTree.parse(content))

    names.forEach((name) => {
      if (!clxNameMap.has(name)) {
        clxNameMap.set(name, new Set())
      }
      clxNameMap.get(name)?.add(file)
    })
  })

  await Promise.all(p)

  return {
    fileMap,
    clxNameMap,
  }
}

export async function presetDaisyui(): Promise<Preset<EmptyObject>> {
  const { fileMap, clxNameMap } = await calcClassContentMap()

  const autocompletes: string[] = [...clxNameMap.keys()]

  const rules: Rule[] = autocompletes.map((name) => [
    name,
    [`/* daisyui: ${name} */`],
  ])

  const preflight: Preflight = {
    getCSS(ctx) {
      const builtinFiles = [...fileMap.keys()].filter((file) =>
        file.startsWith('base/'),
      )

      const includeFiles = new Set<string>(builtinFiles)

      ctx.generator.activatedRules.forEach((rule) => {
        const name = rule[0]
        if (name instanceof RegExp) {
          return
        }

        if (clxNameMap.has(name)) {
          clxNameMap.get(name)?.forEach((file) => {
            includeFiles.add(file)
          })
        }
      })

      const css = [...includeFiles].map((file) => {
        const content = fileMap.get(file)
        return content || ''
      })

      return css.join('\n')
    },
  }

  return definePreset({
    name: 'uno-preset-daisyui',
    rules,
    preflights: [preflight],
  })
}

export default presetDaisyui
