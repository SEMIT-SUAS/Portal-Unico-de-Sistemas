import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, LogOut, Menu, X } from 'lucide-react';
import { Button } from '../ui/button';
import { SystemForm } from './SystemForm';
import { DigitalSystem } from '../../data/systems';
import { api } from '../../services/api';

export function AdminPanel() {
  const [systems, setSystems] = useState<DigitalSystem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSystem, setEditingSystem] = useState<DigitalSystem | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    loadSystems();
  }, []);

  const loadSystems = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/systems');
      setSystems(response.data);
    } catch (error) {
      console.error('Erro ao carregar sistemas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSystem = () => {
    setEditingSystem(null);
    setShowForm(true);
  };

  const handleEditSystem = (system: DigitalSystem) => {
    setEditingSystem(system);
    setShowForm(true);
  };

  const handleDeleteSystem = async (systemId: string) => {
    if (confirm('Tem certeza que deseja deletar este sistema?')) {
      try {
        await api.delete(`/admin/systems/${systemId}`);
        await loadSystems(); // Recarregar a lista
      } catch (error) {
        console.error('Erro ao deletar sistema:', error);
      }
    }
  };

  const handleFormSubmit = async () => {
    setShowForm(false);
    setEditingSystem(null);
    await loadSystems(); // Recarregar a lista após salvar
  };

  const handleLogout = () => {
    // Implementar lógica de logout
    localStorage.removeItem('admin_token');
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block bg-blue-800 text-white w-64 fixed h-full p-4`}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-bold">Painel Admin</h1>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="space-y-2">
          <button className="w-full text-left px-4 py-2 bg-blue-700 rounded-lg font-medium">
            Sistemas
          </button>
          <button className="w-full text-left px-4 py-2 hover:bg-blue-700 rounded-lg">
            Estatísticas
          </button>
          <button className="w-full text-left px-4 py-2 hover:bg-blue-700 rounded-lg">
            Usuários
          </button>
        </nav>

        <button 
          onClick={handleLogout}
          className="absolute bottom-4 left-4 right-4 flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>

      {/* Conteúdo Principal */}
      <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'md:ml-64'} transition-all`}>
        <div className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setSidebarOpen(true)}
                  className="md:hidden"
                >
                  <Menu className="h-6 w-6" />
                </button>
                <h2 className="text-2xl font-semibold">Gerenciar Sistemas</h2>
              </div>
              
              <Button onClick={handleCreateSystem} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Novo Sistema
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Estatísticas Rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-blue-600">{systems.length}</div>
              <div className="text-gray-600">Total de Sistemas</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-green-600">
                {systems.filter(s => s.isNew).length}
              </div>
              <div className="text-gray-600">Sistemas Novos</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-purple-600">
                {systems.reduce((sum, s) => sum + (s.downloads || 0), 0).toLocaleString()}
              </div>
              <div className="text-gray-600">Downloads Totais</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-2xl font-bold text-yellow-600">
                {(systems.reduce((sum, s) => sum + (s.rating || 0), 0) / systems.length).toFixed(1) || '0.0'}
              </div>
              <div className="text-gray-600">Rating Médio</div>
            </div>
          </div>

          {/* Lista de Sistemas */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sistema
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Downloads
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {systems.map((system) => (
                    <tr key={system.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-yellow-100 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-lg">📱</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{system.name}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {system.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          {system.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">★</span>
                          <span>{system.rating ? Number(system.rating).toFixed(1) : '0.0'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {system.downloads?.toLocaleString() || '0'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditSystem(system)}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => handleDeleteSystem(system.id)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Excluir
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Formulário */}
      {showForm && (
        <SystemForm
          system={editingSystem}
          onClose={() => {
            setShowForm(false);
            setEditingSystem(null);
          }}
          onSubmit={handleFormSubmit}
        />
      )}

      {/* Overlay para mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}