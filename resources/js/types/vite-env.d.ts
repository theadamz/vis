/// <reference types="vite/client" />

interface ImportMetaEnv {
    // general
    VITE_APP_NAME: string;
    VITE_TIMEZONE: string;
    VITE_LOCALE: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
