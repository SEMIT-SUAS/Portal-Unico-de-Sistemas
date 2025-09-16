// src/config/initDatabase.ts
import pool from './database';
import { config } from './app';

// Função para inicializar o banco de dados
export const initDatabase = async (): Promise<void> => {
  console.log('🔄 Inicializando banco de dados PUS...');
  
  try {
    // Testar conexão
    const client = await pool.connect();
    
    // Verificar se as tabelas existem
    const tablesCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'digital_systems'
      );
    `);
    
    if (!tablesCheck.rows[0].exists) {
      console.log('📦 Tabelas não encontradas. Executando script de inicialização...');
      
      // Aqui você pode executar scripts SQL para criar tabelas
      // ou importar de um arquivo .sql
      await runInitializationScript(client);
    }
    
    client.release();
    console.log('✅ Banco de dados PUS inicializado com sucesso');
    
  } catch (error) {
    console.error('❌ Erro ao inicializar banco de dados:', error);
    throw error;
  }
};

// Script de inicialização das tabelas
const runInitializationScript = async (client: any): Promise<void> => {
  try {
    // Executar scripts SQL para criar o schema
    await client.query('BEGIN');
    
    // 1. Criar tabela de secretarias
    await client.query(`
      CREATE TABLE IF NOT EXISTS secretaries (
        id SERIAL PRIMARY KEY,
        code VARCHAR(10) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // 2. Criar tabela de categorias
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        code VARCHAR(20) UNIQUE NOT NULL,
        name VARCHAR(50) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // 3. Criar tabela de sistemas digitais (principal)
    await client.query(`
      CREATE TABLE IF NOT EXISTS digital_systems (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        full_description TEXT,
        target_audience VARCHAR(50),
        responsible_secretary VARCHAR(10) REFERENCES secretaries(code),
        launch_year INTEGER,
        category VARCHAR(20) REFERENCES categories(code),
        is_highlight BOOLEAN DEFAULT FALSE,
        is_new BOOLEAN DEFAULT FALSE,
        icon_url TEXT,
        access_url TEXT,
        usage_count INTEGER DEFAULT 0,
        downloads INTEGER DEFAULT 0,
        rating NUMERIC(3,2) DEFAULT 0,
        reviews_count INTEGER DEFAULT 0,
        has_pwa BOOLEAN DEFAULT FALSE,
        pwa_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // 4. Criar tabela de características
    await client.query(`
      CREATE TABLE IF NOT EXISTS system_features (
        id SERIAL PRIMARY KEY,
        system_id INTEGER REFERENCES digital_systems(id) ON DELETE CASCADE,
        feature TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // 5. Criar tabela de avaliações
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_reviews (
        id SERIAL PRIMARY KEY,
        system_id INTEGER REFERENCES digital_systems(id) ON DELETE CASCADE,
        user_name VARCHAR(100) NOT NULL,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        date DATE DEFAULT CURRENT_DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // 6. Criar índices para performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_digital_systems_category ON digital_systems(category);
      CREATE INDEX IF NOT EXISTS idx_digital_systems_secretary ON digital_systems(responsible_secretary);
      CREATE INDEX IF NOT EXISTS idx_system_features_system ON system_features(system_id);
      CREATE INDEX IF NOT EXISTS idx_user_reviews_system ON user_reviews(system_id);
    `);
    
    await client.query('COMMIT');
    console.log('✅ Tabelas criadas com sucesso');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Erro ao criar tabelas:', error);
    throw error;
  }
};

export default initDatabase;