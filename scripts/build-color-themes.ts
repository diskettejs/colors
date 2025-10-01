import fs from 'node:fs'
import path from 'node:path'
import * as allExports from '../src/index.ts'

interface BuildThemesOptions {
  outputDir: string
  static?: boolean
}

export function buildThemes(opts: BuildThemesOptions): void {
  const { outputDir, static: useStatic = true } = opts
  const p3OutputDir = path.join(outputDir, 'p3')

  for (const dirPath of [outputDir, p3OutputDir]) {
    fs.mkdirSync(dirPath, { recursive: true })
  }

  // Extract theme tokens and color scales from exports
  const { themeTokensLight, themeTokensDark, ...allColorScales } = allExports

  // Process existing color scales
  for (const key in allColorScales) {
    const values = allColorScales[key as keyof typeof allColorScales]
    const isP3 = key.includes('P3')

    const cssProperties = Object.entries(values)
      .map(([name, value]) => `  --color-${toCssCasing(name)}: ${value};`)
      .join('\n')
    if (!key.endsWith('A') && !key.endsWith('P3')) {
      console.log(key)
    }

    const output = useStatic
      ? `@theme static {\n${cssProperties}\n}\n`
      : `@theme {\n${cssProperties}\n}\n`

    const fileName = toFileName(key.replace(/P3A?$/, ''))
    const targetDir = isP3 ? p3OutputDir : outputDir

    fs.writeFileSync(path.join(targetDir, `${fileName}.css`), output)
  }

  // Process theme tokens
  if (themeTokensLight && themeTokensDark) {
    processThemeTokens(themeTokensLight, themeTokensDark, opts)
  }
}

function processThemeTokens(
  lightTokens: any,
  darkTokens: any,
  opts: BuildThemesOptions,
): void {
  const { outputDir, static: useStatic = true } = opts
  const p3OutputDir = path.join(outputDir, 'p3')

  // Process light theme tokens
  for (const key in lightTokens) {
    const values = lightTokens[key]
    const isP3 = key.includes('P3')

    if (isP3) {
      // P3 variants only contain surface values
      const cssProperties = Object.entries(values)
        .map(([name, value]) => `  --color-${toCssCasing(name)}: ${value};`)
        .join('\n')

      const output = useStatic
        ? `@theme static {\n${cssProperties}\n}\n`
        : `@theme {\n${cssProperties}\n}\n`

      const colorName = key.replace(/P3$/, '')
      const fileName = `${toCssCasing(colorName)}-theme`

      fs.writeFileSync(path.join(p3OutputDir, `${fileName}.css`), output)
    } else {
      // Regular theme tokens with all properties
      const cssProperties = Object.entries(values)
        .map(([name, value]) => `  --color-${toCssCasing(name)}: ${value};`)
        .join('\n')

      const output = useStatic
        ? `@theme static {\n${cssProperties}\n}\n`
        : `@theme {\n${cssProperties}\n}\n`

      const fileName = `${toCssCasing(key)}-theme`

      fs.writeFileSync(path.join(outputDir, `${fileName}.css`), output)
    }
  }

  // Process dark theme tokens
  for (const key in darkTokens) {
    const values = darkTokens[key]
    const isP3 = key.includes('P3')

    if (isP3) {
      // P3 variants only contain surface values
      const cssProperties = Object.entries(values)
        .map(([name, value]) => `  --color-${toCssCasing(name)}: ${value};`)
        .join('\n')

      const output = useStatic
        ? `@theme static {\n${cssProperties}\n}\n`
        : `@theme {\n${cssProperties}\n}\n`

      const colorName = key.replace(/P3$/, '')
      const fileName = `${toCssCasing(colorName)}-theme-dark`

      fs.writeFileSync(path.join(p3OutputDir, `${fileName}.css`), output)
    } else {
      // Regular theme tokens with all properties
      const cssProperties = Object.entries(values)
        .map(([name, value]) => `  --color-${toCssCasing(name)}: ${value};`)
        .join('\n')

      const output = useStatic
        ? `@theme static {\n${cssProperties}\n}\n`
        : `@theme {\n${cssProperties}\n}\n`

      const fileName = `${toCssCasing(key)}-theme-dark`

      fs.writeFileSync(path.join(outputDir, `${fileName}.css`), output)
    }
  }
}

function toCssCasing(str: string) {
  return str
    .replace(/([a-z])(\d)/, '$1-$2')
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
}

function toFileName(str: string) {
  return toCssCasing(str).replace(/-a$/, '-alpha')
}
