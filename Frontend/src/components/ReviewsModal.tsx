// src/components/ReviewsModal.tsx
import React from "react";
import { useState } from "react";
import { Star, ArrowLeft, ThumbsUp, ThumbsDown, MessageSquare, Plus, Clock, User } from "lucide-react";
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
  onOpenReviewForm?: () => void; // ✅ Nova prop para abrir formulário
}

export function ReviewsModal({ 
  reviews, 
  systemName, 
  isOpen, 
  onClose,
  onOpenReviewForm 
}: ReviewsModalProps) {
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
  const totalReviews = reviews.length;

  // Separa avaliações otimistas das definitivas
  const pendingReviews = reviews.filter(r => r.id.includes('temp-'));
  const confirmedReviews = reviews.filter(r => !r.id.includes('temp-'));

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  const getInitial = (userName: string) => {
    return userName?.charAt(0).toUpperCase() || 'U';
  };

  // Calcula a média das avaliações
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Avaliações de {systemName}</DialogTitle>
          <DialogDescription className="sr-only">
            Visualizar todas as avaliações do sistema {systemName}
          </DialogDescription>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="p-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h2 className="text-xl font-semibold">
                  Avaliações de {systemName}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    {renderStars(Math.round(averageRating))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {averageRating.toFixed(1)} ({totalReviews} avaliações)
                  </span>
                </div>
              </div>
            </div>
            
            {/* Botão para adicionar nova avaliação */}
            {onOpenReviewForm && (
              <Button
                variant="default"
                size="sm"
                onClick={onOpenReviewForm}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Nova Avaliação
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Alert de avaliações pendentes */}
          {pendingReviews.length > 0 && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                <span className="text-sm text-yellow-700">
                  {pendingReviews.length === 1 
                    ? '1 avaliação sendo processada. Ela será confirmada em breve.' 
                    : `${pendingReviews.length} avaliações sendo processadas. Elas serão confirmadas em breve.`}
                </span>
              </div>
            </div>
          )}

          {/* Resumo estatístico */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-700">Avaliações</span>
                <Badge variant="outline" className="bg-white">
                  {totalReviews}
                </Badge>
              </div>
              <div className="mt-2 text-xs text-blue-600">
                {pendingReviews.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{pendingReviews.length} pendente(s)</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-700">Positivas</span>
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-3 w-3 text-green-600" />
                  <Badge variant="outline" className="bg-white">
                    {goodReviewsCount}
                  </Badge>
                </div>
              </div>
              <div className="mt-2 text-xs text-green-600">
                {totalReviews > 0 && (
                  <span>{Math.round((goodReviewsCount / totalReviews) * 100)}% das avaliações</span>
                )}
              </div>
            </div>
            
            <div className="bg-red-50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-red-700">Críticas</span>
                <div className="flex items-center gap-1">
                  <ThumbsDown className="h-3 w-3 text-red-600" />
                  <Badge variant="outline" className="bg-white">
                    {badReviewsCount}
                  </Badge>
                </div>
              </div>
              <div className="mt-2 text-xs text-red-600">
                {totalReviews > 0 && (
                  <span>{Math.round((badReviewsCount / totalReviews) * 100)}% das avaliações</span>
                )}
              </div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filterType === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('all')}
              className="gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              Todas ({totalReviews})
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
                {reviews.length === 0 ? (
                  <div className="space-y-4">
                    <MessageSquare className="h-12 w-12 text-gray-300 mx-auto" />
                    <p className="text-lg font-medium">Nenhuma avaliação ainda</p>
                    <p className="text-gray-600">Seja o primeiro a avaliar este sistema!</p>
                    {onOpenReviewForm && (
                      <Button
                        onClick={onOpenReviewForm}
                        className="mt-4 gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Escrever Primeira Avaliação
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <ThumbsDown className="h-12 w-12 text-gray-300 mx-auto" />
                    <p className="text-lg font-medium">Nenhuma avaliação neste filtro</p>
                    <p className="text-gray-600">Tente outro filtro para ver mais avaliações</p>
                  </div>
                )}
              </div>
            ) : (
              filteredReviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-4 bg-white">
                  {/* Badge para avaliações pendentes */}
                  {review.id.includes('temp-') && (
                    <div className="mb-3">
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        <Clock className="h-3 w-3 mr-1" />
                        Enviando...
                      </Badge>
                    </div>
                  )}
                  
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                        review.id.includes('temp-') ? 'bg-yellow-500' : 'bg-blue-600'
                      }`}>
                        {review.id.includes('temp-') ? (
                          <User className="h-5 w-5" />
                        ) : (
                          getInitial(review.userName)
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{review.userName}</span>
                          {review.id.includes('temp-') && (
                            <span className="text-xs text-yellow-600">(Você)</span>
                          )}
                        </div>
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
                    <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t text-xs text-gray-500">
                      {review.idade && (
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Idade:</span>
                          <span>{review.idade} anos</span>
                        </div>
                      )}
                      {review.sexo && (
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Sexo:</span>
                          <span>{review.sexo}</span>
                        </div>
                      )}
                      {review.cor && (
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Cor:</span>
                          <span>{review.cor}</span>
                        </div>
                      )}
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