// so the typescript compiler doesn't complain about the global config object
declare var config: any;

declare module '*.json' {
  const value: any;
  export default value;
}

declare module 'json!*' {
  const value: any;
  export default value;
}
