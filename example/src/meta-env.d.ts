/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLERK_PUBLISHABLE_KEY: string;
  readonly VITE_INSTANTDB_APP_ID: string;
  readonly VITE_CLERK_CLIENT_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
