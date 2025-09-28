// src/utils/systemUtils.ts - ATUALIZAR as funções
export const systemUtils = {
  // CORREÇÃO: Verificar se a data não é futura
  isNewSystem: (createdAt: string): boolean => {
    try {
      const createdDate = new Date(createdAt);
      const currentDate = new Date();
      
      // Se a data for futura, não é novo
      if (createdDate > currentDate) return false;
      
      const diffTime = currentDate.getTime() - createdDate.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      return diffDays < 60;
    } catch (error) {
      console.error('Erro ao verificar se sistema é novo:', error);
      return false;
    }
  },

  // CORREÇÃO: Retornar 0 se a data for futura
  getDaysRemaining: (createdAt: string): number => {
    try {
      const createdDate = new Date(createdAt);
      const currentDate = new Date();
      
      // Se a data for futura, retornar 0
      if (createdDate > currentDate) return 0;
      
      const diffTime = currentDate.getTime() - createdDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      return Math.max(0, 60 - diffDays);
    } catch (error) {
      console.error('Erro ao calcular dias restantes:', error);
      return 0;
    }
  },

  // Formatar data relativa (ex: "há 15 dias")
  getRelativeTime: (createdAt: string): string => {
    try {
      const createdDate = new Date(createdAt);
      const currentDate = new Date();
      const diffTime = currentDate.getTime() - createdDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'hoje';
      if (diffDays === 1) return 'há 1 dia';
      if (diffDays < 30) return `há ${diffDays} dias`;
      if (diffDays < 60) {
        const months = Math.floor(diffDays / 30);
        return `há ${months} mês${months > 1 ? 'es' : ''}`;
      }
      
      const months = Math.floor(diffDays / 30);
      return `há ${months} meses`;
    } catch (error) {
      console.error('Erro ao formatar tempo relativo:', error);
      return 'data desconhecida';
    }
  },

  // Gerar data aleatória para demonstração (caso não tenha dados reais)
  generateDemoDate: (daysAgo: number = 0): string => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString();
  }
};