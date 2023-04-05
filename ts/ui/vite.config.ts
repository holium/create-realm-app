import { loadEnv, defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react-swc'
import { urbitPlugin } from '@holium/vite-plugin-urbit'

// https://vitejs.dev/config/
export default async ({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd()))
  const SHIP_URL =
    process.env.SHIP_URL || process.env.VITE_SHIP_URL || 'http://localhost:8080'
  console.log(SHIP_URL)

  return await defineConfig({
    mode: process.env.NODE_ENV,
    build: {
      target: 'esnext',
      minify: true,
      sourcemap: false,
      manifest: false,
    },
    resolve: {
      alias: {
        react: path.resolve('./node_modules/react'),
        'react-dom': path.resolve('./node_modules/react-dom'),
      },
    },
    server: {
      port: process.env.VITE_PORT ? parseInt(process.env.VITE_PORT) : 3000,
      fs: {
        allow: ['../'],
      },
    },
    plugins: [
      urbitPlugin({ base: '%APPSLUG%', target: SHIP_URL, secure: false }),
      react(),
    ],
  })
}
