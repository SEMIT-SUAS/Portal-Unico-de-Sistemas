// src/config/index.ts

// Exportar todas as configurações individualmente
export { default as pool } from './database';
export { default as config, validateConfig } from './app';
export { default as corsOptions } from './cors';
export { default as initDatabase } from './initDatabase';

// Re-exportar tudo do app.ts para acesso direto
export * from './app';