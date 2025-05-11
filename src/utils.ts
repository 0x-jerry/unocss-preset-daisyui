import * as cssTree from 'css-tree'

export function getAllClassNames(ast: cssTree.CssNode): string[] {
  const classNames = new Set<string>()

  cssTree.walk(ast, {
    visit: 'ClassSelector',
    enter(node) {
      const name = node.name.replaceAll('\\/', '/')

      if (!name.includes(':')) {
        classNames.add(name)
      }
    },
  })

  return [...classNames]
}
