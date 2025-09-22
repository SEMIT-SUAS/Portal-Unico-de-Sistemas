// src/config/database.ts
import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Configuração do pool de conexões
const dbConfig: PoolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'PUS',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};

// Criar uma instância do pool de conexões
const pool = new Pool(dbConfig);

// Eventos do pool para debug
pool.on('connect', () => {
  console.log('✅ Conectado ao banco de dados PostgreSQL PUS');
});

pool.on('error', (err) => {
  console.error('❌ Erro inesperado no cliente do banco de dados:', err);
  process.exit(-1);
});

// Testar a conexão ao inicializar
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Conexão com o banco PUS testada com sucesso');
    client.release();
  } catch (error) {
    console.error('❌ Erro ao conectar com o banco PUS:', error);
    process.exit(1);
  }
};

// Executar teste de conexão se não estiver em teste
if (process.env.NODE_ENV !== 'test') {
  testConnection();
}

export default pool;