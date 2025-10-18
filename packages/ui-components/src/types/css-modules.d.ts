/**
 * @file css-modules.d.ts
 * @description TypeScript type definitions for CSS Modules
 * @version 1.0.0
 * @date 2025-10-18
 */

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}
