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
		/** Optional flag to force real SendGrid sends even in dev mode */
		readonly SENDGRID_FORCE_SEND?: string;
	}

	interface ImportMeta {
		readonly env: ImportMetaEnv;
	}
}

// Make this a module to allow declare global
export {};
