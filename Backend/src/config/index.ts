// src/config/index.ts
export { default as pool } from './database';
export { default as config, validateConfig } from './app';
export { default as corsOptions } from './cors';
export { default as initDatabase } from './initDatabase';

// Exportar todas as configurações
export * from './app';