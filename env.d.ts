/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_URL: string;
  readonly VITE_CLIENT_ID: string;
  readonly VITE_CLIENT_SECRET: string;
  readonly VITE_ORIGIN_AGENCY: string;
  readonly VITE_VIETQR_URL: string;
  readonly VITE_VIETQR_TEMPLATE: string;
  readonly VITE_LINK_APP_DESKTOP: string;
  readonly VITE_LINK_APP_MOBILE: string;
  readonly VITE_SITE_KEY: string;
  readonly VITE_IS_USE_RECAPTCHA: boolean;
  readonly VITE_LINK_DOCUMENT_API: string;
  readonly VITE_LINK_DOCUMENT_API_DETAIL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
