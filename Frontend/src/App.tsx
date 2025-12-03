// src/App.tsx
import { useState, useMemo, useEffect } from "react";
import { Header } from "./components/Header";
import { CategoryNav } from "./components/CategoryNav";
import { Dashboard } from "./components/Dashboard";
import { FeaturedSystems } from "./components/FeaturedSystems";
import { SystemCard } from "./components/SystemCard";
import { SystemModal } from "./components/SystemModal";
import { useSystems, useDashboard, useSystemOperations, useSystemDownloads, useSystemAccess } from "./hooks/useSystems";
import { DigitalSystem, categories, departmentCategories } from "./data/systems";
import React from "react";

// Interface para cache local de reviews
interface CachedReview {
  id: string;
  systemId: number;
  review: any;
  timestamp: number;
}

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [systemNameFilter, setSystemNameFilter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedSystem, setSelectedSystem] = useState<DigitalSystem | null>(null);
  const [cachedReviews, setCachedReviews] = useState<CachedReview[]>([]);
  const [lastReviewTime, setLastReviewTime] = useState<number>(0);
  
  // Usar hooks personalizados
  const { systems, loading, error, refetch } = useSystems();
  const { stats, loading: statsLoading, error: statsError } = useDashboard(selectedDepartment);
  const { addReview, loading: reviewLoading } = useSystemOperations();
  const { incrementDownload } = useSystemDownloads();
  const { incrementAccess } = useSystemAccess();

  // Carregar reviews em cache do localStorage
  useEffect(() => {
    const savedReviews = localStorage.getItem('systemReviewsCache');
    if (savedReviews) {
      try {
        const parsed = JSON.parse(savedReviews);
        setCachedReviews(parsed);
      } catch (error) {
        console.error('Erro ao carregar cache de reviews:', error);
      }
    }
  }, []);

  // Salvar reviews em cache no localStorage
  useEffect(() => {
    localStorage.setItem('systemReviewsCache', JSON.stringify(cachedReviews));
  }, [cachedReviews]);

  // Função para obter sistema com cache aplicado
  const getSystemWithCache = (system: DigitalSystem): DigitalSystem => {
    // Buscar reviews em cache para este sistema
    const systemCachedReviews = cachedReviews
      .filter(cr => cr.systemId === system.id)
      .map(cr => cr.review);

    if (systemCachedReviews.length === 0) {
      return system;
    }

    // Combinar reviews do sistema com cache
    const allReviews = [...systemCachedReviews, ...(system.userReviews || [])];
    
    // Calcular nova média
    const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
    const newAverage = totalRating / allReviews.length;

    return {
      ...system,
      userReviews: allReviews,
      reviewsCount: allReviews.length,
      rating: parseFloat(newAverage.toFixed(1))
    };
  };

  // Função para obter cached reviews de um sistema específico
  const getCachedReviewsForSystem = (systemId: number) => {
    return cachedReviews
      .filter(cr => cr.systemId === systemId)
      .map(cr => cr.review)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  // Filter systems based on search, category, and department
  const filteredSystems = useMemo(() => {
    if (loading) return [];

    let filtered = systems.map(getSystemWithCache);

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(system => 
        system.name.toLowerCase().includes(term) ||
        system.description.toLowerCase().includes(term) ||
        system.fullDescription.toLowerCase().includes(term) ||
        system.responsibleSecretary.toLowerCase().includes(term) ||
        system.mainFeatures.some(feature => feature.toLowerCase().includes(term))
      );
    }

    // Filter by system name
    if (systemNameFilter.trim()) {
      const nameTerm = systemNameFilter.toLowerCase();
      filtered = filtered.filter(system => 
        system.name.toLowerCase().includes(nameTerm)
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(system => system.category === selectedCategory);
    }

    // Filter by department
    if (selectedDepartment) {
      const departmentMap: Record<string, string[]> = {
        'saude': ['SEMUS'],
        'educacao': ['SEMED'],
        'assistencia-social': ['SEMAS'],
        'meio-ambiente': ['SEMMAM'],
        'fazenda-financas': ['SEMFAZ'],
        'planejamento': ['SEPLAN'],
        'tecnologia': ['SEMIT'],
        'transito-transporte': ['SMTT'],
        'cultura': ['SECULT'],
        'urbanismo': ['SEMURH'],
        'comunicacao': ['SECOM'],
        'turismo': ['SETUR'],
        'seguranca': ['SEMUSC']
      };
      
      const relevantSecretaries = departmentMap[selectedDepartment] || [];
      
      filtered = filtered.filter(system => 
        relevantSecretaries.some(secretary => 
          system.responsibleSecretary === secretary
        )
      );
    }

    return filtered;
  }, [searchTerm, systemNameFilter, selectedCategory, selectedDepartment, systems, loading, cachedReviews]);

  // Count systems by category
  const systemCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    Object.keys(categories).forEach(category => {
      counts[category] = systems.filter(system => system.category === category).length;
    });
    return counts;
  }, [systems]);

  const handleSystemUpdate = async (updatedSystem: DigitalSystem) => {
    try {
      console.log('System updated:', updatedSystem);
      await refetch();
    } catch (error) {
      console.error('Error updating system:', error);
    }
  };

  // Função para adicionar review com cache otimista
  const handleAddReview = async (systemId: number, ratingData: any) => {
    try {
      console.log('📝 [APP] Enviando avaliação...', ratingData);
      
      // 1. Criar review otimista com ID único
      const reviewId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const optimisticReview = {
        id: reviewId,
        userName: ratingData.userName,
        rating: ratingData.rating,
        comment: ratingData.comment,
        date: new Date().toISOString(),
        ...(ratingData.demographics && {
          cor: ratingData.demographics.cor,
          sexo: ratingData.demographics.sexo,
          idade: ratingData.demographics.idade
        })
      };

      // 2. Adicionar ao cache IMEDIATAMENTE
      setCachedReviews(prev => [
        ...prev,
        {
          id: reviewId,
          systemId,
          review: optimisticReview,
          timestamp: Date.now()
        }
      ]);

      // 3. Atualizar o tempo da última review
      setLastReviewTime(Date.now());

      // 4. Enviar para o backend
      const success = await addReview(systemId, ratingData);
      
      if (success) {
        console.log('✅ [APP] Avaliação enviada com sucesso para o backend');
        
        // 5. NÃO REMOVE DO CACHE IMEDIATAMENTE
        console.log('💾 [APP] Cache mantido para mostrar "enviando..."');
        
        // 6. Atualiza os dados em background
        setTimeout(() => {
          refetch();
          console.log('🔄 [APP] Dados atualizados em background');
        }, 2000);
        
        return true;
      } else {
        console.error('❌ [APP] Erro ao enviar avaliação para o backend');
        return false;
      }
    } catch (error) {
      console.error('Error adding review:', error);
      return false;
    }
  };

  // Handler para download
  const handleDownload = async (systemId: number) => {
    try {
      await incrementDownload(systemId);
      await refetch();
    } catch (error) {
      console.error('Error incrementing download:', error);
    }
  };

  // Handler para acesso
  const handleAccess = async (systemId: number) => {
    try {
      await incrementAccess(systemId);
      await refetch();
    } catch (error) {
      console.error('Error incrementing access:', error);
    }
  };

  // Função para limpar cache quando fechar o modal
  const handleCloseModal = () => {
    if (selectedSystem) {
      const systemId = selectedSystem.id;
      setCachedReviews(prev => prev.filter(cr => cr.systemId !== systemId));
      console.log('🗑️ [APP] Cache limpo ao fechar modal do sistema', systemId);
    }
    setSelectedSystem(null);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSystemNameFilter("");
    setSelectedCategory(null);
    setSelectedDepartment(null);
  };

  // Determinar quando mostrar o Dashboard
  const shouldShowDashboard = !searchTerm && !selectedCategory;
  const shouldShowFeaturedSystems = !searchTerm && !selectedCategory && !selectedDepartment;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando sistemas...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Erro ao carregar dados</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={refetch}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      
      <CategoryNav
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        systemCounts={systemCounts}
        selectedDepartment={selectedDepartment}
        onDepartmentChange={setSelectedDepartment}
      />

      {/* Dashboard */}
      {shouldShowDashboard && stats && (
        <Dashboard 
          systems={systems} 
          stats={{
            totalSystems: stats.totalSystems,
            totalDownloads: stats.totalDownloads,
            totalUsers: stats.totalUsers,
            averageRating: stats.averageRating,
            totalReviews: stats.totalReviews
          }}
          selectedDepartment={selectedDepartment}
          departmentCategories={departmentCategories}
        />
      )}

      {/* Featured Systems */}
      {shouldShowFeaturedSystems && (
        <FeaturedSystems 
          systems={systems}
          onSystemClick={setSelectedSystem}
        />
      )}

      {/* Systems Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {(() => {
                    const filters = [];
                    if (selectedCategory) {
                      filters.push(categories[selectedCategory as keyof typeof categories]);
                    }
                    if (selectedDepartment) {
                      filters.push(departmentCategories[selectedDepartment as keyof typeof departmentCategories]);
                    }
                    if (searchTerm) {
                      filters.push(`"${searchTerm}"`);
                    }
                    
                    if (filters.length > 0) {
                      return filters.join(' • ');
                    }
                    
                    return "Todos os Sistemas";
                  })()}
                </h2>
                <p className="text-gray-600 mt-1">
                  {filteredSystems.length} sistema{filteredSystems.length !== 1 ? 's' : ''} encontrado{filteredSystems.length !== 1 ? 's' : ''}
                </p>
              </div>
              
              {/* Buscador por nome */}
              <div className="ml-6 flex-shrink-0">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-2 pl-3 flex items-center pointer-events-none">
                    <svg 
                      className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar sistemas..."
                    value={systemNameFilter}
                    onChange={(e) => setSystemNameFilter(e.target.value)}
                    className="pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-96 bg-white shadow-sm hover:shadow-md transition-all duration-200 text-gray-700 placeholder-gray-400"
                  />
                  {systemNameFilter && (
                    <button
                      onClick={() => setSystemNameFilter("")}
                      className="absolute inset-y-0 right-2 pr-3 flex items-center group/clear"
                    >
                      <svg 
                        className="h-4 w-4 text-gray-400 hover:text-gray-600 group-hover/clear:scale-110 transition-all" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M6 18L18 6M6 6l12 12" 
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botão Limpar Filtros */}
        {(searchTerm || selectedCategory || selectedDepartment || systemNameFilter) && (
          <div className="flex justify-end mb-4">
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors px-3 py-2 rounded-lg hover:bg-blue-50"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Limpar todos os filtros
            </button>
          </div>
        )}

        {/* Conteúdo - Sistemas ou Mensagem de Nenhum Resultado */}
        {filteredSystems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-300 mb-4">
              <svg 
                className="mx-auto h-16 w-16" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nenhum sistema encontrado
            </h3>
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Limpar filtros e ver todos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSystems.map((system) => (
              <SystemCard
                key={`${system.id}-${lastReviewTime}`}
                system={system}
                onSystemClick={setSelectedSystem}
                forceRefreshKey={lastReviewTime.toString()}
              />
            ))}
          </div>
        )}
      </div>

      {/* System Detail Modal */}
      <SystemModal
        system={selectedSystem}
        onClose={handleCloseModal}
        onSystemUpdate={handleSystemUpdate}
        onAddReview={handleAddReview}
        onDownload={selectedSystem ? () => handleDownload(selectedSystem.id) : undefined}
        onAccess={selectedSystem ? () => handleAccess(selectedSystem.id) : undefined}
        reviewLoading={reviewLoading}
        cachedReviews={selectedSystem ? getCachedReviewsForSystem(selectedSystem.id) : []}
      />

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="font-semibold">Prefeitura de São Luís</h3>
              <p className="text-gray-400 text-sm">
                Secretaria Municipal de Informação e Tecnologia - SEMIT
              </p>
            </div>
            <div className="text-sm text-gray-400">
              © 2025 Construído por: Cristian Abreu & Felipe Brito. Prefeitura de São Luís. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}