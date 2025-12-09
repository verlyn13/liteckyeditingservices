/// <reference types="vite/client" />

/**
 * Augment Vite's import.meta.env with custom environment variables
 */

declare global {
  interface ImportMetaEnv {
    /** Vite built-in: 'development' | 'production' */
    readonly MODE: string;
    /** Vite built-in: true in dev mode, false otherwise */
    readonly DEV: boolean;
    /** Vite built-in: true in production mode, false otherwise */
    readonly PROD: boolean;

    // Postal Email
    /** Postal API key for email delivery (secret) */
    readonly POSTAL_API_KEY?: string;
    /** Postal from email address (public) */
    readonly POSTAL_FROM_EMAIL?: string;
    /** Postal recipient email address (public) */
    readonly POSTAL_TO_EMAIL?: string;

    // Cal.com Integration
    /** Cal.com API key for programmatic access (secret) */
    readonly CALCOM_API_KEY: string;
    /** Cal.com webhook secret for signature verification (secret) */
    readonly CALCOM_WEBHOOK_SECRET: string;
    /** Cal.com embed URL for inline scheduling widget (public) */
    readonly PUBLIC_CALCOM_EMBED_URL: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

// Make this a module to allow declare global
export {};
