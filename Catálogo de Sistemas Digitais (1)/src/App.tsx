import { useState, useMemo } from "react";
import { Header } from "./components/Header";
import { CategoryNav } from "./components/CategoryNav";
import { Dashboard } from "./components/Dashboard";
import { FeaturedSystems } from "./components/FeaturedSystems";
import { SystemCard } from "./components/SystemCard";
import { SystemModal } from "./components/SystemModal";
import { digitalSystems, DigitalSystem, categories, departmentCategories, secretaries } from "./data/systems";

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedSystem, setSelectedSystem] = useState<DigitalSystem | null>(null);
  const [systems, setSystems] = useState<DigitalSystem[]>(digitalSystems);

  // Filter systems based on search, category, and department
  // All filters work together with AND logic - you can combine category + department + search
  const filteredSystems = useMemo(() => {
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

    // Filter by department - can be combined with category and search
    if (selectedDepartment) {
      const departmentMap: Record<string, string[]> = {
        'saude': ['SEMUS'],
        'educacao': ['SEMED'],
        'assistencia-social': ['SEMAS'],
        'meio-ambiente': ['SEMAPA'],
        'fazenda-financas': ['SEMFAZ'],
        'planejamento': ['SEPLAN'],
        'tecnologia': ['SEMIT'],
        'transito-transporte': ['SEMTT'],
        'cultura': ['SECULT'],
        'urbanismo': ['SEMURH']
      };
      
      const relevantSecretaries = departmentMap[selectedDepartment] || [];
      filtered = filtered.filter(system => 
        relevantSecretaries.some(secretary => 
          system.responsibleSecretary.includes(secretary)
        )
      );
    }

    return filtered;
  }, [searchTerm, selectedCategory, selectedDepartment, systems]);

  // Count systems by category
  const systemCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    Object.keys(categories).forEach(category => {
      counts[category] = systems.filter(system => system.category === category).length;
    });
    return counts;
  }, [systems]);

  const handleSystemUpdate = (updatedSystem: DigitalSystem) => {
    setSystems(prevSystems => 
      prevSystems.map(system => 
        system.id === updatedSystem.id ? updatedSystem : system
      )
    );
  };

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

      {/* Dashboard - only show when no search/filter is active */}
      {!searchTerm && !selectedCategory && !selectedDepartment && (
        <Dashboard systems={systems} />
      )}

      {/* Featured Systems - only show when no search/filter is active */}
      {!searchTerm && !selectedCategory && !selectedDepartment && (
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
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory(null);
                setSelectedDepartment(null);
              }}
              className="text-blue-600 hover:text-blue-800 font-medium"
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
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory(null);
                    setSelectedDepartment(null);
                  }}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
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
              © 2025 Prefeitura de São Luís. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}