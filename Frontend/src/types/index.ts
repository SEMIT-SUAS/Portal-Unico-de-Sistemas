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
}

export const categories = {
  'novidades': 'Novidades',
  'destaques': 'Destaques',
  'mais-usados': 'Mais Usados',
  'cidadao': 'Para o Cidadão',
  'interno': 'Para Uso Interno',
  'por-secretaria': 'Por Secretaria/Órgão'
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