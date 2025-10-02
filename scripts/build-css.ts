import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import * as dark from '../src/colors/dark.ts'
import * as light from '../src/colors/light.ts'
import { generateCSS } from '../src/lib/generator.ts'

const distDir = fileURLToPath(new URL('../dist', import.meta.url))

mkdirSync(distDir, { recursive: true })

const colors = [
  'gray',
  'mauve',
  'slate',
  'sage',
  'olive',
  'sand',
  'tomato',
  'red',
  'ruby',
  'crimson',
  'pink',
  'plum',
  'purple',
  'violet',
  'iris',
  'indigo',
  'blue',
  'cyan',
  'teal',
  'jade',
  'green',
  'grass',
  'brown',
  'bronze',
  'gold',
  'sky',
  'mint',
  'lime',
  'yellow',
  'amber',
  'orange',
]
let count = 0
for (const colorName of colors) {
  const lightBase = (light as any)[colorName]
  const lightAlpha = (light as any)[`${colorName}A`]
  const darkBase = (dark as any)[`${colorName}Dark`]
  const darkAlpha = (dark as any)[`${colorName}DarkA`]

  if (lightBase && lightAlpha && darkBase && darkAlpha) {
    const standardCSS = generateCSS(colorName, {
      light: { ...lightBase, ...lightAlpha },
      dark: { ...darkBase, ...darkAlpha },
    })
    const standardPath = join(distDir, `${colorName}.css`)
    writeFileSync(standardPath, standardCSS, 'utf-8')
  }

  const lightP3Base = (light as any)[`${colorName}P3`]
  const lightP3Alpha = (light as any)[`${colorName}P3A`]
  const darkP3Base = (dark as any)[`${colorName}DarkP3`]
  const darkP3Alpha = (dark as any)[`${colorName}DarkP3A`]

  if (lightP3Base && lightP3Alpha && darkP3Base && darkP3Alpha) {
    const p3CSS = generateCSS(colorName, {
      light: { ...lightP3Base, ...lightP3Alpha },
      dark: { ...darkP3Base, ...darkP3Alpha },
    })
    const p3Path = join(distDir, `${colorName}-p3.css`)
    writeFileSync(p3Path, p3CSS, 'utf-8')
  }

  count++
}

console.log(`Generated ${count} colors`)
