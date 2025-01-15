'use server'

import CleanCss from 'clean-css'
import { minify as minifyHtml } from 'html-minifier-terser'
import { minify as minifyXml } from 'minify-xml'
import { optimize as optimizeSvg } from 'svgo'
import { minify as minifyJs } from 'terser'
import { transpileModule, ModuleKind } from 'typescript'

export async function minifyHtmlAction(data: FormData) {
  const rawCode = data.get('code')?.toString() || ''

  const minifierOptions = {
    collapseWhitespace: true,
    minifyCSS: true,
    minifyJS: true,
    removeComments: true,
  }

  return minifyHtml(rawCode, minifierOptions)
}

export async function minifyCssAction(data: FormData) {
  const rawCode = data.get('code')?.toString() || ''

  const minifier = new CleanCss({
    level: 2,
  })

  return Promise.resolve(minifier.minify(rawCode).styles)
}

export async function minifyJsonAction(data: FormData) {
  const rawCode = data.get('code')?.toString() || ''

  return Promise.resolve(JSON.stringify(JSON.parse(rawCode)))
}

export async function minifySvgAction(data: FormData) {
  const rawCode = data.get('code')?.toString() || ''

  return Promise.resolve(optimizeSvg(rawCode, { multipass: true }).data)
}

export async function minifyTypescriptAction(data: FormData) {
  const rawCode = data.get('code')?.toString() || ''

  // 1. Compile TypeScript to JavaScript using tsc
  const jsCode = transpileModule(rawCode, {
    compilerOptions: {
      module: ModuleKind.ESNext, // Use ESNext or a suitable module kind
    },
  }).outputText

  // 2. Minify the resulting JavaScript with Terser
  const result = await minifyJs(jsCode, {
    compress: true,
    format: {
      comments: false,
    },
    mangle: {
      toplevel: true,
    },
  })

  return result.code || ''
}

export async function minifyXmlAction(data: FormData) {
  const rawCode = data.get('code')?.toString() || ''

  return Promise.resolve(minifyXml(rawCode))
}
