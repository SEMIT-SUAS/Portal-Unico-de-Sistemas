// src/components/SystemModal.tsx
import React from "react";
import { useState, useEffect } from "react";
import { ExternalLink, Calendar, Users, Building, CheckCircle, Download, Star, Smartphone, MessageSquare, Code, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { DigitalSystem } from "../data/systems";
import { ReviewsModal } from "./ReviewsModal";
import { RatingModal, RatingData } from "./RatingModal";

interface SystemModalProps {
  system: DigitalSystem | null;
  onClose: () => void;
  onSystemUpdate?: (updatedSystem: DigitalSystem) => void;
  onAddReview?: (systemId: number, ratingData: any) => Promise<boolean>;
  onDownload?: () => void;
  onAccess?: () => void;
  reviewLoading?: boolean;
  cachedReviews?: any[];
}

export function SystemModal({ 
  system, 
  onClose, 
  onSystemUpdate, 
  onAddReview, 
  onDownload,
  onAccess,
  reviewLoading = false,
  cachedReviews = []
}: SystemModalProps) {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isAccessing, setIsAccessing] = useState(false);
  const [localReviews, setLocalReviews] = useState<any[]>([]);

  // Inicializa reviews locais quando o sistema muda
  useEffect(() => {
    if (system) {
      setLocalReviews(system.userReviews || []);
    }
  }, [system]);

  if (!system) return null;

  // Combina reviews: cache (com "enviando...") + reviews locais
  const allReviews = [...cachedReviews, ...localReviews];
  const displayedReviews = allReviews.slice(0, 3);
  const hasMoreReviews = allReviews.length > 3;

  // Calcula rating baseado em todas as reviews
  const calculateRating = () => {
    if (allReviews.length === 0) return system.rating || 0;
    const totalRating = allReviews.reduce((sum: number, review: any) => sum + review.rating, 0);
    return parseFloat((totalRating / allReviews.length).toFixed(1));
  };

  const currentRating = calculateRating();

  const formatNumber = (num: number | undefined) => {
    if (!num) return "0";
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toLocaleString('pt-BR');
  };

  const isFeaturedSystem = system.isHighlight;
  const isNewSystem = system.isNew;

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

  const handlePwaDownload = async () => {
    if (!system || !system.hasPWA || !isValidUrl(system.pwaUrl)) return;

    try {
      setIsDownloading(true);
      
      if (onDownload) {
        onDownload();
      }
      
      window.open(system.pwaUrl, '_blank', 'noopener,noreferrer');
      
    } catch (error) {
      console.error('❌ [SYSTEMMODAL] Erro durante download:', error);
      window.open(system.pwaUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSystemAccess = async () => {
    if (!system || !isValidUrl(system.accessUrl)) return;

    try {
      setIsAccessing(true);
      
      if (onAccess) {
        onAccess();
      }
      
      window.open(system.accessUrl, '_blank', 'noopener,noreferrer');
      
    } catch (error) {
      console.error('❌ [SYSTEMMODAL] Erro durante acesso:', error);
      window.open(system.accessUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setIsAccessing(false);
    }
  };

  const handleRatingSubmit = async (ratingData: RatingData) => {
    try {
      console.log('📝 [SYSTEMMODAL] Enviando avaliação...');
      
      if (!system) return;

      // Fecha o modal de avaliação IMEDIATAMENTE
      setShowRatingModal(false);

      // Tenta enviar para o backend via App.tsx
      if (onAddReview) {
        const systemId = typeof system.id === 'string' ? parseInt(system.id, 10) : system.id;
        
        const success = await onAddReview(systemId, {
          userName: ratingData.userName.trim(),
          rating: ratingData.rating,
          comment: ratingData.comment?.trim() || '',
          demographics: ratingData.demographics,
          location: ratingData.location
        });

        if (success) {
          console.log('✅ [SYSTEMMODAL] Avaliação enviada com sucesso');
        } else {
          console.error('❌ [SYSTEMMODAL] Falha ao enviar avaliação');
        }
      }
      
    } catch (error) {
      console.error('❌ [SYSTEMMODAL] Erro ao processar avaliação:', error);
    }
  };

  const isValidUrl = (url: string | undefined) => {
    return url && url !== '#' && (url.startsWith('http://') || url.startsWith('https://'));
  };

  return (
    <>
      <Dialog open={!!system} onOpenChange={() => onClose()}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-0">
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
                  
                  <div className="flex gap-2 flex-shrink-0">
                    {isFeaturedSystem && (
                      <Badge variant="destructive" className="bg-red-500 hover:bg-red-600">
                        DESTAQUE
                      </Badge>
                    )}
                    {isNewSystem && (
                      <Badge variant="destructive" className="bg-yellow-500 hover:bg-yellow-600">
                        NOVO
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-gray-600 mt-2 break-words">{system.description}</p>
                
                <div className="flex items-center gap-6 mt-3 flex-wrap">
                  {currentRating > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {renderStars(currentRating)}
                      </div>
                      <span className="font-semibold">{currentRating.toFixed(1)}</span>
                      <span className="text-gray-500 text-sm">({allReviews.length} avaliações)</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-blue-600" />
                    <span className="font-semibold text-blue-600">
                      {formatNumber(system.usageCount)} acessos
                    </span>
                  </div>
                  
                  {system.downloads && (
                    <div className="flex items-center gap-2">
                      <Download className="h-4 w-4 text-green-600" />
                      <span className="font-semibold text-green-600">{formatNumber(system.downloads)} downloads</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
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
                  <p className="font-medium">Desenvolvido Por:</p>
                  <p className="text-sm text-gray-600">{system.developer}</p>
                </div>
              </div>
              
            </div>

            <Separator />

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

            <div>
              <h3 className="font-semibold mb-3">Sobre o Sistema</h3>
              <p className="text-gray-700 leading-relaxed break-words">{system.fullDescription}</p>
            </div>

            <Separator />

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

            <Separator />
            
            <div>
              <div className="flex items-center justify-between mb-4 flex-col sm:flex-row gap-2">
                <h3 className="font-semibold">Avaliações dos Usuários</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowRatingModal(true)}
                    className="gap-2"
                    disabled={reviewLoading}
                  >
                    <Star className="h-4 w-4" />
                    {reviewLoading ? 'Enviando...' : 'Avaliar'}
                  </Button>
                  {allReviews.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAllReviews(true)}
                      className="gap-2"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Ver todas ({allReviews.length})
                    </Button>
                  )}
                </div>
              </div>
              
              {displayedReviews.length > 0 ? (
                <div className="space-y-4">
                  {/* Indicador de avaliações sendo processadas */}
                  {cachedReviews.length > 0 && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-yellow-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-yellow-700">
                          {cachedReviews.length === 1 
                            ? '1 avaliação sendo processada...' 
                            : `${cachedReviews.length} avaliações sendo processadas...`}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {displayedReviews.map((review) => (
                    <div key={review.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-start justify-between mb-2 flex-col sm:flex-row gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {review.userName?.charAt(0) || 'U'}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium break-words">{review.userName || 'Usuário'}</span>
                            {/* Badge para avaliações otimistas */}
                            {review.id && review.id.includes('temp-') && (
                              <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full mt-1 inline-block w-fit">
                                Enviando...
                              </span>
                            )}
                          </div>
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
                      Ver mais comentários ({allReviews.length - 3} restantes)
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">Nenhuma avaliação ainda</p>
                  <p className="text-gray-600 mb-4">Seja o primeiro a avaliar este sistema!</p>
                  <Button
                    onClick={() => setShowRatingModal(true)}
                    className="gap-2"
                  >
                    <Star className="h-4 w-4" />
                    Avaliar Agora
                  </Button>
                </div>
              )}
            </div>

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

      <ReviewsModal
        reviews={allReviews}
        systemName={system.name}
        isOpen={showAllReviews}
        onClose={() => setShowAllReviews(false)}
        onOpenReviewForm={() => {
          setShowAllReviews(false);
          setTimeout(() => setShowRatingModal(true), 100);
        }}
      />

      <RatingModal
        systemName={system.name}
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onSubmit={handleRatingSubmit}
      />
    </>
  );
}