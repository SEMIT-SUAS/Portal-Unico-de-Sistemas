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

// Importar módulo net para verificação de porta
import * as net from 'net';

// Função para verificar se a porta está disponível
const isPortAvailable = (port: number): Promise<boolean> => {
  return new Promise((resolve) => {
    const tester = net.createServer()
      .once('error', (err: any) => {
        if (err.code === 'EADDRINUSE') {
          console.log(`❌ Porta ${port} está ocupada`);
          resolve(false);
        } else {
          resolve(false);
        }
      })
      .once('listening', () => {
        tester.once('close', () => resolve(true)).close();
      })
      .listen(port);
  });
};

// Função para encontrar porta disponível
const findAvailablePort = async (startPort: number, maxAttempts: number = 10): Promise<number> => {
  for (let port = startPort; port <= startPort + maxAttempts; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
    console.log(`🔄 Tentando porta ${port + 1}...`);
  }
  throw new Error(`❌ Não foi possível encontrar porta disponível após ${maxAttempts} tentativas`);
};

// Inicializar servidor com tratamento de porta
const startServer = async () => {
  try {
    await initDatabase();
    
    const desiredPort = config.port;
    const actualPort = await findAvailablePort(desiredPort);
    
    if (actualPort !== desiredPort) {
      console.log(`⚠️  Porta ${desiredPort} ocupada. Usando porta ${actualPort}...`);
    }
    
    app.listen(actualPort, () => {
      console.log(`\n🚀 Servidor rodando na porta ${actualPort}`);
      console.log(`✅ ROTA DE DOWNLOADS DISPONÍVEL: POST http://localhost:${actualPort}/api/systems/1/increment-downloads`);
      console.log(`✅ ROTA DE ACESSOS DISPONÍVEL: POST http://localhost:${actualPort}/api/systems/1/increment-access`);
      console.log(`🔍 Health check: http://localhost:${actualPort}/health\n`);
      
      // Salvar a porta atual em uma variável global para uso futuro
      (global as any).actualPort = actualPort;
    });
    
  } catch (error) {
    console.error('❌ Falha ao iniciar servidor:', error);
    
    // Tentativa de fallback - matar processo na porta e tentar novamente
    if (error instanceof Error && error.message.includes('Não foi possível encontrar porta disponível')) {
      console.log('🔄 Tentando solução alternativa...');
      try {
        const { execSync } = require('child_process');
        console.log('🔫 Matando processo na porta 3001...');
        execSync('npx kill-port 3001', { stdio: 'inherit' });
        
        // Aguardar e tentar novamente
        setTimeout(() => {
          console.log('🔄 Reiniciando servidor...');
          app.listen(config.port, () => {
            console.log(`\n🚀 Servidor rodando na porta ${config.port} (após limpeza)`);
          });
        }, 2000);
      } catch (fallbackError) {
        console.error('❌ Falha na solução alternativa:', fallbackError);
        process.exit(1);
      }
    } else {
      process.exit(1);
    }
  }
};

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🔴 Recebido SIGINT. Encerrando servidor...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🔴 Recebido SIGTERM. Encerrando servidor...');
  process.exit(0);
});

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
  console.error('💥 Erro não capturado:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Promise rejeitada não tratada:', reason);
  process.exit(1);
});

startServer();

export default app;