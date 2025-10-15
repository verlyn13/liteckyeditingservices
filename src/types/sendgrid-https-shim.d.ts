// Shim to satisfy @sendgrid/helpers type declarations during typecheck in non-Node runtimes
declare module 'https' {
  const value: any;
  export = value;
}
