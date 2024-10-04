/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string;
  readonly NEXT_PUBLIC_INSTANTDB_APP_ID: string;
  readonly NEXT_PUBLIC_CLERK_CLIENT_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
