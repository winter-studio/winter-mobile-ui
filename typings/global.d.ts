import type { ComponentPublicInstance, FunctionalComponent } from 'vue'

declare global {
  declare interface ViteEnv {
    VITE_USE_MOCK: boolean
    VITE_PUBLIC_PATH: string
    VITE_APP_TITLE: string
    VITE_APP_SHORT_NAME: string
    VITE_DROP_CONSOLE: boolean
    VITE_DROP_DEBUGGER: boolean
    VITE_APP_IMG_URL: string
    VITE_BUILD_COMPRESS: 'gzip' | 'brotli' | 'none'
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE: boolean
  }
}

declare module 'vue' {
  export type JSXComponent<Props = any> =
    | { new (): ComponentPublicInstance<Props> }
    | FunctionalComponent<Props>
}
