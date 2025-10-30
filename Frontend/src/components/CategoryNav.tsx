import React, { useState, useEffect } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { ChevronDown, X } from "lucide-react";
import { categories, departmentCategories } from "../data/systems";

interface CategoryNavProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  systemCounts: Record<string, number>;
  selectedDepartment: string | null;
  onDepartmentChange: (department: string | null) => void;
}

export function CategoryNav({ 
  selectedCategory, 
  onCategoryChange, 
  systemCounts, 
  selectedDepartment, 
  onDepartmentChange
}: CategoryNavProps) {
  const categoriesWithoutDepartment = Object.entries(categories).filter(([key]) => key !== 'por-secretaria');
  const [filteredSystemCounts, setFilteredSystemCounts] = useState<Record<string, number>>({});

  // Buscar contagens filtradas quando o departamento mudar
  useEffect(() => {
    const fetchFilteredCounts = async () => {
      try {
        const params = new URLSearchParams();
        if (selectedDepartment) {
          params.append('department', selectedDepartment);
        }

        const response = await fetch(`/api/categories/filtered-counts?${params}`);
        const result = await response.json();

        if (result.success) {
          setFilteredSystemCounts(result.data.counts);
        } else {
          setFilteredSystemCounts({});
        }
      } catch (error) {
        console.error('Error fetching filtered counts:', error);
        // Se der erro, usa as contagens normais
        setFilteredSystemCounts({});
      }
    };

    fetchFilteredCounts();
  }, [selectedDepartment]);

  // Função para lidar com a seleção de categoria
  const handleCategorySelect = (category: string | null) => {
    onCategoryChange(category);
  };

  // Função para lidar com a seleção de departamento
  const handleDepartmentSelect = (department: string | null) => {
    onDepartmentChange(department);
  };

  // Função para limpar todos os filtros
  const clearAllFilters = () => {
    onCategoryChange(null);
    onDepartmentChange(null);
  };

  // Função para remover filtro de categoria
  const removeCategoryFilter = () => {
    onCategoryChange(null);
  };

  // Função para remover filtro de departamento
  const removeDepartmentFilter = () => {
    onDepartmentChange(null);
  };

  // Obtém a contagem para uma categoria específica (usa filteredSystemCounts quando disponível)
  const getCategoryCount = (key: string) => {
    // Se há um departamento selecionado E temos contagens filtradas, usa filteredSystemCounts
    // Caso contrário, usa systemCounts normal
    if (selectedDepartment && filteredSystemCounts && filteredSystemCounts[key] !== undefined) {
      return filteredSystemCounts[key];
    }
    return systemCounts[key] || 0;
  };

  // Calcula o total de sistemas baseado nos filtros atuais
  const getTotalCount = () => {
    // Se há um departamento selecionado E temos contagens filtradas, soma os valores filtrados
    if (selectedDepartment && filteredSystemCounts && Object.keys(filteredSystemCounts).length > 0) {
      return Object.values(filteredSystemCounts).reduce((sum, count) => sum + count, 0);
    }
    // Caso contrário, usa o total de systemCounts
    return Object.values(systemCounts).reduce((sum, count) => sum + count, 0);
  };

  return (
    <div className="bg-white border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col gap-4">
          {/* Filtros ativos */}
          {(selectedCategory || selectedDepartment) && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Filtros ativos:</span>
              {selectedCategory && (
                <div className="relative inline-flex items-center">
                  <Badge variant="default" className="bg-blue-600 flex items-center gap-1 pr-8">
                    {categories[selectedCategory as keyof typeof categories]}
                  </Badge>
                  <button
                    onClick={removeCategoryFilter}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 rounded-full p-0.5 transition-colors"
                    style={{ width: '18px', height: '18px' }}
                  >
                    <X className="h-3 w-3 text-gray-700" />
                  </button>
                </div>
              )}
              {selectedDepartment && (
                <div className="relative inline-flex items-center">
                  <Badge variant="default" className="bg-green-600 flex items-center gap-1 pr-8">
                    {departmentCategories[selectedDepartment as keyof typeof departmentCategories]}
                  </Badge>
                  <button
                    onClick={removeDepartmentFilter}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 rounded-full p-0.5 transition-colors"
                    style={{ width: '18px', height: '18px' }}
                  >
                    <X className="h-3 w-3 text-gray-700" />
                  </button>
                </div>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearAllFilters}
                className="text-xs h-6 px-2"
              >
                Limpar todos
              </Button>
            </div>
          )}
          
          {/* Filtros disponíveis */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedCategory === null && selectedDepartment === null ? "default" : "secondary"}
              className={`cursor-pointer transition-all ${
                selectedCategory === null && selectedDepartment === null
                  ? "bg-blue-600 hover:bg-blue-700" 
                  : "hover:bg-gray-200"
              }`}
              onClick={clearAllFilters}
            >
              Todos ({getTotalCount()})
            </Badge>
            
            {categoriesWithoutDepartment.map(([key, label]) => (
              <Badge
                key={key}
                variant={selectedCategory === key ? "default" : "secondary"}
                className={`cursor-pointer transition-all ${
                  selectedCategory === key 
                    ? "bg-blue-600 hover:bg-blue-700" 
                    : "hover:bg-gray-200"
                }`}
                onClick={() => handleCategorySelect(key)}
              >
                {label} ({getCategoryCount(key)})
              </Badge>
            ))}

            {/* Department Dropdown - SEM contagem aqui */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={selectedDepartment ? "default" : "secondary"}
                  size="sm"
                  className={`transition-all ${
                    selectedDepartment 
                      ? "bg-green-600 hover:bg-green-700" 
                      : "hover:bg-gray-200"
                  }`}
                >
                  {selectedDepartment 
                    ? departmentCategories[selectedDepartment as keyof typeof departmentCategories]
                    : "Por Secretaria"
                  }
                  <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {Object.entries(departmentCategories).map(([key, label]) => (
                  <DropdownMenuItem
                    key={key}
                    onClick={() => handleDepartmentSelect(key)}
                    className="cursor-pointer"
                  >
                    {label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}