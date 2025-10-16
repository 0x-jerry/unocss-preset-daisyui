import * as cssTree from 'css-tree'
import fg from 'fast-glob'
import { createRequire } from 'module'
import path from 'path'
import postcss from 'postcss'
import nestingPlugin from 'postcss-nested'

export interface GenerateClassNameOptions {
  source?: boolean
}

export function getAllClassNames(
  source: string,
  opt: GenerateClassNameOptions = {},
): Map<string, string | undefined> {
  const ast = cssTree.parse(source, {
    positions: opt.source,
  })

  const classNameContentMap = new Map<string, string | undefined>()

  cssTree.walk(ast, {
    visit: 'Rule',
    enter(node) {
      if (opt.source) {
        checkPrecludeSize(node.prelude)
      }

      const blockSource = node.block.loc
        ? getSourceStr(node.block.loc).slice(1, -1)
        : undefined

      cssTree.walk(node, {
        visit: 'ClassSelector',
        enter(node) {
          const name = unescapeCssIdentifier(node.name)

          const previous = classNameContentMap.get(name) || ''

          classNameContentMap.set(name, previous + blockSource)
        },
      })
    },
  })

  return classNameContentMap

  function checkPrecludeSize(node: cssTree.CssNode) {
    if (node.type === 'SelectorList') {
      if (node.children.size > 1) {
        throw new Error(`Source pair only available for one class name!`)
      }
    }
  }

  function getSourceStr(loc: cssTree.CssLocation) {
    return source.slice(loc.start.offset, loc.end.offset)
  }
}

function unescapeCssIdentifier(escaped: string): string {
  return (
    escaped
      // Handle Unicode/numeric escapes: \32  (hex up to 6 digits) + optional space
      .replace(/\\([0-9A-Fa-f]{1,6})\s?/g, (_, hex) =>
        String.fromCodePoint(parseInt(hex, 16)),
      )
      // Handle escaped special characters: \:, \., \-, etc.
      .replace(/\\(.)/g, '$1')
  )
}

export async function processByPostCss(content: string): Promise<string> {
  const processor = postcss([nestingPlugin])
  const postcssResult = await processor.process(content, {
    // keep this to ignore warnings
    from: undefined,
  })

  return postcssResult.css
}

export function globForDaisyUI(pattern: string[]): string[] {
  const daisyuiBaseDir = path.dirname(
    createRequire(import.meta.url).resolve('daisyui/daisyui.css'),
  )

  return fg.sync(pattern, { cwd: daisyuiBaseDir, absolute: true })
}
