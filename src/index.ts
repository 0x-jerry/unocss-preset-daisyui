import {
  definePreset,
  type Preflight,
  type Preset,
  type PresetFactoryAwaitable,
  type Rule,
} from 'unocss'
import { getAllClassNames, globForDaisyUI } from './utils'

async function calcClassContentMap() {
  const clxNameFilesMap: Map<string, Set<string>> = new Map()

  const files = await globForDaisyUI([
    //
    'utilities/*.css',
    'colors/*.css',
    'components/*.css',
  ])

  const p = files.values().map(async (file) => {
    const names = getAllClassNames(file.content, { source: false })

    names.forEach((_, name) => {
      if (!clxNameFilesMap.has(name)) {
        clxNameFilesMap.set(name, new Set())
      }

      clxNameFilesMap.get(name)?.add(file.path)
    })
  })

  await Promise.all(p)

  return {
    fileContentMap: files,
    clxNameFilesMap,
  }
}

export const presetDaisyui: PresetFactoryAwaitable<object, undefined> =
  definePreset(async () => {
    const baseFiles = await globForDaisyUI(['base/*.css'])

    const baseCssContent = baseFiles
      .values()
      .map((n) => n.content)
      .toArray()
      .join('\n')

    const { fileContentMap, clxNameFilesMap } = await calcClassContentMap()

    const autocompletes: string[] = [...clxNameFilesMap.keys()]

    const rules: Rule[] = autocompletes.map((name) => [
      name,
      [`/* daisyui: ${name} */`],
    ])

    const extraIncludeFiles = new Set<string>()

    const preflight: Preflight = {
      getCSS(ctx) {
        const includeFiles = new Set<string>()

        ctx.generator.activatedRules.forEach((rule) => {
          const token = rule[0]
          if (token instanceof RegExp) {
            return
          }

          checkTokenToInclude(token)
        })

        const cssFiles = [...includeFiles, ...extraIncludeFiles]
        const css = cssFiles.map((relativeFilePath) => {
          const file = fileContentMap.get(relativeFilePath)
          return file?.content || ''
        })

        return [baseCssContent, ...css].join('\n')
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
                checkTokenToInclude(token)
              }
            }
          },
        },
      ],
    }

    return preset
    function checkTokenToInclude(token: string) {
      if (clxNameFilesMap.has(token)) {
        clxNameFilesMap.get(token)?.forEach((file) => {
          extraIncludeFiles.add(file)
        })
      }
    }
  })

export default presetDaisyui
