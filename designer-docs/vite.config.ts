import { defineConfig, transformWithEsbuild } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

const fromDocs = (path: string) => fileURLToPath(new URL(path, import.meta.url))

export default defineConfig({
  base: './',
  define: {
    __DEV__: JSON.stringify(true),
    global: 'globalThis',
  },
  plugins: [
    {
      name: 'react-native-svg-web-esm',
      enforce: 'pre',
      transform(code, id) {
        const cleanId = id.split('?')[0]

        if (
          cleanId.endsWith(
            '/react-native-svg/lib/module/lib/resolveAssetUri.js',
          )
        ) {
          return code.replace(
            "'@react-native/assets-registry/registry'",
            "'@react-native/assets-registry/registry.js?coin-esm'",
          )
        }

        if (
          cleanId.endsWith('/@react-native/assets-registry/registry.js')
        ) {
          return code.replace(
            'module.exports = {registerAsset, getAssetByID};',
            'export { registerAsset, getAssetByID };',
          )
        }

        if (
          cleanId.endsWith(
            '/react-native-svg/lib/module/lib/extract/extractTransform.js',
          )
        ) {
          return code
            .replace("from './transform';", "from './transform.js?coin-esm';")
            .replace(
              "from './transformToRn';",
              "from './transformToRn.js?coin-esm';",
            )
        }

        if (
          cleanId.endsWith(
            '/react-native-svg/lib/module/lib/extract/transform.js',
          )
        ) {
          return code.replace(
            /module\.exports\s*=\s*\{\s*SyntaxError:\s*peg\$SyntaxError,\s*parse:\s*peg\$parse\s*\};?/,
            'export { peg$SyntaxError as SyntaxError, peg$parse as parse };',
          )
        }

        if (
          cleanId.endsWith(
            '/react-native-svg/lib/module/lib/extract/transformToRn.js',
          )
        ) {
          return code.replace(
            /module\.exports\s*=\s*\{\s*StartRules:\s*\['start'\],\s*SyntaxError:\s*peg\$SyntaxError,\s*parse:\s*peg\$parse\s*\};?/,
            "export const StartRules = ['start']; export { peg$SyntaxError as SyntaxError, peg$parse as parse };",
          )
        }
      },
    },
    {
      name: 'jfs-static-require-imports',
      enforce: 'pre',
      transform(code, id) {
        if (id.includes('/jfs-components/')) {
          return code.replace(
            /const\s+(\w+)\s*=\s*require\((['"])(\.[^'"]+)\2\);?/g,
            "import $1 from '$3'",
          )
        }
      },
    },
    {
      name: 'react-native-jsx-in-js',
      enforce: 'pre',
      async transform(code, id) {
        const cleanId = id.split('?')[0]
        if (
          cleanId.includes('/react-native-reanimated/') &&
          /\.(?:js|jsx|ts|tsx)$/.test(cleanId)
        ) {
          const extension = cleanId.split('.').pop()
          const result = await transformWithEsbuild(code, id, {
            loader:
              extension === 'ts' || extension === 'tsx' ? 'tsx' : 'jsx',
            jsx: 'automatic',
          })
          return { code: result.code }
        }
      },
    },
    react(),
  ],
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: [
      {
        find: /^react-native-svg$/,
        replacement: fromDocs(
          './node_modules/react-native-svg/lib/module/ReactNativeSVG.web.js',
        ),
      },
      { find: /^react-native$/, replacement: 'react-native-web' },
      {
        find: /^react-native-reanimated$/,
        replacement: fromDocs('./src/web-stubs/reanimated.ts'),
      },
      {
        find: /^@react-native-community\/blur$/,
        replacement: fromDocs('./src/web-stubs/blur.tsx'),
      },
    ],
    extensions: [
      '.web.tsx',
      '.web.ts',
      '.web.jsx',
      '.web.js',
      '.tsx',
      '.ts',
      '.jsx',
      '.js',
    ],
  },
  optimizeDeps: {
    include: ['hoist-non-react-statics', 'invariant', 'invariant/browser'],
    exclude: [
      'jfs-components',
      'react-native',
      'react-native-reanimated',
      'react-native-svg',
      '@react-native-community/blur',
    ],
  },
})
