import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
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

  return (
    <div className="bg-white border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedCategory === null && selectedDepartment === null ? "default" : "secondary"}
            className={`cursor-pointer transition-all ${
              selectedCategory === null && selectedDepartment === null
                ? "bg-blue-600 hover:bg-blue-700" 
                : "hover:bg-gray-200"
            }`}
            onClick={() => {
              onCategoryChange(null);
              onDepartmentChange(null);
            }}
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
              onClick={() => {
                onCategoryChange(key);
                onDepartmentChange(null);
              }}
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
                    ? "bg-blue-600 hover:bg-blue-700" 
                    : "hover:bg-gray-200"
                }`}
              >
                {selectedDepartment 
                  ? departmentCategories[selectedDepartment as keyof typeof departmentCategories] 
                  : "Por Secretaria/Órgão"
                }
                <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {Object.entries(departmentCategories).map(([key, label]) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() => {
                    onDepartmentChange(key);
                    onCategoryChange(null);
                  }}
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
  );
}