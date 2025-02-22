declare interface Window {
  /** Loading bar instance */
  $loadingBar?: import('naive-ui').LoadingBarProviderInst
  /** Dialog instance */
  $dialog?: import('naive-ui').DialogProviderInst
  /** Message instance */
  $message?: import('naive-ui').MessageProviderInst
  /** Notification instance */
  $notification?: import('naive-ui').NotificationProviderInst
  $modal?: import('naive-ui').ModalProviderInst
}

declare namespace Env {
  /** Interface for import.meta */
  interface ImportMeta extends ImportMetaEnv {
    readonly VITE_GLOB_API_URL: string //API 接口地址
    readonly VITE_GLOB_API_URL_PREFIX: string // 接口前缀
    readonly VITE_GLOB_IMG_URL: string // 图片前缀地址
    readonly VITE_GLOB_ROUTER_PREFIX: string // 路由前缀
    readonly VITE_BASE_URL: string //项目 base
    readonly VITE_GITHUB: string //
    readonly VITE_GLOB_ROUTER_FN: 'history' | 'hash'
    readonly VITE_VISUZLIZER: boolean
  }
}

interface ImportMeta {
  readonly env: Env.ImportMeta
}

type CssStyle = import('vue').CSSProperties

type TagType = 'default' | 'success' | 'error' | 'warning' | 'primary' | 'info'
