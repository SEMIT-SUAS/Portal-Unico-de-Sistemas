// src/types/index.ts
export interface UserReview {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

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
  developer?: string;
}

// Tipo para o banco de dados
export interface DatabaseDigitalSystem {
  id: number;
  name: string;
  description: string;
  full_description: string;
  target_audience: string;
  responsible_secretary: string;
  launch_year: number;
  category: string;
  is_highlight: boolean;
  is_new: boolean;
  icon_url?: string;
  access_url?: string;
  usage_count?: number;
  downloads?: number;
  rating?: number;
  reviews_count?: number;
  has_pwa: boolean;
  pwa_url?: string;
  developer: string;
  created_at: Date;
  updated_at: Date;
}

// Tipo para resposta da API (compatível com o frontend)
export interface ApiDigitalSystem {
  id: number;
  name: string;
  description: string;
  fullDescription: string;
  targetAudience: string;
  responsibleSecretary: string;
  launchYear: number;
  category: string;
  isHighlight: boolean;
  isNew: boolean;
  iconUrl?: string;
  accessUrl?: string;
  usageCount?: number;
  downloads?: number;
  rating?: number;
  reviewsCount?: number;
  hasPWA: boolean;
  pwaUrl?: string;
  mainFeatures: string[];
  userReviews: UserReview[];
  secretaryName: string;
  developer?: string;
  createdAt?: string;
  updatedAt?: string;
  daysSinceCreation?: number;
  isNewByDate?: boolean;
  daysRemaining: number;
}

// Tipos para as categorias (para o CategoryNav)
export const categories = {
  'novidades': 'Novidades',
  'destaques': 'Destaques',
  'mais-usados': 'Mais Usados',
  'cidadao': 'Para o Cidadão',
  'interno': 'Para Uso Interno',
  'por-secretaria': 'Por Secretaria/Órgão',
  'inativos': 'Sistemas Inativos'
} as const;

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
} as const;

export const secretaries = {
  'SEMUS': 'Secretaria Municipal de Saúde',
  'SEMIT': 'Secretaria Municipal de Informação e Tecnologia',
  'SEMURH': 'Secretaria Municipal de Urbanismo e Habitação',
  'SEPLAN': 'Secretaria Municipal de Planejamento',
  'SEMFAZ': 'Secretaria Municipal da Fazenda',
  'SEMMAM': 'Secretaria Municipal de Meio Ambiente e Proteção Animal',
  'SEMED': 'Secretaria Municipal de Educação',
  'SEMTT': 'Secretaria Municipal de Trânsito e Transporte',
  'SECULT': 'Secretaria Municipal de Cultura',
  'SEMAS': 'Secretaria Municipal de Assistência Social',
  'SEMAPA': 'Secretaria Municipal de Agricultura e Abastecimento' 
} as const;