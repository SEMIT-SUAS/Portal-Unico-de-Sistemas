// components/Dashboard.tsx
import React from "react";
import { DigitalSystem } from "../data/systems";
import { Building, Star, MessageSquare } from "lucide-react";

interface DashboardProps {
  systems: DigitalSystem[];
  stats: {
    totalSystems: number;
    totalDownloads: number;
    totalUsers: number;
    averageRating: number;
    totalReviews: number;
  };
  selectedDepartment: string | null;
  departmentCategories: Record<string, string>;
}

export function Dashboard({ systems, stats, selectedDepartment, departmentCategories }: DashboardProps) {
  // Filtrar sistemas pela secretaria selecionada
  const filteredSystems = selectedDepartment 
    ? systems.filter(system => {
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
        return relevantSecretaries.some(secretary => 
          system.responsibleSecretary.includes(secretary)
        );
      })
    : systems;

  // Calcular estatísticas específicas da secretaria
  const calculateDepartmentStats = () => {
    const totalSystems = filteredSystems.length;
    const totalDownloads = filteredSystems.reduce((sum, system) => sum + (system.downloads || 0), 0);
    const totalUsers = filteredSystems.reduce((sum, system) => sum + (system.usageCount || 0), 0);
    
    // SOMA de todas as avaliações
    const totalReviews = filteredSystems.reduce((sum, system) => sum + (system.reviewsCount || 0), 0);

    // Cálculo SIMPLES: soma de todas as notas / total de avaliações
    let averageRating = 0;
    
    if (totalReviews > 0) {
      // Soma de TODAS as notas (cada sistema contribui com rating * reviewsCount)
      const sumAllRatings = filteredSystems.reduce((sum, system) => {
        return sum + ((system.rating || 0) * (system.reviewsCount || 0));
      }, 0);
      
      // Divide pelo TOTAL de avaliações
      averageRating = sumAllRatings / totalReviews;

      console.log('🔍 DEBUG - Cálculo Simples de Rating:', {
        totalSystems,
        totalReviews,
        sumAllRatings,
        averageRating,
        calculation: `${sumAllRatings} / ${totalReviews} = ${averageRating}`
      });
    }

    return {
      totalSystems,
      totalDownloads,
      totalUsers,
      averageRating: isNaN(averageRating) ? 0 : averageRating,
      totalReviews
    };
  };

  const departmentStats = calculateDepartmentStats();

  const departmentName = selectedDepartment 
    ? departmentCategories[selectedDepartment as keyof typeof departmentCategories] 
    : "Todas as Secretarias";

  // Array com as métricas na ordem solicitada
  const metrics = [
    {
      key: 'totalSystems',
      label: 'Total de Sistemas',
      value: departmentStats.totalSystems,
      icon: Building,
      color: 'blue',
      comparison: selectedDepartment ? `de ${stats.totalSystems} total` : undefined
    },
    {
      key: 'averageRating',
      label: 'Avaliação Média',
      value: departmentStats.averageRating > 0 ? departmentStats.averageRating.toFixed(1) : '0.0',
      icon: Star,
      color: 'yellow',
      comparison: selectedDepartment ? 
        `${departmentStats.totalReviews} avaliações` : 
        `${departmentStats.totalReviews} avaliações no total`
    },
    {
      key: 'totalReviews',
      label: 'Total de Avaliações',
      value: departmentStats.totalReviews.toLocaleString(),
      icon: MessageSquare,
      color: 'indigo',
      comparison: selectedDepartment && departmentStats.totalSystems > 0 ? 
        `Média de ${Math.round(departmentStats.totalReviews / departmentStats.totalSystems)} por sistema` : undefined
    }
  ];

  // Cores para os ícones e bordas
  const colorClasses = {
    blue: { border: 'border-blue-500', bg: 'bg-blue-100', text: 'text-blue-600' },
    green: { border: 'border-green-500', bg: 'bg-green-100', text: 'text-green-600' },
    purple: { border: 'border-purple-500', bg: 'bg-purple-100', text: 'text-purple-600' },
    yellow: { border: 'border-yellow-500', bg: 'bg-yellow-100', text: 'text-yellow-600' },
    indigo: { border: 'border-indigo-500', bg: 'bg-indigo-100', text: 'text-indigo-600' }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Cabeçalho do Dashboard */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Dashboard - {departmentName}
            </h2>
            <p className="text-gray-600">
              {selectedDepartment 
                ? `Métricas específicas da ${departmentName}`
                : "Visão geral do catálogo de sistemas digitais"
              }
            </p>
          </div>
          
          {/* Badge indicador de filtro */}
          {selectedDepartment && (
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              Filtrado por secretaria
            </div>
          )}
        </div>
      </div>

      {/* Container único com as métricas lado a lado */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map((metric) => {
            const IconComponent = metric.icon;
            const colors = colorClasses[metric.color as keyof typeof colorClasses];
            
            return (
              <div 
                key={metric.key}
                className="text-center"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${colors.bg} mb-3`}>
                  <IconComponent className={`h-6 w-6 ${colors.text}`} />
                </div>
                <p className="text-sm font-medium text-gray-600 mb-1">{metric.label}</p>
                <p className={`text-2xl font-bold text-gray-900 mb-1`}>
                  {metric.value}
                </p>
                {metric.comparison && (
                  <p className="text-xs text-gray-500">{metric.comparison}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}