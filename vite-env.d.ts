/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
  readonly VITE_DEV_HOST: string;
  readonly VITE_DEV_PORT: string;
  readonly VITE_DEV_BASE_API: string;
  readonly VITE_DEV_SERVER_URL: string;
  readonly VITE_PROD_HOST: string;
  readonly VITE_PROD_PORT: string;
  readonly VITE_PROD_BASE_API: string;
  readonly VITE_PROD_SERVER_URL: string;
  // 更多环境变量...
}

declare module 'dayjs-plugin-utc';
