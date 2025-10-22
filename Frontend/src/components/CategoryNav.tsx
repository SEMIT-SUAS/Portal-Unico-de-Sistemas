import React from "react";
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

export function CategoryNav({ selectedCategory, onCategoryChange, systemCounts, selectedDepartment, onDepartmentChange }: CategoryNavProps) {
  const categoriesWithoutDepartment = Object.entries(categories).filter(([key]) => key !== 'por-secretaria');

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

  return (
    <div className="bg-white border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col gap-4">
          {/* Filtros ativos */}
          {(selectedCategory || selectedDepartment) && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Filtros ativos:</span>
              {selectedCategory && (
                <Badge variant="default" className="bg-blue-600 flex items-center gap-1">
                  {categories[selectedCategory as keyof typeof categories]}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleCategorySelect(null)}
                  />
                </Badge>
              )}
              {selectedDepartment && (
                <Badge variant="default" className="bg-green-600 flex items-center gap-1">
                  {departmentCategories[selectedDepartment as keyof typeof departmentCategories]}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleDepartmentSelect(null)}
                  />
                </Badge>
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
              Todos
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
                {label} ({systemCounts[key] || 0})
              </Badge>
            ))}

            {/* Department Dropdown */}
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
                    : "Por Categoria"
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