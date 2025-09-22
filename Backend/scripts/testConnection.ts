// scripts/testConnection.ts
import dotenv from 'dotenv';
import pool from '../src/config/database';

dotenv.config();

async function testConnection() {
  try {
    console.log('🔍 Testando conexão com o banco de dados...');
    
    const client = await pool.connect();
    console.log('✅ Conexão com PostgreSQL estabelecida com sucesso!');
    
    // Testar uma query simples
    const result = await client.query('SELECT version()');
    console.log('📊 Versão do PostgreSQL:', result.rows[0].version);
    
    client.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao conectar com o banco de dados:', error);
    process.exit(1);
  }
}

testConnection();