import { DigitalSystem, departmentCategories } from "../data/systems";
import { BarChart3, Building2 } from "lucide-react";

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

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-8 mb-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-blue-700 mb-2">Dashboard</h2>
            <p className="text-gray-600">Estatísticas do catálogo de sistemas digitais</p>
          </div>
          
          {/* Total de Sistemas - Lado a lado com o título */}
          <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Sistemas</p>
                <p className="text-2xl font-bold text-blue-700">{totalSystems}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sistemas por Secretaria/Órgão */}
        <div>
          <div className="flex items-center mb-4">
            <Building2 className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Sistemas por Secretaria/Órgão</h3>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {Object.entries(systemsByDepartment).map(([key, count]) => (
              <div key={key} className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors border">
                <div className="text-center">
                  <p className="text-xs font-medium text-gray-600 mb-1 leading-tight">
                    {departmentCategories[key as keyof typeof departmentCategories]}
                  </p>
                  <p className="text-xl font-bold text-blue-700">{count}</p>
                  <p className="text-xs text-gray-500">
                    {count === 1 ? 'sistema' : 'sistemas'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}