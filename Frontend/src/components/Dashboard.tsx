import { DigitalSystem } from "../data/systems";
import { BarChart3, Users, TrendingUp } from "lucide-react";

interface DashboardProps {
  systems: DigitalSystem[];
  stats: {
    totalSystems: number;
    totalDownloads: number;
    totalUsers: number;
    averageRating: number;
    systemsByDepartment: Record<string, number>;
  };
}

export function Dashboard({ systems, stats }: DashboardProps) {
  const { totalSystems, totalDownloads, averageRating, systemsByDepartment } = stats;

  // Estatísticas gerais
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
              <p className="text-3xl font-bold text-yellow-700">{averageRating.toFixed(1)}</p>
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
      </div>

      {/* Estatísticas por departamento */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Sistemas por Secretaria/Órgão</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.entries(systemsByDepartment).map(([key, count]) => (
            count > 0 && (
              <div key={key} className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-600 capitalize">{key}</p>
                <p className="text-2xl font-bold text-blue-700">{count}</p>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
}