import fs from 'node:fs'
import path from 'node:path'

type ColorScaleValues = Record<string, string>

interface ColorScales {
  values: ColorScaleValues
  semantics?: {
    light?: ColorScaleValues
    dark?: ColorScaleValues
  }
}

export type ColorScale = ColorScaleValues | ColorScales

export interface ColorFile {
  path: string
  content: string
}

export interface GeneratorOptions {
  outputDir: string
  static?: boolean
}

function generateCssContent(
  properties: Record<string, string>,
  useStatic: boolean,
): string {
  const cssProperties = Object.entries(properties)
    .map(([name, value]) => `  --color-${toCssCasing(name)}: ${value};`)
    .join('\n')

  return useStatic
    ? `@theme static {\n${cssProperties}\n}\n`
    : `@theme {\n${cssProperties}\n}\n`
}

function getOutputPath(
  scaleName: string,
  outputDir: string,
  variant?: 'light' | 'dark',
): string {
  const isP3 = scaleName.includes('P3')
  const baseName = scaleName.replace(/P3A?$/, '')
  const fileName = toFileName(baseName)

  const baseDir = isP3 ? path.join(outputDir, 'p3') : outputDir

  if (variant) {
    const suffix = variant === 'dark' ? '-theme-dark' : '-theme'
    return path.join(baseDir, `${toCssCasing(baseName)}${suffix}.css`)
  }

  return path.join(baseDir, `${fileName}.css`)
}

function normalizeColorScale(scale: ColorScale): ColorScales {
  if (
    typeof scale === 'object' &&
    'values' in scale &&
    typeof scale.values === 'object'
  ) {
    return scale as ColorScales
  }
  return { values: scale as ColorScaleValues }
}

function buildColorScaleFiles(
  scaleName: string,
  scale: ColorScale,
  options: GeneratorOptions,
): ColorFile[] {
  const { outputDir, static: useStatic = true } = options
  const normalized = normalizeColorScale(scale)
  const files: ColorFile[] = []

  files.push({
    path: getOutputPath(scaleName, outputDir),
    content: generateCssContent(normalized.values, useStatic),
  })

  if (normalized.semantics?.light) {
    files.push({
      path: getOutputPath(scaleName, outputDir, 'light'),
      content: generateCssContent(normalized.semantics.light, useStatic),
    })
  }

  if (normalized.semantics?.dark) {
    files.push({
      path: getOutputPath(scaleName, outputDir, 'dark'),
      content: generateCssContent(normalized.semantics.dark, useStatic),
    })
  }

  return files
}

export function writeThemeFiles(files: ColorFile[]): void {
  const dirs = new Set(files.map((f) => path.dirname(f.path)))

  for (const dir of dirs) {
    fs.mkdirSync(dir, { recursive: true })
  }

  for (const file of files) {
    fs.writeFileSync(file.path, file.content)
  }
}

export function generateColors(
  colorScales: Record<string, ColorScale>,
  options: GeneratorOptions,
): void {
  const files: ColorFile[] = []
  for (const [scaleName, scale] of Object.entries(colorScales)) {
    files.push(...buildColorScaleFiles(scaleName, scale, options))
  }
  writeThemeFiles(files)
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
