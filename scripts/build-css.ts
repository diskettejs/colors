import path from 'path'
import * as allExports from '../src/index.ts'
import { generateColors, type ColorScale } from '../src/lib/generator.ts'

const outputDir = path.resolve(import.meta.dirname, '../build')

const { semanticsLight, semanticsDark, ...colorScales } = allExports

const unifiedColorScales: Record<string, ColorScale> = {}

for (const [scaleName, scaleValues] of Object.entries(colorScales)) {
  const lightSemantics =
    semanticsLight?.[scaleName as keyof typeof semanticsLight]
  const darkSemantics = semanticsDark?.[scaleName as keyof typeof semanticsDark]

  if (lightSemantics || darkSemantics) {
    unifiedColorScales[scaleName] = {
      values: scaleValues as Record<string, string>,
      semantics: {
        ...(lightSemantics && {
          light: lightSemantics as Record<string, string>,
        }),
        ...(darkSemantics && { dark: darkSemantics as Record<string, string> }),
      },
    }
  } else {
    unifiedColorScales[scaleName] = scaleValues as Record<string, string>
  }
}

generateColors(unifiedColorScales, {
  outputDir,
  static: true,
})
