import { CorsOptions } from 'cors';
import { config } from './app';

// Configurações CORS para sua aplicação
export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    console.log('🌐 [CORS] Origin recebida:', origin);
    
    // Em desenvolvimento, permitir localhost e sem origin (como Postman)
    if (config.nodeEnv === 'development') {
      const allowedDevOrigins = [
        'http://localhost:3000',
        'http://127.0.0.1:3000', 
        'http://localhost:3001',
        'http://127.0.0.1:3001',
        'http://10.0.0.116:3000',
        'http://10.0.0.116:3001',
        'https://sistemas.saoluis.ma.gov.br',
        'http://sistemas.saoluis.ma.gov.br'
      ];
      
      if (!origin || allowedDevOrigins.includes(origin)) {
        console.log('✅ [CORS] Origin permitida (dev):', origin);
        callback(null, true);
      } else {
        console.log('❌ [CORS] Origin bloqueada (dev):', origin);
        callback(new Error('Não permitido por CORS'));
      }
    } 
    // Em produção, permitir apenas domínios específicos
    else {
      const allowedOrigins = [
        config.corsOrigin,
        'https://sistemas.saoluis.ma.gov.br',
        'http://sistemas.saoluis.ma.gov.br'
      ];
      
      if (origin && allowedOrigins.includes(origin)) {
        console.log('✅ [CORS] Origin permitida (prod):', origin);
        callback(null, true);
      } else {
        console.log('❌ [CORS] Origin bloqueada (prod):', origin);
        callback(new Error('Não permitido por CORS'));
      }
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin'
  ]
};

// ✅ ALTERNATIVA PARA TESTES RÁPIDOS (descomente se a acima não funcionar):
export const corsOptionsDev: CorsOptions = {
  origin: true, // Permite TODAS as origens (apenas para desenvolvimento)
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
};

export default corsOptions;