import type { ConfigEnv, Plugin, PluginOption, UserConfig } from 'vite'
import { loadEnv } from 'vite'
import { resolve } from 'path'
import pkg from './package.json'
import { format } from 'date-fns'
import { createHtmlPlugin } from 'vite-plugin-html'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import compressPlugin from 'vite-plugin-compression'
// eslint-disable-next-line import/no-unresolved
import Components from 'unplugin-vue-components/vite'
// eslint-disable-next-line import/no-unresolved
import { VantResolver } from 'unplugin-vue-components/resolvers'

const { dependencies, devDependencies, name, version } = pkg

const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
}

export default ({ command, mode }: ConfigEnv): UserConfig => {
  const viteEnv = loadViteEnv(mode)
  const isBuild = command === 'build'
  return {
    base: viteEnv.VITE_PUBLIC_PATH,
    esbuild: {},
    resolve: {
      alias: [
        { find: '@', replacement: resolve(__dirname, './src') },
        { find: '@typings', replacement: resolve(__dirname, './typings') }
      ],
      dedupe: ['vue']
    },
    plugins: createVitePlugins(viteEnv, isBuild),
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__)
    },
    css: {
      preprocessorOptions: {
        scss: {
          modifyVars: {},
          javascriptEnabled: true,
          additionalData: `@import "src/styles/var.scss";`
        }
      }
    },
    server: {
      host: true,
      port: 3100,
      proxy: {
        '/api': {
          target: '',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/api/v1')
        }
      }
    },
    optimizeDeps: {
      include: ['vant', '@vant/touch-emulator'],
      exclude: ['vue-demi']
    },
    build: {
      target: 'es2015',
      outDir: 'dist',
      minify: 'terser',
      terserOptions: {
        compress: {
          keep_infinity: true,
          drop_console: viteEnv.VITE_DROP_CONSOLE,
          drop_debugger: viteEnv.VITE_DROP_DEBUGGER
        }
      },
      brotliSize: false,
      chunkSizeWarningLimit: 2000
    }
  }
}

// Read all environment variable configuration files to process.env
function loadViteEnv(mode: string): ViteEnv {
  const root = process.cwd()
  const envConf = loadEnv(mode, root)

  const ret: any = {}

  for (const envName of Object.keys(envConf)) {
    const envValue = envConf[envName].replace(/\\n/g, '\n')
    ret[envName] = envValue === 'true' ? true : envValue === 'false' ? false : envValue
    // process.env[envName] = viteEnvValue
  }
  return ret
}

export function createVitePlugins(viteEnv: ViteEnv, isBuild: boolean) {
  const vitePlugins: (Plugin | Plugin[] | PluginOption | PluginOption[])[] = [
    // have to
    vue(),
    vueJsx(),
    Components({
      resolvers: [VantResolver()]
    })
  ]

  // vite-plugin-html
  vitePlugins.push(configHtmlPlugin(viteEnv))

  if (isBuild) {
    // rollup-plugin-gzip
    vitePlugins.push(
      configCompressPlugin(
        viteEnv.VITE_BUILD_COMPRESS,
        viteEnv.VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE
      )
    )
  }

  return vitePlugins
}

export function configHtmlPlugin(env: ViteEnv) {
  const { VITE_APP_TITLE } = env

  return createHtmlPlugin({
    inject: {
      // Inject data into ejs template
      data: {
        title: VITE_APP_TITLE
      }
    }
  })
}

export function configCompressPlugin(
  compress: 'gzip' | 'brotli' | 'none',
  deleteOriginFile = false
): Plugin | Plugin[] {
  const compressList = compress.split(',')

  const plugins: Plugin[] = []

  if (compressList.includes('gzip')) {
    plugins.push(
      compressPlugin({
        ext: '.gz',
        deleteOriginFile
      })
    )
  }
  if (compressList.includes('brotli')) {
    plugins.push(
      compressPlugin({
        ext: '.br',
        algorithm: 'brotliCompress',
        deleteOriginFile
      })
    )
  }
  return plugins
}
