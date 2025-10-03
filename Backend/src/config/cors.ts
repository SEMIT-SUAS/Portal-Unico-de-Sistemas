// src/config/cors.ts
import { CorsOptions } from 'cors';
import { config } from './app';

// Configurações CORS para sua aplicação
export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Em desenvolvimento, permitir localhost e sem origin (como Postman)
    if (config.nodeEnv === 'development') {
      // if (!origin || origin.includes('10.0.0.116') || origin.includes('127.0.0.1')) {
      if (!origin || origin.includes('sistemas.saoluis.ma.gov.br') || origin.includes('127.0.0.1')) {
        callback(null, true);
      } else {
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
        callback(null, true);
      } else {
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

export default corsOptions;