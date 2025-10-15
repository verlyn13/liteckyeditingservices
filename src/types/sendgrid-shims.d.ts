// Broad shims to avoid Node core deps during TS typecheck in edge-first projects.
declare module '@sendgrid/helpers/*' {
  const anyExport: any;
  export = anyExport;
}

declare module '@sendgrid/mail' {
  const anyDefault: any;
  export default anyDefault;
  export type MailDataRequired = any;
  export type ClientResponse = any;
}
