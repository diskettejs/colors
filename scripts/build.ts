import path from 'path'
import { buildThemes } from './build-color-themes.ts'

const defaultOutputDir = path.resolve(import.meta.dirname, '../dist')
const staticOutputDir = path.resolve(import.meta.dirname, '../dist/static')
buildThemes({ outputDir: defaultOutputDir, static: false })
buildThemes({ outputDir: staticOutputDir, static: true })
