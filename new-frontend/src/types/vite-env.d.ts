/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_DESCRIPTION: string
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_ENABLE_DARK_MODE: string
  readonly VITE_ENABLE_NOTIFICATIONS: string
  readonly VITE_ENABLE_DEBUG_MODE: string
  readonly VITE_ENABLE_MOCK_DATA: string
  readonly VITE_DUMMY_ACCESS_TOKEN: string
  readonly VITE_DUMMY_REFRESH_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
