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
import pool from './config/database';
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

// ✅ DEBUG: Middleware para log de todas as requisições
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.originalUrl}`);
  next();
});

console.log('\n🔄 INICIANDO REGISTRO DE ROTAS...');

// ✅ ROTA DIRETA DE DOWNLOADS (ANTES de tudo para garantir funcionamento)
app.post('/api/systems/:id/increment-downloads', async (req, res) => {
  let client;
  try {
    client = await pool.connect();
    const id = parseInt(req.params.id);
    console.log('✅✅✅ ROTA DIRETA DE DOWNLOADS CHAMADA! ID:', id);
    
    // ✅ VERIFICAR SE O SISTEMA EXISTE
    const systemQuery = 'SELECT * FROM digital_systems WHERE id = $1';
    const systemResult = await client.query(systemQuery, [id]);
    
    if (systemResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Sistema não encontrado'
      });
    }

    const currentSystem = systemResult.rows[0];
    const currentDownloads = currentSystem.downloads || 0;

    // ✅ INCREMENTAR NO BANCO DE DADOS REAL
    const updateQuery = `
      UPDATE digital_systems 
      SET downloads = downloads + 1, updated_at = NOW()
      WHERE id = $1
      RETURNING downloads, name
    `;
    
    const updateResult = await client.query(updateQuery, [id]);
    const newDownloadCount = updateResult.rows[0].downloads;
    const systemName = updateResult.rows[0].name;

    console.log(`📥 Download REAL contabilizado para ${systemName}`);
    console.log(`📊 De ${currentDownloads} para ${newDownloadCount} downloads`);
    
    res.json({ 
      success: true, 
      message: 'Download contabilizado no banco de dados!',
      systemId: id,
      systemName: systemName,
      previousCount: currentDownloads,
      newCount: newDownloadCount, // ✅ COUNT REAL DO BANCO
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro na rota direta:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao contabilizar download',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  } finally {
    if (client) client.release();
  }
});

// ✅ ROTA DIRETA PARA ACESSOS
app.post('/api/systems/:id/increment-access', async (req, res) => {
  let client;
  try {
    client = await pool.connect();
    const id = parseInt(req.params.id);
    console.log('🚀🚀🚀 ROTA DIRETA DE ACESSOS CHAMADA! ID:', id);
    
    // ✅ VERIFICAR SE O SISTEMA EXISTE
    const systemQuery = 'SELECT * FROM digital_systems WHERE id = $1';
    const systemResult = await client.query(systemQuery, [id]);
    
    if (systemResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Sistema não encontrado'
      });
    }

    const currentSystem = systemResult.rows[0];
    const currentAccesses = currentSystem.usage_count || 0;

    // ✅ DEBUG: Mostrar valores antes do update
    console.log('🔍 Valores antes do update:');
    console.log('   usage_count:', currentSystem.usage_count);
    console.log('   downloads:', currentSystem.downloads);
    console.log('   name:', currentSystem.name);

    // ✅ INCREMENTAR ACESSOS NO BANCO DE DADOS REAL
    const updateQuery = `
      UPDATE digital_systems 
      SET usage_count = usage_count + 1, updated_at = NOW()
      WHERE id = $1
      RETURNING usage_count, downloads, name
    `;
    
    const updateResult = await client.query(updateQuery, [id]);
    const newAccessCount = updateResult.rows[0].usage_count;
    const systemName = updateResult.rows[0].name;

    // ✅ DEBUG: Mostrar valores depois do update
    console.log('🔍 Valores depois do update:');
    console.log('   usage_count:', newAccessCount);
    console.log('   downloads:', updateResult.rows[0].downloads);

    console.log(`🚀 Acesso REAL contabilizado para ${systemName}`);
    console.log(`📈 De ${currentAccesses} para ${newAccessCount} acessos`);
    
    res.json({ 
      success: true, 
      message: 'Acesso contabilizado no banco de dados!',
      systemId: id,
      systemName: systemName,
      previousCount: currentAccesses,
      newCount: newAccessCount, // ✅ COUNT REAL DO BANCO
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro na rota de acessos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao contabilizar acesso',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  } finally {
    if (client) client.release();
  }
});

// Registrar rotas normais
app.use('/api', routes);

// ✅ Listar rotas manualmente para debug
console.log('\n🔍 ROTAS REGISTRADAS:');
console.log('POST /api/systems/:id/increment-downloads ✅ (Rota direta)');
console.log('POST /api/systems/:id/increment-access ✅ (Rota direta)');

// Rota de health check
app.get('/health', async (req, res) => {
  try {
    const client = await pool.connect();
    client.release();
    
    res.status(200).json({ 
      status: 'OK', 
      database: 'Connected',
      environment: config.nodeEnv,
      timestamp: new Date().toISOString(),
      downloadRoute: 'POST /api/systems/:id/increment-downloads ✅',
      accessRoute: 'POST /api/systems/:id/increment-access ✅'
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
    message: 'API do Portal Único de Sistemas - COM ROTAS DIRETAS',
    version: '1.0.0',
    downloadEndpoint: 'POST /api/systems/:id/increment-downloads ✅',
    accessEndpoint: 'POST /api/systems/:id/increment-access ✅'
  });
});

// Middleware de 404
app.use('*', (req, res) => {
  console.log(`❌ ROTA NÃO ENCONTRADA: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Rota não encontrada: ${req.method} ${req.originalUrl}`,
    availableRoutes: {
      download: 'POST /api/systems/:id/increment-downloads',
      access: 'POST /api/systems/:id/increment-access'
    }
  });
});

// Inicializar servidor
const startServer = async () => {
  try {
    await initDatabase();
    
    app.listen(config.port, () => {
      console.log(`\n🚀 Servidor rodando na porta ${config.port}`);
      console.log(`✅ ROTA DE DOWNLOADS DISPONÍVEL: POST http://localhost:${config.port}/api/systems/1/increment-downloads`);
      console.log(`✅ ROTA DE ACESSOS DISPONÍVEL: POST http://localhost:${config.port}/api/systems/1/increment-access`);
      console.log(`🔍 Health check: http://localhost:${config.port}/health\n`);
    });
  } catch (error) {
    console.error('❌ Falha ao iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();

export default app;