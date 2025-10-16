import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import fg from 'fast-glob'
import { getAllClassNames, processByPostCss } from '../src/utils'

describe('utils#getAllClassNames', () => {
  const daisyuiBaseDir = path.dirname(
    createRequire(import.meta.url).resolve('daisyui/daisyui.css'),
  )

  const pattern = ['colors/*.css', 'utilities/*.css', 'components/*.css']

  const files = fg.sync(pattern, { cwd: daisyuiBaseDir })

  for (const file of files) {
    it(`class names for ${file}`, async () => {
      const filePath = path.join(daisyuiBaseDir, file)

      const content = await readFile(filePath, 'utf-8')
      const postcssResult = await processByPostCss(content)

      const names = getAllClassNames(postcssResult).keys().toArray().toSorted()
      await expect(names).toMatchFileSnapshot(`__out_snapshots__/${file}.txt`)
    })
  }
})
