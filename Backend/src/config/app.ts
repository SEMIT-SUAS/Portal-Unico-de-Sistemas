// src/config/app.ts
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

// Interface para configurações da aplicação
export interface AppConfig {
  // Configurações do servidor
  port: number;
  nodeEnv: string;
  
  // Configurações do banco de dados
  database: {
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
    maxConnections: number;
  };
  
  // Configurações de segurança
  jwtSecret: string;
  corsOrigin: string;
  
  // Configurações de log
  logLevel: string;
}

// Configurações da aplicação
export const config: AppConfig = {
  // Servidor
  port: parseInt(process.env.PORT || '3001'),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Banco de dados
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    name: process.env.DB_NAME || 'PUS',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '20')
  },
  
  // Segurança
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret-change-in-production',
  // corsOrigin: process.env.CORS_ORIGIN || 'http://sistemas.saoluis.ma.gov.br:3000',
  corsOrigin: 'http://sistemas.saoluis.ma.gov.br',

  // Log
  logLevel: process.env.LOG_LEVEL || 'info'
};

// Validação básica das configurações
export const validateConfig = (): void => {
  const requiredEnvVars = [
    'DB_NAME',
    'DB_USER',
    'DB_PASSWORD'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error('❌ Variáveis de ambiente ausentes:', missingVars.join(', '));
    console.error('💡 Certifique-se de configurar o arquivo .env corretamente');
    process.exit(1);
  }

  if (config.nodeEnv === 'production' && config.jwtSecret === 'fallback-secret-change-in-production') {
    console.warn('⚠️  AVISO: Usando JWT secret padrão em produção. Isso é inseguro!');
  }
};

// Exportar configurações validadas
export default config;