import * as cssTree from 'css-tree'

export interface GenerateClassNameOptions {
  source?: boolean
}

export function getAllClassNames(
  source: string,
  opt: GenerateClassNameOptions = {},
): string[] {
  const ast = cssTree.parse(source, {
    positions: true,
  })

  const classNames = new Set<string>()

  cssTree.walk(ast, {
    visit: 'Rule',
    enter(node) {
      cssTree.walk(node, {
        visit: 'ClassSelector',
        enter(node) {
          const name = unescapeCssIdentifier(node.name)

          classNames.add(name)
        },
      })

      if (opt.source) {
        const precludeStr = getSourceStr(node.prelude.loc!)

        if (precludeStr.lastIndexOf('.') !== 0) {
          throw new Error(`Source pair only avaiable for one class name!`)
        }
      }
    },
  })

  return [...classNames]

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
