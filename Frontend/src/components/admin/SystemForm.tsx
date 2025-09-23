import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { DigitalSystem } from '../../data/systems';
import { api } from '../../services/api';

interface SystemFormProps {
  system?: DigitalSystem | null;
  onClose: () => void;
  onSubmit: () => void;
}

const defaultSystem: Partial<DigitalSystem> = {
  name: '',
  description: '',
  fullDescription: '',
  category: 'Saúde',
  targetAudience: '',
  responsibleSecretary: '',
  launchYear: new Date().getFullYear(),
  accessUrl: '',
  pwaUrl: '',
  iconUrl: '',
  isNew: false,
  rating: 0,
  downloads: 0,
  usageCount: 0,
  reviewsCount: 0,
  mainFeatures: [],
  userReviews: []
};

const categories = [
  'Saúde',
  'Educação',
  'Mobilidade',
  'Segurança',
  'Financeiro',
  'Social',
  'Ambiental',
  'Cultural',
  'Administrativo'
];

const secretaries = [
  'Secretaria Municipal de Saúde',
  'Secretaria Municipal de Educação',
  'Secretaria Municipal de Mobilidade',
  'Secretaria Municipal de Segurança',
  'Secretaria Municipal de Finanças',
  'Secretaria Municipal de Assistência Social',
  'Secretaria Municipal de Meio Ambiente',
  'Secretaria Municipal de Cultura',
  'Secretaria Municipal de Administração'
];

export function SystemForm({ system, onClose, onSubmit }: SystemFormProps) {
  const [formData, setFormData] = useState<Partial<DigitalSystem>>(defaultSystem);
  const [loading, setLoading] = useState(false);
  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    if (system) {
      setFormData(system);
    } else {
      setFormData(defaultSystem);
    }
  }, [system]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        mainFeatures: [...(prev.mainFeatures || []), newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      mainFeatures: prev.mainFeatures?.filter((_, i) => i !== index) || []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (system?.id) {
        // Editar sistema existente
        await api.put(`/admin/systems/${system.id}`, formData);
      } else {
        // Criar novo sistema
        await api.post('/admin/systems', formData);
      }
      
      onSubmit();
    } catch (error) {
      console.error('Erro ao salvar sistema:', error);
      alert('Erro ao salvar sistema. Verifique o console para mais detalhes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {system ? 'Editar Sistema' : 'Novo Sistema'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Sistema *
              </label>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Sistema de Agendamento de Consultas"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria *
              </label>
              <select
                required
                value={formData.category || ''}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione uma categoria</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição Curta *
              </label>
              <input
                type="text"
                required
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Breve descrição do sistema"
                maxLength={200}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição Completa
              </label>
              <textarea
                value={formData.fullDescription || ''}
                onChange={(e) => handleInputChange('fullDescription', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Descrição detalhada do sistema"
              />
            </div>
          </div>

          {/* Informações Institucionais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Público-Alvo
              </label>
              <input
                type="text"
                value={formData.targetAudience || ''}
                onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Cidadãos, Servidores, Empresas"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secretaria Responsável
              </label>
              <select
                value={formData.responsibleSecretary || ''}
                onChange={(e) => handleInputChange('responsibleSecretary', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione uma secretaria</option>
                {secretaries.map(sec => (
                  <option key={sec} value={sec}>{sec}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ano de Lançamento
              </label>
              <input
                type="number"
                min="2000"
                max={new Date().getFullYear()}
                value={formData.launchYear || ''}
                onChange={(e) => handleInputChange('launchYear', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isNew"
                checked={formData.isNew || false}
                onChange={(e) => handleInputChange('isNew', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isNew" className="ml-2 block text-sm text-gray-700">
                Marcar como "Novo"
              </label>
            </div>
          </div>

          {/* URLs e Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL de Acesso
              </label>
              <input
                type="url"
                value={formData.accessUrl || ''}
                onChange={(e) => handleInputChange('accessUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://exemplo.prefeitura.gov.br"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL do PWA (App)
              </label>
              <input
                type="url"
                value={formData.pwaUrl || ''}
                onChange={(e) => handleInputChange('pwaUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://exemplo.pwa.com"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL do Ícone
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={formData.iconUrl || ''}
                  onChange={(e) => handleInputChange('iconUrl', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://exemplo.com/icon.png"
                />
                <Button type="button" variant="outline" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload
                </Button>
              </div>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating (0-5)
              </label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating || 0}
                onChange={(e) => handleInputChange('rating', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Downloads
              </label>
              <input
                type="number"
                min="0"
                value={formData.downloads || 0}
                onChange={(e) => handleInputChange('downloads', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usuários Ativos
              </label>
              <input
                type="number"
                min="0"
                value={formData.usageCount || 0}
                onChange={(e) => handleInputChange('usageCount', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nº de Avaliações
              </label>
              <input
                type="number"
                min="0"
                value={formData.reviewsCount || 0}
                onChange={(e) => handleInputChange('reviewsCount', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Funcionalidades Principais */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Funcionalidades Principais
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Adicionar funcionalidade"
              />
              <Button type="button" onClick={handleAddFeature}>
                Adicionar
              </Button>
            </div>
            
            <div className="space-y-2">
              {formData.mainFeatures?.map((feature, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                  <span>{feature}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveFeature(index)}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Ações */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? 'Salvando...' : (system ? 'Atualizar' : 'Criar Sistema')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}