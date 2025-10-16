import { readFile } from 'node:fs/promises'
import {
  definePreset,
  type Preflight,
  type Preset,
  type PresetFactoryAwaitable,
  type Rule,
} from 'unocss'
import { getAllClassNames, globForDaisyUI, processByPostCss } from './utils'

async function calcClassContentMap() {
  const clxNameFilesMap = new Map<string, Set<string>>()
  const fileContent = new Map<string, string>()

  const files = globForDaisyUI([
    //
    'utilities/*.css',
    'colors/*.css',
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

export const presetDaisyui: PresetFactoryAwaitable<object, undefined> =
  definePreset(async () => {
    const { fileMap, clxNameMap } = await calcClassContentMap()

    const autocompletes: string[] = [...clxNameMap.keys()]

    const rules: Rule[] = autocompletes.map((name) => [
      name,
      [`/* daisyui: ${name} */`],
    ])

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

        const cssFiles = [...includeFiles, ...extraIncludeFiles]
        const css = cssFiles.map((file) => {
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
              if (token.includes(':')) {
                if (clxNameMap.has(token)) {
                  clxNameMap.get(token)?.forEach((file) => {
                    extraIncludeFiles.add(file)
                  })
                }
              }
            }
          },
        },
      ],
    }

    return preset
  })

export default presetDaisyui
