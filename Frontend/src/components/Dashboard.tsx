import { DigitalSystem, departmentCategories } from "../data/systems";
import { BarChart3, Users, Building2, TrendingUp } from "lucide-react";

interface DashboardProps {
  systems: DigitalSystem[];
}

export function Dashboard({ systems }: DashboardProps) {
  // Contar total de sistemas
  const totalSystems = systems.length;

  // Contar sistemas por secretaria/órgão
  const systemsByDepartment = {
    'saude': systems.filter(s => s.responsibleSecretary.includes('SEMUS')).length,
    'educacao': systems.filter(s => s.responsibleSecretary.includes('SEMED')).length,
    'assistencia-social': systems.filter(s => s.responsibleSecretary.includes('SEMAS')).length,
    'meio-ambiente': systems.filter(s => s.responsibleSecretary.includes('SEMAPA')).length,
    'fazenda-financas': systems.filter(s => s.responsibleSecretary.includes('SEMFAZ')).length,
    'planejamento': systems.filter(s => s.responsibleSecretary.includes('SEPLAN')).length,
    'tecnologia': systems.filter(s => s.responsibleSecretary.includes('SEMIT')).length,
    'transito-transporte': systems.filter(s => s.responsibleSecretary.includes('SEMTT')).length,
    'cultura': systems.filter(s => s.responsibleSecretary.includes('SECULT')).length,
    'urbanismo': systems.filter(s => s.responsibleSecretary.includes('SEMURH')).length
  };

  // Estatísticas gerais
  const totalDownloads = systems.reduce((sum, system) => sum + (system.downloads || 0), 0);
  const avgRating = systems.length > 0 
    ? systems.reduce((sum, system) => sum + (system.rating || 0), 0) / systems.length 
    : 0;
  const totalReviews = systems.reduce((sum, system) => sum + (system.reviewsCount || 0), 0);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-700 mb-2">Dashboard</h2>
        <p className="text-gray-600">Estatísticas gerais do catálogo de sistemas digitais</p>
      </div>

      {/* Cards de estatísticas gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Sistemas</p>
              <p className="text-3xl font-bold text-blue-700">{totalSystems}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Downloads</p>
              <p className="text-3xl font-bold text-green-700">{totalDownloads.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avaliação Média</p>
              <p className="text-3xl font-bold text-yellow-700">{avgRating.toFixed(1)}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <div className="h-6 w-6 text-yellow-600 flex items-center justify-center">⭐</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Avaliações</p>
              <p className="text-3xl font-bold text-purple-700">{totalReviews.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      
        
        {Object.values(systemsByDepartment).every(count => count === 0) && (
          <p className="text-gray-500 text-center py-4">Nenhum sistema encontrado</p>
        )}
      </div>
    </div>
  );
}