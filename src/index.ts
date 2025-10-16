import { readFile } from 'node:fs/promises'
import type { EmptyObject } from '@0x-jerry/utils'
import { definePreset, type Preflight, type Preset, type Rule } from 'unocss'
import { getAllClassNames, globForDaisyUI, processByPostCss } from './utils'

async function calcClassContentMap() {
  const clxNameFilesMap = new Map<string, Set<string>>()
  const fileContent = new Map<string, string>()

  const files = globForDaisyUI([
    //
    'components/*.css',
  ])

  const p = files.map(async (file) => {
    const content = await readFile(file, 'utf-8')

    const cssContent = await processByPostCss(content)

    fileContent.set(file, cssContent)

    const names = getAllClassNames(cssContent, { source: false })

    names.forEach((_, name) => {
      if (!clxNameFilesMap.has(name)) {
        clxNameFilesMap.set(name, new Set())
      }

      clxNameFilesMap.get(name)?.add(file)
    })
  })

  await Promise.all(p)

  return {
    fileMap: fileContent,
    clxNameMap: clxNameFilesMap,
  }
}

async function calcRules() {
  const files = globForDaisyUI([
    //
    // 'utilities/*.css',
    'colors/*.css',
  ])

  const rules: Rule[] = []

  const p = files.map(async (file) => {
    const content = await readFile(file, 'utf-8')

    const cssContent = await processByPostCss(content)

    console.log(file)
    const names = getAllClassNames(cssContent, { source: true })

    names.forEach((content, name) => {
      rules.push([name, [`.${name}{${content}}`]])
    })
  })

  await Promise.all(p)

  return rules
}

export async function presetDaisyui(): Promise<Preset<EmptyObject>> {
  const { fileMap, clxNameMap } = await calcClassContentMap()

  const autocompletes: string[] = [...clxNameMap.keys()]

  const rules: Rule[] = autocompletes.map((name) => [
    name,
    [`/* daisyui: ${name} */`],
  ])

  rules.push(...(await calcRules()))

  const extraIncludeFiles = new Set<string>()

  const preflight: Preflight = {
    getCSS(ctx) {
      const builtinFiles = globForDaisyUI(['base/*.css'])

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

      const css = [...includeFiles, ...extraIncludeFiles].map((file) => {
        const content = fileMap.get(file)
        return content || ''
      })

      return css.join('\n')
    },
  }

  const preset: Preset = {
    name: 'uno-preset-daisyui',
    rules,
    preflights: [preflight],
    transformers: [
      {
        name: 'daisyui-scanner',
        transform(_code, _id, ctx) {
          // check variant classes like `hover:xxx`, `2xl:xxx`
          for (const token of ctx.tokens) {
            if (token.includes(':') && clxNameMap.has(token)) {
              clxNameMap.get(token)?.forEach((file) => {
                extraIncludeFiles.add(file)
              })
            }
          }
        },
      },
    ],
  }

  return definePreset(preset)
}

export default presetDaisyui
