import * as cssTree from 'css-tree'

export function getAllClassNames(ast: cssTree.CssNode): string[] {
  const classNames = new Set<string>()

  cssTree.walk(ast, {
    visit: 'ClassSelector',
    enter(node) {
      const name = unescapeCssIdentifier(node.name)

      classNames.add(name)
    },
  })

  return [...classNames]
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
