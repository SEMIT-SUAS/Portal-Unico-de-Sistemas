import { useState } from "react";
import { ExternalLink, Calendar, Users, Building, CheckCircle, Download, Star, Smartphone, MessageSquare } from "lucide-react";
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
}

export function SystemModal({ system, onClose, onSystemUpdate }: SystemModalProps) {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);

  if (!system) return null;

  const formatDownloads = (downloads: number) => {
    if (downloads >= 1000000) {
      return `${(downloads / 1000000).toFixed(1)}M`;
    } else if (downloads >= 1000) {
      return `${(downloads / 1000).toFixed(1)}k`;
    }
    return downloads.toLocaleString('pt-BR');
  };

  const renderStars = (rating: any) => {
    // Converte para número e trata valores inválidos
    const numericRating = Number(rating);
    const validRating = !isNaN(numericRating) ? Math.max(0, Math.min(5, numericRating)) : 0;
    const floorRating = Math.floor(validRating);
    
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < floorRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
      />
    ));
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
    
    // Recalculate rating
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

  const displayedReviews = system.userReviews?.slice(0, 3) || [];
  const hasMoreReviews = (system.userReviews?.length || 0) > 3;

  return (
    <>
      <Dialog open={!!system} onOpenChange={() => onClose()}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
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
                  <h2 className="text-2xl line-clamp-2 pr-2 font-semibold">
                    {system.name}
                  </h2>
                  {system.isNew && (
                    <Badge variant="destructive" className="bg-yellow-500 hover:bg-yellow-600">
                      NOVO
                    </Badge>
                  )}
                </div>
                <p className="text-gray-600 mt-2">{system.description}</p>
                
                {/* Rating and Downloads Stats */}
                <div className="flex items-center gap-6 mt-3">
                  {/* Corrigido: sempre mostra o rating, mesmo que seja 0 */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {renderStars(system.rating)}
                    </div>
                    <span className="font-semibold">
                      {system.rating !== null && system.rating !== undefined 
                        ? Number(system.rating).toFixed(1) 
                        : '0.0'
                      }
                    </span>
                    {system.reviewsCount && (
                      <span className="text-gray-500 text-sm">({system.reviewsCount} avaliações)</span>
                    )}
                  </div>
                  
                  {system.downloads && (
                    <div className="flex items-center gap-2">
                      <Download className="h-4 w-4 text-green-600" />
                      <span className="font-semibold text-green-600">{formatDownloads(system.downloads)} downloads</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* System Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Público-alvo</p>
                  <p className="text-sm text-gray-600">{system.targetAudience}</p>
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

              {system.usageCount && (
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Usuários Ativos</p>
                    <p className="text-sm text-blue-600 font-semibold">
                      {system.usageCount.toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Action Buttons - Moved before About System */}
            <div className="flex gap-3">
              <Button 
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  if (system.accessUrl && system.accessUrl !== '#') {
                    window.open(system.accessUrl, '_blank');
                  }
                }}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Acessar Sistema
              </Button>
              
              {system.hasPWA && (
                <Button 
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    if (system.pwaUrl && system.pwaUrl !== '#') {
                      window.open(system.pwaUrl, '_blank');
                    }
                  }}
                >
                  <Smartphone className="h-4 w-4 mr-2" />
                  Baixar App (PWA)
                </Button>
              )}
            </div>

            <Separator />

            {/* About System */}
            <div>
              <h3 className="font-semibold mb-3">Sobre o Sistema</h3>
              <p className="text-gray-700 leading-relaxed">{system.fullDescription}</p>
            </div>

            <Separator />

            {/* Main Features */}
            <div>
              <h3 className="font-semibold mb-3">Principais Funcionalidades</h3>
              <div className="grid gap-2">
                {system.mainFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* User Reviews */}
            {(displayedReviews.length > 0 || !system.userReviews?.length) && (
              <>
                <Separator />
                <div>
                  <div className="flex items-center justify-between mb-4">
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
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                {review.userName.charAt(0)}
                              </div>
                              <span className="font-medium">{review.userName}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {renderStars(review.rating)}
                              <span className="text-sm text-gray-500 ml-1">
                                {new Date(review.date).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                          </div>
                          <p className="text-gray-700 leading-relaxed">{review.comment}</p>
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