import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Importar configurações
import { config, corsOptions, initDatabase, validateConfig } from './config';
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
      environment: config.nodeEnv
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'Error', 
      database: 'Disconnected',
      error: error.message 
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