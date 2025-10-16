import { useState, useMemo } from "react";
import { Header } from "./components/Header";
import { CategoryNav } from "./components/CategoryNav";
import { Dashboard } from "./components/Dashboard";
import { FeaturedSystems } from "./components/FeaturedSystems";
import { SystemCard } from "./components/SystemCard";
import { SystemModal } from "./components/SystemModal";
import { useSystems, useDashboard, useSystemOperations, useSystemDownloads, useSystemAccess } from "./hooks/useSystems";
import { DigitalSystem, categories, departmentCategories } from "./data/systems";
import React from "react";

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedSystem, setSelectedSystem] = useState<DigitalSystem | null>(null);
  
  // Usar hooks personalizados
  const { systems, loading, error, refetch } = useSystems();
  const { stats, loading: statsLoading, error: statsError } = useDashboard(selectedDepartment);
  const { addReview, loading: reviewLoading } = useSystemOperations();
  const { incrementDownload } = useSystemDownloads();
  const { incrementAccess } = useSystemAccess();

  // Filter systems based on search, category, and department
  const filteredSystems = useMemo(() => {
    if (loading) return [];
    if (error) return [];

    let filtered = systems;

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
        'meio-ambiente': ['SEMAPA'],
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
          system.responsibleSecretary.includes(secretary)
        )
      );
    }

    return filtered;
  }, [searchTerm, selectedCategory, selectedDepartment, systems, loading, error]);

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

  // ✅ CORRIGIDO: Usar o hook addReview
  const handleAddReview = async (systemId: number, ratingData: any) => {
    try {
      console.log('📝 Enviando avaliação do App.tsx...');
      const success = await addReview(systemId, ratingData);
      if (success) {
        console.log('✅ Avaliação adicionada com sucesso, recarregando dados...');
        await refetch();
        return true;
      } else {
        throw new Error('Erro ao adicionar avaliação');
      }
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  };

  // ✅ Handler para download
  const handleDownload = async (systemId: number) => {
    try {
      await incrementDownload(systemId);
      await refetch();
    } catch (error) {
      console.error('Error incrementing download:', error);
    }
  };

  // ✅ Handler para acesso
  const handleAccess = async (systemId: number) => {
    try {
      await incrementAccess(systemId);
      await refetch();
    } catch (error) {
      console.error('Error incrementing access:', error);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
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

      {/* Dashboard - show when no search/category filter */}
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

      {/* Featured Systems - only show when no filters at all */}
      {shouldShowFeaturedSystems && (
        <FeaturedSystems 
          systems={systems}
          onSystemClick={setSelectedSystem}
        />
      )}

      {/* Systems Grid */}
      <div className="container mx-auto px-4 py-8">
        {filteredSystems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg 
                className="mx-auto h-12 w-12" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum sistema encontrado
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? `Não encontramos sistemas que correspondam à busca "${searchTerm}"`
                : selectedDepartment
                  ? `Não há sistemas na secretaria selecionada`
                  : `Não há sistemas na categoria selecionada`
              }
            </p>
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
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
                  {(selectedCategory || selectedDepartment || searchTerm) && (
                    <span className="text-sm ml-2">
                      ({(selectedCategory || selectedDepartment) && searchTerm ? 'filtros combinados' : 'filtrado'})
                    </span>
                  )}
                </p>
              </div>
              
              {(searchTerm || selectedCategory || selectedDepartment) && (
                <button
                  onClick={clearFilters}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                >
                  Limpar filtros
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredSystems.map((system) => (
                <SystemCard
                  key={system.id}
                  system={system}
                  onSystemClick={setSelectedSystem}
                  onDownload={() => handleDownload(system.id)}
                  onAccess={() => handleAccess(system.id)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* System Detail Modal */}
      <SystemModal
        system={selectedSystem}
        onClose={() => setSelectedSystem(null)}
        onSystemUpdate={handleSystemUpdate}
        onAddReview={handleAddReview}  
        onDownload={selectedSystem ? () => handleDownload(selectedSystem.id) : undefined}
        onAccess={selectedSystem ? () => handleAccess(selectedSystem.id) : undefined}
        reviewLoading={reviewLoading}
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