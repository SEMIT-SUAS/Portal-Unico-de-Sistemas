
// src/components/SystemModal.tsx
import React from "react";
import { useState } from "react";
import { ExternalLink, Calendar, Users, Building, CheckCircle, Download, Star, Smartphone, MessageSquare, Code, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { DigitalSystem } from "../data/systems";
import { ReviewsModal } from "./ReviewsModal";
import { RatingModal, RatingData } from "./RatingModal";
import { systemService } from "../services/api";

interface SystemModalProps {
  system: DigitalSystem | null;
  onClose: () => void;
  onSystemUpdate?: (updatedSystem: DigitalSystem) => void;
}

export function SystemModal({ system, onClose, onSystemUpdate }: SystemModalProps) {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isAccessing, setIsAccessing] = useState(false);

  if (!system) return null;

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toLocaleString('pt-BR');
  };

  // Corrigir: garantir que rating seja sempre um número
  const getRatingNumber = (rating: any): number => {
    if (typeof rating === 'number') return rating;
    if (typeof rating === 'string') return parseFloat(rating) || 0;
    return 0;
  };

  const renderStars = (rating: number) => {
    const numericRating = getRatingNumber(rating);
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < Math.floor(numericRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  // ✅ FUNÇÃO DE DOWNLOAD DO PWA ATUALIZADA
  const handlePwaDownload = async () => {
    if (!system || !system.hasPWA || !isValidUrl(system.pwaUrl)) return;

    try {
      setIsDownloading(true);
      
      console.log(`📥 Iniciando download para: ${system.name} (ID: ${system.id})`);
      console.log(`📊 Downloads atuais: ${system.downloads || 0}`);
      
      // 1. Contabilizar download no backend (BANCO DE DADOS REAL)
      try {
        const response = await systemService.incrementDownloads(system.id);
        console.log('✅ Download contabilizado NO BANCO:', response.data);
        
        // 2. Atualizar o sistema localmente com o valor REAL do banco
        if (onSystemUpdate) {
          const updatedSystem: DigitalSystem = {
            ...system,
            downloads: response.data.newCount // ✅ USA O VALOR REAL DO BANCO
          };
          onSystemUpdate(updatedSystem);
          console.log('📊 Contador de downloads atualizado com valor REAL:', response.data.newCount);
        }
      } catch (apiError) {
        console.warn('⚠️ API de downloads falhou, mas continuando com o download...', apiError);
        // Não impedir o download mesmo se a API falhar
      }
      
      // 3. Abrir o link do PWA (sempre executa)
      console.log(`🌐 Abrindo URL: ${system.pwaUrl}`);
      window.open(system.pwaUrl, '_blank', 'noopener,noreferrer');
      
    } catch (error) {
      console.error('❌ Erro inesperado durante download:', error);
      window.open(system.pwaUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setIsDownloading(false);
    }
  };

  // ✅ NOVA FUNÇÃO: ACESSAR SISTEMA COM CONTAGEM
  const handleSystemAccess = async () => {
    if (!system || !isValidUrl(system.accessUrl)) return;

    try {
      setIsAccessing(true);
      
      console.log(`🚀 Iniciando acesso para: ${system.name} (ID: ${system.id})`);
      console.log(`📈 Acessos atuais: ${system.usageCount || 0}`);
      
      // 1. Contabilizar acesso no backend (BANCO DE DADOS REAL)
      try {
        const response = await systemService.incrementAccess(system.id);
        console.log('✅ Acesso contabilizado NO BANCO:', response.data);

         // ✅ CORREÇÃO: Garantir que newCount seja número
        const newCount = Number(response.data.newCount) || (system.usageCount || 0) + 1;
        
        // 2. Atualizar o sistema localmente com o valor REAL do banco
        if (onSystemUpdate) {
          const updatedSystem: DigitalSystem = {
            ...system,
            usageCount: newCount // ✅ USA O VALOR COVERTIDO PARA NUMERO
          };
          onSystemUpdate(updatedSystem);
          console.log('📈 Contador de acessos atualizado com valor REAL:', response.data.newCount);
        }
      } catch (apiError) {
        console.warn('⚠️ API de acessos falhou, mas continuando com o acesso...', apiError);
        // Não impedir o acesso mesmo se a API falhar
      }
      
      // 3. Abrir o link do sistema (sempre executa)
      console.log(`🌐 Abrindo URL: ${system.accessUrl}`);
      window.open(system.accessUrl, '_blank', 'noopener,noreferrer');
      
    } catch (error) {
      console.error('❌ Erro inesperado durante acesso:', error);
      window.open(system.accessUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setIsAccessing(false);
    }
  };

  const handleRatingSubmit = (ratingData: RatingData) => {
    if (!system || !onSystemUpdate) return;

    // Create new review
    const newReview = {
      id: Date.now().toString(),
      userName: `Usuário${Math.floor(Math.random() * 1000)}`,
      rating: ratingData.rating,
      comment: ratingData.comment,
      date: new Date().toISOString().split('T')[0]
    };

    // Update system data
    const currentReviews = system.userReviews || [];
    const updatedReviews = [newReview, ...currentReviews];
    
    // Recalculate rating - garantir que seja número
    const totalRating = updatedReviews.reduce((sum, review) => sum + review.rating, 0);
    const newRating = totalRating / updatedReviews.length;

    const updatedSystem: DigitalSystem = {
      ...system,
      userReviews: updatedReviews,
      rating: newRating,
      reviewsCount: updatedReviews.length
    };

    onSystemUpdate(updatedSystem);
    
    // Save demographic and location data (in real app, send to backend)
    console.log('Rating submitted:', {
      systemId: system.id,
      rating: ratingData.rating,
      comment: ratingData.comment,
      demographics: ratingData.demographics,
      location: ratingData.location
    });
  };

  // Função simplificada para verificar URL válida
  const isValidUrl = (url: string | undefined) => {
    return url && url !== '#' && (url.startsWith('http://') || url.startsWith('https://'));
  };

  const displayedReviews = system.userReviews?.slice(0, 3) || [];
  const hasMoreReviews = (system.userReviews?.length || 0) > 3;

  // Obter rating numérico seguro
  const safeRating = getRatingNumber(system.rating);

  return (
    <>
      <Dialog open={!!system} onOpenChange={() => onClose()}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto overflor-x-hidden">
          <DialogHeader>
            <DialogTitle className="sr-only">{system.name}</DialogTitle>
            <DialogDescription className="sr-only">
              Detalhes do sistema {system.name} da Prefeitura de São Luís
            </DialogDescription>
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-yellow-100 flex-shrink-0">
                <ImageWithFallback
                  src={system.iconUrl || ""}
                  alt={`Ícone do ${system.name}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-2xl line-clamp-2 pr-2 font-semibold break-words">
                    {system.name}
                  </h2>
                  {system.isNew && (
                    <Badge variant="destructive" className="bg-yellow-500 hover:bg-yellow-600 flex-shrink-0">
                      NOVO
                    </Badge>
                  )}
                </div>
                <p className="text-gray-600 mt-2 break-words">{system.description}</p>
                
                {/* Rating, Downloads e Acessos Stats */}
                <div className="flex items-center gap-6 mt-3 flex-wrap">
                  {safeRating > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {renderStars(safeRating)}
                      </div>
                      <span className="font-semibold">{safeRating.toFixed(1)}</span>
                      {system.reviewsCount && (
                        <span className="text-gray-500 text-sm">({system.reviewsCount} avaliações)</span>
                      )}
                    </div>
                  )}
                  
                  {/* ✅ AGORA VAI MOSTRAR OS ACESSOS CORRETAMENTE */}
                  {/* <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-blue-600" />
                    <span className="font-semibold text-blue-600">
                      {formatNumber(system.usageCount || 0)} acessos
                    </span>
                  </div>
                  
                  {system.downloads && (
                    <div className="flex items-center gap-2">
                      <Download className="h-4 w-4 text-green-600" />
                      <span className="font-semibold text-green-600">{formatNumber(system.downloads)} downloads</span>
                    </div>
                  )} */}
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* System Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Users className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">Público-alvo</p>
                  <p className="text-sm text-gray-600 truncate">{system.targetAudience}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Building className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Secretaria</p>
                  <p className="text-sm text-gray-600">{system.responsibleSecretary}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Ano de Lançamento</p>
                  <p className="text-sm text-gray-600">{system.launchYear}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Code className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Desenvolvidor Por:</p>
                  <p className="text-sm text-gray-600">{system.developer}</p>
                </div>
              </div>
              
            </div>

            <Separator />

            {/* Action Buttons ATUALIZADOS */}
            <div className="flex gap-3 flex-col sm:flex-row">
              <Button 
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={handleSystemAccess}
                disabled={!isValidUrl(system.accessUrl) || isAccessing}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                {isAccessing ? 'Acessando...' : 'Acessar Sistema'}
              </Button>
              
              {system.hasPWA && (
                <Button 
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={handlePwaDownload}
                  disabled={!isValidUrl(system.pwaUrl) || isDownloading}
                >
                  <Smartphone className="h-4 w-4 mr-2" />
                  {isDownloading ? 'Baixando...' : 'Baixar App (PWA)'}
                </Button>
              )}
            </div>

            <Separator />

            {/* About System */}
            <div>
              <h3 className="font-semibold mb-3">Sobre o Sistema</h3>
              <p className="text-gray-700 leading-relaxed break-words">{system.fullDescription}</p>
            </div>

            <Separator />

            {/* Main Features */}
            <div>
              <h3 className="font-semibold mb-3">Principais Funcionalidades</h3>
              <div className="grid gap-2">
                {system.mainFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700 break-words">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* User Reviews */}
            {(displayedReviews.length > 0 || !system.userReviews?.length) && (
              <>
                <Separator />
                <div>
                  <div className="flex items-center justify-between mb-4 flex-col sm:flex-row gap-2">
                    <h3 className="font-semibold">Avaliações dos Usuários</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowRatingModal(true)}
                      className="gap-2"
                    >
                      <Star className="h-4 w-4" />
                      Avaliar
                    </Button>
                  </div>
                  
                  {displayedReviews.length > 0 ? (
                    <div className="space-y-4">
                      {displayedReviews.map((review) => (
                        <div key={review.id} className="border rounded-lg p-4 bg-gray-50">
                          <div className="flex items-start justify-between mb-2 flex-col sm:flex-row gap-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                {review.userName.charAt(0)}
                              </div>
                              <span className="font-medium break-words">{review.userName}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {renderStars(review.rating)}
                              <span className="text-sm text-gray-500 ml-1">
                                {new Date(review.date).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                          </div>
                          <p className="text-gray-700 leading-relaxed break-words">{review.comment}</p>
                        </div>
                      ))}
                      
                      {hasMoreReviews && (
                        <Button
                          variant="outline"
                          onClick={() => setShowAllReviews(true)}
                          className="w-full gap-2"
                        >
                          <MessageSquare className="h-4 w-4" />
                          Ver mais comentários ({(system.userReviews?.length || 0) - 3} restantes)
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>Seja o primeiro a avaliar este sistema!</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Close Button */}
            <div className="flex justify-end pt-4">
              <Button 
                variant="outline" 
                onClick={onClose}
                className="px-6"
              >
                Fechar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reviews Modal */}
      <ReviewsModal
        reviews={system.userReviews || []}
        systemName={system.name}
        isOpen={showAllReviews}
        onClose={() => setShowAllReviews(false)}
      />

      {/* Rating Modal */}
      <RatingModal
        systemName={system.name}
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onSubmit={handleRatingSubmit}
      />
    </>
  );
}