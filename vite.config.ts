import { defineConfig, transformWithEsbuild } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',
  define: {
    __DEV__: JSON.stringify(true),
  },
  plugins: [
    {
      name: 'jfs-static-require-imports',
      enforce: 'pre',
      transform(code, id) {
        if (id.includes('/jfs-components/src/')) {
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
          return transformWithEsbuild(code, id, {
            loader:
              extension === 'ts' || extension === 'tsx'
                ? 'tsx'
                : 'jsx',
            jsx: 'automatic',
          })
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
        replacement: '/src/web-stubs/svg.tsx',
      },
      { find: /^react-native$/, replacement: 'react-native-web' },
      {
        find: /^react-native-reanimated$/,
        replacement: '/src/web-stubs/reanimated.ts',
      },
      {
        find: /^@react-native-community\/blur$/,
        replacement: '/src/web-stubs/blur.tsx',
      },
    ],
    extensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.tsx', '.ts', '.jsx', '.js'],
  },
  optimizeDeps: {
    exclude: ['react-native', 'react-native-reanimated', 'react-native-svg'],
  },
})
