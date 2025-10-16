import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import postcss from 'postcss'
import nestingPlugin from 'postcss-nested'
import { getAllClassNames } from '../src/utils'

describe('utils', () => {
  it('get class names', async () => {
    const filePath = createRequire(import.meta.url).resolve(
      'daisyui/daisyui.css',
    )

    const content = await readFile(filePath, 'utf-8')
    const processor = postcss([nestingPlugin])
    const postcssResult = await processor.process(content)

    const names = getAllClassNames(postcssResult.css).toSorted()
    expect(names).matchSnapshot()
  })

  it('generate class source pair', async () => {
    const filePath = createRequire(import.meta.url).resolve(
      'daisyui/colors/states.css',
    )

    const content = await readFile(filePath, 'utf-8')
    const processor = postcss([nestingPlugin])
    const postcssResult = await processor.process(content)

    const names = getAllClassNames(postcssResult.css, {
      source: true,
    }).toSorted()
    expect(names).matchSnapshot()
  })
})
