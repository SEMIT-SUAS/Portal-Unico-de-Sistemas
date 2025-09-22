// src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente PRIMEIRO
dotenv.config();

// Importar configurações DEPOIS do dotenv.config()
import { config, validateConfig } from './config/app';
import { corsOptions } from './config/cors';
import { initDatabase } from './config/initDatabase';
import pool from './config/database'; // ✅ CORRIGIDO - import default
import routes from './routes/index';

// Validar configurações
validateConfig();

const app = express();

// Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api', routes);

// Rota de health check
app.get('/health', async (req, res) => {
  try {
    // Testar conexão com o banco
    const client = await pool.connect();
    client.release();
    
    res.status(200).json({ 
      status: 'OK', 
      database: 'Connected',
      environment: config.nodeEnv,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ 
      status: 'Error', 
      database: 'Disconnected',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      timestamp: new Date().toISOString()
    });
  }
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({ 
    message: 'API do Portal Único de Sistemas',
    version: '1.0.0',
    endpoints: {
      systems: '/api/systems',
      dashboard: '/api/dashboard',
      categories: '/api/categories',
      health: '/health'
    }
  });
});

// Inicializar servidor
const startServer = async () => {
  try {
    // Inicializar banco de dados
    await initDatabase();
    
    app.listen(config.port, () => {
      console.log(`🚀 Servidor rodando na porta ${config.port}`);
      console.log(`📊 Ambiente: ${config.nodeEnv}`);
      console.log(`🗄️  Banco de dados: ${config.database.name}`);
      console.log(`🌐 URL: http://localhost:${config.port}`);
      console.log(`🔍 Health check: http://localhost:${config.port}/health`);
    });
  } catch (error) {
    console.error('❌ Falha ao iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();

export default app;