/**
 * Generates CSS for a color scale
 * @param colorName - The name of the color (e.g., "amber")
 * @param lightTheme - Merged light theme colors (base + alpha)
 * @param darkTheme - Merged dark theme colors (base + alpha)
 * @returns CSS string with @theme static block, light theme, and dark theme
 */
export function generateCSS(
  colorName: string,
  {
    light,
    dark,
  }: { light: Record<string, string>; dark: Record<string, string> },
): string {
  const baseVars = Array.from({ length: 12 }, (_, i) => i + 1)

  const staticBase = baseVars
    .map((i) => `  --color-${colorName}-${i}: var(--${colorName}-${i});`)
    .join('\n')
  const staticAlpha = baseVars
    .map((i) => `  --color-${colorName}-a${i}: var(--${colorName}-a${i});`)
    .join('\n')

  const lightBase = baseVars
    .map((i) => `  --${colorName}-${i}: ${light[`${colorName}${i}`]};`)
    .join('\n')
  const lightAlpha = baseVars
    .map((i) => `  --${colorName}-a${i}: ${light[`${colorName}A${i}`]};`)
    .join('\n')

  const darkBase = baseVars
    .map((i) => `  --${colorName}-${i}: ${dark[`${colorName}${i}`]};`)
    .join('\n')
  const darkAlpha = baseVars
    .map((i) => `  --${colorName}-a${i}: ${dark[`${colorName}A${i}`]};`)
    .join('\n')

  return `@theme static {
${staticBase}

${staticAlpha}
}

:root,
.light,
.light-theme {
${lightBase}

${lightAlpha}
}

.dark,
.dark-theme {
${darkBase}

${darkAlpha}
}
`
}
