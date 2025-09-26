export interface DigitalSystem {
  id: string;
  name: string;
  description: string;
  fullDescription: string;
  targetAudience: string;
  responsibleSecretary: string;
  launchYear: number;
  mainFeatures: string[];
  category: 'novidades' | 'destaques' | 'mais-usados' | 'cidadao' | 'interno' | 'por-secretaria' | 'inativos'; // Adicione 'inativos'
  isHighlight?: boolean;
  isNew?: boolean;
  iconUrl?: string;
  accessUrl?: string;
  usageCount?: number;
  downloads?: number;
  rating?: number;
  reviewsCount?: number;
  userReviews?: UserReview[];
  hasPWA?: boolean;
  pwaUrl?: string;
  developer?: string;
  createdAt: string;
  updatedAT: string;
  isActive?: boolean; // Adicione esta propriedade
}

export interface UserReview {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export const digitalSystems: DigitalSystem[] = [
  {
    id: 'sae',
    name: 'SAE – Selo e Autenticação Eletrônica',
    description: 'Autenticação de documentos digitais sem ICP-Brasil, via login e senha.',
    fullDescription: 'Sistema de autenticação eletrônica que permite validar documentos digitais sem necessidade de certificado ICP-Brasil, utilizando apenas login e senha seguros.',
    targetAudience: 'Interno e cidadão',
    responsibleSecretary: 'SEMUS/SEMIT',
    launchYear: 2025,
    mainFeatures: [
      'Carimbo digital oficial',
      'Registro de status do documento',
      'Login seguro'
    ],
    category: 'novidades',
    isNew: true,
    isHighlight: true,
    iconUrl: 'https://images.unsplash.com/photo-1658825473738-a56b08976bbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwc2VydmljZXMlMjBwb3J0YWx8ZW58MXx8fHwxNzU3Njg0NDEzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    accessUrl: 'https://sae.prefeituradesaoluis.com.br',
    downloads: 1250,
    rating: 4.2,
    reviewsCount: 45,
    hasPWA: true,
    pwaUrl: 'https://sae.prefeituradesaoluis.com.br/app',
    developer: 'SEMUS - Equipe de Desenvolvimento ',
    userReviews: [
      {
        id: '1',
        userName: 'João Silva',
        rating: 5,
        comment: 'Excelente sistema! A autenticação é muito segura e fácil de usar.',
        date: '2025-01-15'
      },
      {
        id: '2',
        userName: 'Maria Santos',
        rating: 4,
        comment: 'Muito útil para validar documentos digitais. Interface poderia ser mais intuitiva.',
        date: '2025-01-10'
      }
    ]
  },
  {
    id: 'espaco-tea',
    name: 'Espaço TEA – Aplicativo Inclusivo',
    description: 'Aplicativo inclusivo para atendimento a crianças com TEA.',
    fullDescription: 'Aplicativo desenvolvido especialmente para facilitar o atendimento e acompanhamento de crianças com Transtorno do Espectro Autista (TEA).',
    targetAudience: 'Cidadãos',
    responsibleSecretary: 'SEMUS',
    launchYear: 2024,
    mainFeatures: [
      'Cadastro de usuários',
      'Registro de terapias',
      'Integração com profissionais'
    ],
    category: 'novidades',
    isNew: true,
    isHighlight: true,
    iconUrl: 'https://images.unsplash.com/photo-1591608517093-3bb6aa9efe35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtb2JpbGUlMjBhcHAlMjBoZWFsdGhjYXJlfGVufDF8fHx8MTc1NzY2NDE0MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    accessUrl: 'https://www.saoluis.ma.gov.br/espacotea',
    downloads: 8500,
    rating: 4.7,
    reviewsCount: 125,
    hasPWA: true,
    pwaUrl: 'https://www.saoluis.ma.gov.br/espacotea/pwa',
    userReviews: [
      {
        id: '1',
        userName: 'Ana Paula',
        rating: 5,
        comment: 'Aplicativo incrível! Ajudou muito no acompanhamento do meu filho.',
        date: '2025-01-12'
      },
      {
        id: '2',
        userName: 'Carlos Eduardo',
        rating: 5,
        comment: 'Interface amigável e funcionalidades muito úteis para famílias com TEA.',
        date: '2025-01-08'
      }
    ]
  },
  {
    id: 'sigep',
    name: 'SIGEP – Gestão de Processos',
    description: 'Gestão de processos administrativos digitais.',
    fullDescription: 'Sistema integrado de gestão de processos administrativos que digitaliza e automatiza o fluxo de documentos entre as secretarias municipais.',
    targetAudience: 'Servidores',
    responsibleSecretary: 'SEMIT',
    launchYear: 2018,
    mainFeatures: [
      'Protocolização digital',
      'Tramitação intersecretarias',
      'Histórico e logs'
    ],
    category: 'destaques',
    isHighlight: true,
    iconUrl: 'https://images.unsplash.com/photo-1695473507904-130cd7ba9d7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwcHJvY2VzcyUyMG1hbmFnZW1lbnR8ZW58MXx8fHwxNzU3Njg0NDEzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    accessUrl: 'https://sigep.saoluis.ma.gov.br',
    usageCount: 8500,
    downloads: 2500,
    rating: 4.1,
    reviewsCount: 89,
    hasPWA: false,
    userReviews: [
      {
        id: '1',
        userName: 'Pedro Almeida',
        rating: 4,
        comment: 'Sistema robusto, mas às vezes é lento durante picos de uso.',
        date: '2025-01-05'
      }
    ]
  },
  {
    id: 'dashboard-cameras',
    name: 'Dashboard de Câmeras Municipais',
    description: 'Monitoramento em tempo real das câmeras públicas.',
    fullDescription: 'Sistema de monitoramento integrado que permite acompanhar em tempo real todas as câmeras de segurança instaladas nos espaços públicos municipais.',
    targetAudience: 'Uso interno',
    responsibleSecretary: 'SEMIT / Guarda Municipal',
    launchYear: 2021,
    mainFeatures: [
      'Acesso a múltiplos streams',
      'Dashboards em tempo real',
      'Controle de estabilidade de vídeo'
    ],
    category: 'destaques',
    isHighlight: true,
    iconUrl: 'https://images.unsplash.com/photo-1599350686877-382a54114d2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWN1cml0eSUyMGNhbWVyYSUyMGRhc2hib2FyZHxlbnwxfHx8fDE3NTc2ODQ0MTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    accessUrl: 'https://cameras.saoluis.ma.gov.br',
    downloads: 450,
    rating: 4.5,
    reviewsCount: 23,
    hasPWA: false,
    userReviews: [
      {
        id: '1',
        userName: 'Marcos Silva',
        rating: 5,
        comment: 'Ferramenta essencial para o trabalho da Guarda Municipal.',
        date: '2025-01-03'
      }
    ]
  },
  {
    id: 'comercio-legal',
    name: 'Comércio Legal',
    description: 'Organização e sorteio de ambulantes em eventos públicos.',
    fullDescription: 'Sistema para cadastro, organização e sorteio eletrônico de vendedores ambulantes para eventos públicos da cidade.',
    targetAudience: 'Cidadãos (ambulantes)',
    responsibleSecretary: 'SEMAPA',
    launchYear: 2022,
    mainFeatures: [
      'Cadastro de vendedores',
      'Sorteio eletrônico',
      'Emissão de comprovante digital'
    ],
    category: 'mais-usados',
    iconUrl: 'https://images.unsplash.com/photo-1658825473738-a56b08976bbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwc2VydmljZXMlMjBwb3J0YWx8ZW58MXx8fHwxNzU3Njg0NDEzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    accessUrl: 'https://comerciolegal.saoluis.ma.gov.br',
    usageCount: 12500,
    downloads: 3200,
    rating: 4.3,
    reviewsCount: 78,
    hasPWA: true,
    pwaUrl: 'https://comerciolegal.saoluis.ma.gov.br/app',
    userReviews: [
      {
        id: '1',
        userName: 'Lucia Ferreira',
        rating: 4,
        comment: 'Ajudou muito a organizar meu trabalho nos eventos. Sorteio é justo.',
        date: '2024-12-28'
      }
    ]
  },
  // ... continue com os demais sistemas atualizando as URLs
];

export const categories = {
  'novidades': 'Novidades',
  'destaques': 'Destaques',
  'mais-usados': 'Mais Usados',
  'cidadao': 'Para o Cidadão',
  'interno': 'Para Uso Interno',
  'por-secretaria': 'Por Secretaria/Órgão',
  'inativos': 'Sistemas Inativos' // Adicione esta linha
};

export const departmentCategories = {
  'saude': 'Saúde',
  'educacao': 'Educação',
  'assistencia-social': 'Assistência Social',
  'meio-ambiente': 'Meio Ambiente',
  'fazenda-financas': 'Fazenda e Finanças',
  'planejamento': 'Planejamento',
  'tecnologia': 'Tecnologia',
  'transito-transporte': 'Trânsito e Transporte',
  'cultura': 'Cultura',
  'urbanismo': 'Urbanismo e Habitação'
};

export const secretaries = {
  'SEMUS': 'Secretaria Municipal de Saúde',
  'SEMIT': 'Secretaria Municipal de Informação e Tecnologia',
  'SEMURH': 'Secretaria Municipal de Urbanismo e Habitação',
  'SEPLAN': 'Secretaria Municipal de Planejamento',
  'SEMFAZ': 'Secretaria Municipal da Fazenda',
  'SEMAPA': 'Secretaria Municipal de Meio Ambiente e Proteção Animal',
  'SEMED': 'Secretaria Municipal de Educação',
  'SEMTT': 'Secretaria Municipal de Trânsito e Transporte',
  'SECULT': 'Secretaria Municipal de Cultura',
  'SEMAS': 'Secretaria Municipal de Assistência Social'
};