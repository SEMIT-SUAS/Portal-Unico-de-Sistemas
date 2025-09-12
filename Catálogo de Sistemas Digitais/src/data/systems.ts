export interface DigitalSystem {
  id: string;
  name: string;
  description: string;
  fullDescription: string;
  targetAudience: string;
  responsibleSecretary: string;
  launchYear: number;
  mainFeatures: string[];
  category: 'novidades' | 'destaques' | 'mais-usados' | 'cidadao' | 'interno' | 'por-secretaria';
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
    accessUrl: '#',
    downloads: 1250,
    rating: 4.2,
    reviewsCount: 45,
    hasPWA: true,
    pwaUrl: '#',
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
    accessUrl: '#',
    downloads: 8500,
    rating: 4.7,
    reviewsCount: 125,
    hasPWA: true,
    pwaUrl: '#',
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
    accessUrl: '#',
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
    accessUrl: '#',
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
    accessUrl: '#',
    usageCount: 12500,
    downloads: 3200,
    rating: 4.3,
    reviewsCount: 78,
    hasPWA: true,
    pwaUrl: '#',
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
  {
    id: 'carta-servicos',
    name: 'Portal da Carta de Serviços',
    description: 'Portal de acesso aos serviços públicos da Prefeitura.',
    fullDescription: 'Portal centralizado que oferece acesso direto a todos os serviços públicos disponibilizados pela Prefeitura de São Luís aos cidadãos.',
    targetAudience: 'Cidadãos',
    responsibleSecretary: 'SEMIT',
    launchYear: 2020,
    mainFeatures: [
      'Busca por órgão/serviço',
      'Redirecionamento ao login',
      'Descrição completa dos serviços'
    ],
    category: 'mais-usados',
    isHighlight: true,
    iconUrl: 'https://images.unsplash.com/photo-1658825473738-a56b08976bbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwc2VydmljZXMlMjBwb3J0YWx8ZW58MXx8fHwxNzU3Njg0NDEzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    accessUrl: '#',
    usageCount: 15200,
    downloads: 5800,
    rating: 4.0,
    reviewsCount: 234,
    hasPWA: true,
    pwaUrl: '#',
    userReviews: [
      {
        id: '1',
        userName: 'Roberto Lima',
        rating: 4,
        comment: 'Portal muito útil para encontrar serviços. Poderia ter busca mais avançada.',
        date: '2024-12-25'
      }
    ]
  },
  {
    id: 'sao-luis-cidadao',
    name: 'São Luís Cidadão',
    description: 'App centralizador de serviços da Prefeitura.',
    fullDescription: 'Aplicativo mobile que centraliza todos os serviços digitais da Prefeitura de São Luís, oferecendo uma experiência unificada aos cidadãos.',
    targetAudience: 'Cidadãos',
    responsibleSecretary: 'SEMIT',
    launchYear: 2020,
    mainFeatures: [
      'Unificação de serviços',
      'Avaliação e ranking',
      'Atualizações regulares'
    ],
    category: 'mais-usados',
    iconUrl: 'https://images.unsplash.com/photo-1591608517093-3bb6aa9efe35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtb2JpbGUlMjBhcHAlMjBoZWFsdGhjYXJlfGVufDF8fHx8MTc1NzY2NDE0MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    accessUrl: '#',
    usageCount: 18900,
    downloads: 25000,
    rating: 4.6,
    reviewsCount: 1250,
    hasPWA: true,
    pwaUrl: '#',
    userReviews: [
      {
        id: '1',
        userName: 'Fernanda Costa',
        rating: 5,
        comment: 'App perfeito! Consigo acessar todos os serviços em um só lugar.',
        date: '2024-12-20'
      },
      {
        id: '2',
        userName: 'Antonio Ribeiro',
        rating: 4,
        comment: 'Muito prático, mas poderia ser mais rápido no carregamento.',
        date: '2024-12-18'
      },
      {
        id: '3',
        userName: 'Sandra Lima',
        rating: 5,
        comment: 'Interface muito intuitiva e todos os serviços estão organizados.',
        date: '2024-12-16'
      },
      {
        id: '4',
        userName: 'Paulo Santos',
        rating: 4,
        comment: 'Facilitou muito minha vida. Recomendo para todos os cidadãos.',
        date: '2024-12-14'
      },
      {
        id: '5',
        userName: 'Carla Mendes',
        rating: 5,
        comment: 'Excelente app! Finalmente todos os serviços em um lugar só.',
        date: '2024-12-12'
      }
    ]
  },
  {
    id: 'telemedicina-infantil',
    name: 'Telemedicina Infantil',
    description: 'Plataforma de atendimento médico remoto para crianças.',
    fullDescription: 'Sistema de telemedicina específico para atendimento pediátrico, permitindo consultas remotas e acompanhamento médico de crianças.',
    targetAudience: 'Uso interno',
    responsibleSecretary: 'SEMUS',
    launchYear: 2023,
    mainFeatures: [
      'Consultas remotas',
      'Prontuário eletrônico infantil',
      'Agendamento online'
    ],
    category: 'interno',
    iconUrl: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwc3lzdGVtJTIwaG9zcGl0YWx8ZW58MXx8fHwxNzU3NzAwNjA2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    accessUrl: '#',
    usageCount: 3200,
    downloads: 850,
    rating: 4.4,
    reviewsCount: 67,
    hasPWA: false,
    userReviews: [
      {
        id: '1',
        userName: 'Dra. Patricia',
        rating: 5,
        comment: 'Excelente para atendimento remoto. Interface muito profissional.',
        date: '2024-12-15'
      }
    ]
  },
  {
    id: 'reurb',
    name: 'Regularização Fundiária (Reurb)',
    description: 'Sistema para regularização de terrenos urbanos.',
    fullDescription: 'Plataforma digital para processos de regularização fundiária urbana, facilitando a legalização de propriedades.',
    targetAudience: 'Cidadãos',
    responsibleSecretary: 'SEMURH',
    launchYear: 2021,
    mainFeatures: [
      'Cadastro de imóveis',
      'Acompanhamento de processos',
      'Documentação digital'
    ],
    category: 'cidadao',
    iconUrl: 'https://images.unsplash.com/photo-1696578306635-85664fd15c6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwcGxhbm5pbmclMjB1cmJhbiUyMGRldmVsb3BtZW50fGVufDF8fHx8MTc1NzY0MDk4NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    accessUrl: '#',
    usageCount: 5600,
    downloads: 2100,
    rating: 3.8,
    reviewsCount: 156,
    hasPWA: true,
    pwaUrl: '#',
    userReviews: [
      {
        id: '1',
        userName: 'José Maria',
        rating: 4,
        comment: 'Processo ficou mais fácil, mas ainda há burocracia demais.',
        date: '2024-12-10'
      }
    ]
  },
  {
    id: 'orcamento-participativo',
    name: 'Orçamento Participativo',
    description: 'Participação cidadã no orçamento municipal.',
    fullDescription: 'Plataforma digital que permite aos cidadãos participar ativamente da definição de prioridades do orçamento municipal.',
    targetAudience: 'Cidadãos',
    responsibleSecretary: 'SEPLAN',
    launchYear: 2022,
    mainFeatures: [
      'Votação online',
      'Propostas da comunidade',
      'Transparência orçamentária'
    ],
    category: 'cidadao',
    iconUrl: 'https://images.unsplash.com/photo-1748439281934-2803c6a3ee36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNlJTIwYnVkZ2V0JTIwZGFzaGJvYXJkfGVufDF8fHx8MTc1NzcwMDYwNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    accessUrl: '#',
    usageCount: 7800,
    downloads: 4500,
    rating: 4.2,
    reviewsCount: 187,
    hasPWA: true,
    pwaUrl: '#',
    userReviews: [
      {
        id: '1',
        userName: 'Maria Clara',
        rating: 5,
        comment: 'Finalmente podemos participar das decisões da cidade!',
        date: '2024-12-08'
      }
    ]
  },
  {
    id: 'bi-ppa',
    name: 'BI PPA',
    description: 'Business Intelligence para Plano Plurianual.',
    fullDescription: 'Sistema de inteligência de negócios para análise e acompanhamento do Plano Plurianual municipal.',
    targetAudience: 'Uso interno',
    responsibleSecretary: 'SEPLAN',
    launchYear: 2020,
    mainFeatures: [
      'Dashboards analíticos',
      'Relatórios automatizados',
      'Indicadores de performance'
    ],
    category: 'interno',
    iconUrl: 'https://images.unsplash.com/photo-1748439281934-2803c6a3ee36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNlJTIwYnVkZ2V0JTIwZGFzaGJvYXJkfGVufDF8fHx8MTc1NzcwMDYwNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    accessUrl: '#',
    downloads: 120,
    rating: 4.1,
    reviewsCount: 15,
    hasPWA: false,
    userReviews: [
      {
        id: '1',
        userName: 'Analista SEPLAN',
        rating: 4,
        comment: 'Ferramenta poderosa para análise de dados do PPA.',
        date: '2024-12-05'
      }
    ]
  },
  {
    id: 'bi-renuncias',
    name: 'BI Consulta de Renúncias',
    description: 'Sistema de consulta de renúncias fiscais.',
    fullDescription: 'Plataforma de Business Intelligence para consulta e análise de renúncias fiscais municipais.',
    targetAudience: 'Uso interno',
    responsibleSecretary: 'SEMFAZ',
    launchYear: 2021,
    mainFeatures: [
      'Consulta de renúncias',
      'Análises fiscais',
      'Relatórios detalhados'
    ],
    category: 'interno',
    iconUrl: 'https://images.unsplash.com/photo-1748439281934-2803c6a3ee36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNlJTIwYnVkZ2V0JTIwZGFzaGJvYXJkfGVufDF8fHx8MTc1NzcwMDYwNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    accessUrl: '#',
    downloads: 85,
    rating: 3.9,
    reviewsCount: 12,
    hasPWA: false,
    userReviews: [
      {
        id: '1',
        userName: 'Auditor SEMFAZ',
        rating: 4,
        comment: 'Útil para análises fiscais, mas interface poderia ser melhor.',
        date: '2024-12-01'
      }
    ]
  },
  {
    id: 'monitoramento-horas',
    name: 'Monitoramento de Horas (Gather.town)',
    description: 'Controle de jornada de trabalho virtual.',
    fullDescription: 'Sistema integrado com Gather.town para monitoramento e controle de horas trabalhadas remotamente pelos servidores.',
    targetAudience: 'Uso interno',
    responsibleSecretary: 'SEMURH',
    launchYear: 2022,
    mainFeatures: [
      'Controle de ponto virtual',
      'Ambientes virtuais',
      'Relatórios de presença'
    ],
    category: 'interno',
    iconUrl: 'https://images.unsplash.com/photo-1658825473738-a56b08976bbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwc2VydmljZXMlMjBwb3J0YWw&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    accessUrl: '#',
    downloads: 320,
    rating: 3.7,
    reviewsCount: 28,
    hasPWA: false,
    userReviews: [
      {
        id: '1',
        userName: 'Servidor SEMURH',
        rating: 3,
        comment: 'Funciona bem, mas o ambiente virtual às vezes trava.',
        date: '2024-11-28'
      }
    ]
  },
  {
    id: 'cadastro-usuarios',
    name: 'Cadastro de Usuários Internos/Externos',
    description: 'Sistema de gestão de usuários e permissões.',
    fullDescription: 'Plataforma centralizada para cadastro e gestão de usuários internos e externos dos sistemas municipais.',
    targetAudience: 'Uso interno',
    responsibleSecretary: 'SEMIT',
    launchYear: 2019,
    mainFeatures: [
      'Gestão de usuários',
      'Controle de permissões',
      'Autenticação centralizada'
    ],
    category: 'interno',
    iconUrl: 'https://images.unsplash.com/photo-1658825473738-a56b08976bbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwc2VydmljZXMlMjBwb3J0YWx8ZW58MXx8fHwxNzU3Njg0NDEzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    accessUrl: '#',
    downloads: 180,
    rating: 4.0,
    reviewsCount: 25,
    hasPWA: false,
    userReviews: [
      {
        id: '1',
        userName: 'Admin SEMIT',
        rating: 4,
        comment: 'Sistema essencial para controle de acesso. Funciona bem.',
        date: '2024-11-25'
      }
    ]
  },
  {
    id: 'portal-transparencia',
    name: 'Portal da Transparência',
    description: 'Acesso a informações públicas municipais.',
    fullDescription: 'Portal que disponibiliza informações sobre gastos públicos, licitações, contratos e outras informações de transparência municipal.',
    targetAudience: 'Cidadãos',
    responsibleSecretary: 'SEMFAZ',
    launchYear: 2019,
    mainFeatures: [
      'Consulta de gastos públicos',
      'Acompanhamento de licitações',
      'Relatórios de transparência'
    ],
    category: 'cidadao',
    iconUrl: 'https://images.unsplash.com/photo-1748439281934-2803c6a3ee36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNlJTIwYnVkZ2V0JTIwZGFzaGJvYXJkfGVufDF8fHx8MTc1NzcwMDYwNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    accessUrl: '#',
    usageCount: 9500,
    downloads: 6200,
    rating: 4.3,
    reviewsCount: 298,
    hasPWA: true,
    pwaUrl: '#',
    userReviews: [
      {
        id: '1',
        userName: 'Jornalista São Luís',
        rating: 5,
        comment: 'Essencial para transparência pública. Dados sempre atualizados.',
        date: '2024-11-20'
      }
    ]
  },
  {
    id: 'licenciamento-ambiental',
    name: 'Licenciamento Ambiental Digital',
    description: 'Sistema para licenças ambientais online.',
    fullDescription: 'Plataforma digital para solicitação, acompanhamento e gestão de licenças ambientais municipais.',
    targetAudience: 'Cidadãos e empresas',
    responsibleSecretary: 'SEMAPA',
    launchYear: 2023,
    mainFeatures: [
      'Solicitação online',
      'Acompanhamento de processos',
      'Documentação digital'
    ],
    category: 'cidadao',
    iconUrl: 'https://images.unsplash.com/photo-1696578306635-85664fd15c6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwcGxhbm5pbmclMjB1cmJhbiUyMGRldmVsb3BtZW50fGVufDF8fHx8MTc1NzY0MDk4NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    accessUrl: '#',
    usageCount: 2800,
    downloads: 890,
    rating: 3.9,
    reviewsCount: 45,
    hasPWA: true,
    pwaUrl: '#',
    userReviews: [
      {
        id: '1',
        userName: 'Empresa Verde Ltd',
        rating: 4,
        comment: 'Facilita muito o processo de licenciamento. Documentação clara.',
        date: '2024-11-18'
      }
    ]
  },
  {
    id: 'educacao-digital',
    name: 'São Luís Educação Digital',
    description: 'Plataforma de ensino à distância municipal.',
    fullDescription: 'Sistema educacional digital para apoiar o ensino remoto e híbrido nas escolas municipais de São Luís.',
    targetAudience: 'Estudantes e professores',
    responsibleSecretary: 'SEMED',
    launchYear: 2020,
    mainFeatures: [
      'Aulas virtuais',
      'Material didático digital',
      'Avaliações online'
    ],
    category: 'cidadao',
    iconUrl: 'https://images.unsplash.com/photo-1608986596619-eb50cc56831f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb24lMjBvbmxpbmUlMjBsZWFybmluZ3xlbnwxfHx8fDE3NTc2NTMwMTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    accessUrl: '#',
    usageCount: 25000,
    downloads: 32000,
    rating: 4.5,
    reviewsCount: 2150,
    hasPWA: true,
    pwaUrl: '#',
    userReviews: [
      {
        id: '1',
        userName: 'Professora Ana',
        rating: 5,
        comment: 'Plataforma excelente! Ajudou muito durante a pandemia e continua útil.',
        date: '2024-11-15'
      },
      {
        id: '2',
        userName: 'Estudante Lucas',
        rating: 4,
        comment: 'Gosto das aulas online, mas às vezes o vídeo trava.',
        date: '2024-11-12'
      }
    ]
  },
  {
    id: 'gestao-frota',
    name: 'Sistema de Gestão de Frota',
    description: 'Controle e monitoramento da frota municipal.',
    fullDescription: 'Sistema integrado para gestão, monitoramento e controle da frota de veículos da Prefeitura de São Luís.',
    targetAudience: 'Uso interno',
    responsibleSecretary: 'SEMTT',
    launchYear: 2021,
    mainFeatures: [
      'Rastreamento GPS',
      'Controle de combustível',
      'Manutenção preventiva'
    ],
    category: 'interno',
    iconUrl: 'https://images.unsplash.com/photo-1756579981541-8a3796e0c827?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFuc3BvcnRhdGlvbiUyMHRyYWZmaWMlMjBtYW5hZ2VtZW50fGVufDF8fHx8MTc1NzcwMDYwN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    accessUrl: '#',
    downloads: 280,
    rating: 4.2,
    reviewsCount: 35,
    hasPWA: false,
    userReviews: [
      {
        id: '1',
        userName: 'Gestor SEMTT',
        rating: 4,
        comment: 'Muito útil para controlar a frota. GPS funciona bem.',
        date: '2024-11-10'
      }
    ]
  },
  {
    id: 'ouvidoria-digital',
    name: 'Ouvidoria Digital',
    description: 'Canal digital de comunicação com o cidadão.',
    fullDescription: 'Plataforma digital para recebimento, acompanhamento e resposta de denúncias, sugestões e elogios dos cidadãos.',
    targetAudience: 'Cidadãos',
    responsibleSecretary: 'Ouvidoria Geral',
    launchYear: 2020,
    mainFeatures: [
      'Registro de manifestações',
      'Acompanhamento online',
      'Respostas automatizadas'
    ],
    category: 'cidadao',
    iconUrl: 'https://images.unsplash.com/photo-1658825473738-a56b08976bbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwc2VydmljZXMlMjBwb3J0YWx8ZW58MXx8fHwxNzU3Njg0NDEzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    accessUrl: '#',
    usageCount: 14200,
    downloads: 8900,
    rating: 4.1,
    reviewsCount: 456,
    hasPWA: true,
    pwaUrl: '#',
    userReviews: [
      {
        id: '1',
        userName: 'Cidadão Ativo',
        rating: 4,
        comment: 'Canal importante para comunicação. Respostas poderiam ser mais rápidas.',
        date: '2024-11-08'
      }
    ]
  },
  {
    id: 'agenda-cultural',
    name: 'Agenda Cultural São Luís',
    description: 'Plataforma de eventos culturais da cidade.',
    fullDescription: 'Sistema para divulgação, inscrição e gestão de eventos culturais promovidos pela Prefeitura de São Luís.',
    targetAudience: 'Cidadãos',
    responsibleSecretary: 'SECULT',
    launchYear: 2022,
    mainFeatures: [
      'Calendário de eventos',
      'Inscrições online',
      'Divulgação cultural'
    ],
    category: 'cidadao',
    iconUrl: 'https://images.unsplash.com/photo-1608986596619-eb50cc56831f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb24lMjBvbmxpbmUlMjBsZWFybmluZ3xlbnwxfHx8fDE3NTc2NTMwMTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    accessUrl: '#',
    usageCount: 8900,
    downloads: 12500,
    rating: 4.4,
    reviewsCount: 567,
    hasPWA: true,
    pwaUrl: '#',
    userReviews: [
      {
        id: '1',
        userName: 'Artista Local',
        rating: 5,
        comment: 'Excelente para divulgar eventos culturais da cidade!',
        date: '2024-11-05'
      },
      {
        id: '2',
        userName: 'Amante da Cultura',
        rating: 4,
        comment: 'App muito útil para ficar por dentro dos eventos. Interface bonita.',
        date: '2024-11-02'
      }
    ]
  }
];

export const categories = {
  'novidades': 'Novidades',
  'destaques': 'Destaques',
  'mais-usados': 'Mais Usados',
  'cidadao': 'Para o Cidadão',
  'interno': 'Para Uso Interno',
  'por-secretaria': 'Por Secretaria/Órgão'
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