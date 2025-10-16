// src/components/ReviewsModal.tsx
import React from "react";
import { useState } from "react";
import { Star, ArrowLeft, ThumbsUp, ThumbsDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

// ✅ CORREÇÃO: Mudar id para string para compatibilidade
export interface UserReview {
  id: string; // ✅ Mude de number para string
  userName: string;
  rating: number;
  comment: string;
  date: string;
  cor?: string;
  sexo?: string;
  idade?: number;
  latitude?: number;
  longitude?: number;
}

interface ReviewsModalProps {
  reviews: UserReview[];
  systemName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ReviewsModal({ reviews, systemName, isOpen, onClose }: ReviewsModalProps) {
  const [filterType, setFilterType] = useState<'all' | 'good' | 'bad'>('all');

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  const filteredReviews = reviews.filter(review => {
    if (filterType === 'good') return review.rating >= 4;
    if (filterType === 'bad') return review.rating <= 3;
    return true;
  });

  const goodReviewsCount = reviews.filter(r => r.rating >= 4).length;
  const badReviewsCount = reviews.filter(r => r.rating <= 3).length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getInitial = (userName: string) => {
    return userName?.charAt(0).toUpperCase() || 'U';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Avaliações de {systemName}</DialogTitle>
          <DialogDescription className="sr-only">
            Visualizar todas as avaliações do sistema {systemName}
          </DialogDescription>
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold">
              Avaliações de {systemName}
            </h2>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Filter Buttons */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filterType === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('all')}
              className="gap-2"
            >
              Todas ({reviews.length})
            </Button>
            <Button
              variant={filterType === 'good' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('good')}
              className="gap-2"
            >
              <ThumbsUp className="h-4 w-4" />
              Positivas ({goodReviewsCount})
            </Button>
            <Button
              variant={filterType === 'bad' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('bad')}
              className="gap-2"
            >
              <ThumbsDown className="h-4 w-4" />
              Críticas ({badReviewsCount})
            </Button>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {filteredReviews.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nenhuma avaliação encontrada para este filtro.
              </div>
            ) : (
              filteredReviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-4 bg-white">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {getInitial(review.userName)}
                      </div>
                      <div>
                        <span className="font-medium">{review.userName}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            {renderStars(review.rating)}
                          </div>
                          <Badge 
                            variant={review.rating >= 4 ? 'default' : 'destructive'}
                            className="text-xs"
                          >
                            {review.rating >= 4 ? 'Positiva' : 'Crítica'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDate(review.date)}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                  
                  {/* Informações demográficas */}
                  {(review.cor || review.sexo || review.idade) && (
                    <div className="flex gap-4 mt-3 pt-3 border-t text-xs text-gray-500">
                      {review.idade && <span>Idade: {review.idade} anos</span>}
                      {review.sexo && <span>Sexo: {review.sexo}</span>}
                      {review.cor && <span>Cor: {review.cor}</span>}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}