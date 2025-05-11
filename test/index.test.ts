import { parse } from 'css-tree'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { getAllClassNames } from '../src/utils'
import { createRequire } from 'node:module'

describe('utils', () => {
  it('get class names', async () => {
    const filePath = createRequire(import.meta.url).resolve(
      'daisyui/daisyui.css',
    )

    const names = getAllClassNames(parse(await readFile(filePath, 'utf-8')))
    expect(names).matchSnapshot()
  })
})
