// src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente PRIMEIRO
dotenv.config();

// Importar configurações DEPOIS do dotenv.config()
import { config, corsOptions, initDatabase, validateConfig, pool } from './config';
import routes from './routes';

// Validar configurações
validateConfig();

const app = express();

// Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan(config.logLevel));
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
    // Tratamento de erro seguro para TypeScript
    let errorMessage = 'Erro desconhecido';
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = String((error as any).message);
    }
    
    console.error('Health check error:', error);
    
    res.status(500).json({ 
      status: 'Error', 
      database: 'Disconnected',
      error: errorMessage,
      timestamp: new Date().toISOString()
    });
  }
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
    });
  } catch (error) {
    console.error('❌ Falha ao iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();

export default app;