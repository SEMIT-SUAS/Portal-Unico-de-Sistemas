// src/components/SystemCard.tsx
import React, { useState, useEffect } from "react";
import { Download, Star, Clock, Eye } from "lucide-react";
import { Card, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { DigitalSystem } from "../data/systems";

interface SystemCardProps {
  system: DigitalSystem;
  onSystemClick: (system: DigitalSystem) => void;
  forceRefreshKey?: string;
}

export function SystemCard({ system, onSystemClick, forceRefreshKey }: SystemCardProps) {
  const [displayRating, setDisplayRating] = useState<number>(0);
  const [displayReviewsCount, setDisplayReviewsCount] = useState<number>(0);

  // Lógica simples: apenas categoria 'inativos' marca como inativo
  const isInactive = system.category === 'inativos';

  // Atualiza os valores quando o sistema muda
  useEffect(() => {
    const newRating = system.rating !== null && system.rating !== undefined 
      ? Number(system.rating) 
      : 0;
    
    const newReviewsCount = system.reviewsCount || 0;

    // Atualiza suavemente
    setDisplayRating(newRating);
    setDisplayReviewsCount(newReviewsCount);
  }, [system.rating, system.reviewsCount, forceRefreshKey]);

  const formatDownloads = (downloads: number | undefined) => {
    if (!downloads) return "0";
    if (downloads >= 1000) {
      return `${(downloads / 1000).toFixed(1)}k`;
    }
    return downloads.toString();
  };

  const formatAccesses = (accesses: number | undefined) => {
    if (!accesses) return "0";
    if (accesses >= 1000) {
      return `${(accesses / 1000).toFixed(1)}k`;
    }
    return accesses.toString();
  };

  const handleCardClick = () => {
    onSystemClick(system);
  };

  // Formata o rating para exibição
  const formattedRating = displayRating.toFixed(1);

  // Valores seguros para exibição
  const safeDownloads = system.downloads || 0;
  const safeUsageCount = system.usageCount || 0;

  return (
    <Card 
      className={`group hover:shadow-lg transition-all duration-300 cursor-pointer h-full relative overflow-hidden ${
        isInactive ? 'opacity-80' : ''
      }`}
      onClick={handleCardClick}
    >
      {/* Bolinha de status no canto superior direito */}
      <div className={`absolute top-1.5 right-2 w-3 h-3 rounded-full z-10 border-2 border-white shadow-sm ${
        isInactive ? 'bg-destructive' : 'bg-green-600'
      }`} />
      
      <div className="w-full h-full">
        <div className="flex p-4 pt-6 items-start h-full w-full">
          {/* Ícone */}
          <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0 ${
            isInactive 
              ? 'bg-gradient-to-br from-gray-100 to-gray-200' 
              : 'bg-gradient-to-br from-blue-100 to-yellow-100'
          }`}>
            <ImageWithFallback
              src={system.iconUrl || ""}
              alt={`Ícone do ${system.name}`}
              className={`w-full h-full object-cover ${isInactive ? 'grayscale' : ''}`}
            />
          </div>
          
          <div className="flex-1 ml-3 flex flex-col justify-center min-h-0 w-full">
            {/* Nome do sistema */}
            <div className="w-full">
              <CardTitle className={`text-sm leading-tight line-clamp-2 transition-colors break-words w-full ${
                isInactive 
                  ? 'text-gray-800'
                  : 'group-hover:text-blue-600'
              }`}>
                {system.name}
              </CardTitle>
            </div>
            
            {/* Secretaria Responsável */}
            {system.responsibleSecretary && (
              <div className="text-xs text-gray-500 w-full mt-1">
                <span className="line-clamp-1 break-words w-full">{system.responsibleSecretary}</span>
              </div>
            )}
            
            {/* Linha inferior: Avaliação */}
            <div className="flex items-center justify-between w-full mt-2">
              {/* Avaliação */}
              <div className="flex items-center gap-1 text-xs flex-shrink-0">
                <Star className={`h-3 w-3 ${
                  isInactive ? 'text-gray-500' : 'fill-yellow-400 text-yellow-400'
                }`} />
                <span className={`font-medium ${
                  isInactive ? 'text-gray-600' : 'text-gray-800'
                }`}>
                  {formattedRating}
                </span>
                {displayReviewsCount > 0 && (
                  <span className={`${isInactive ? 'text-gray-500' : 'text-gray-400'}`}>
                    ({displayReviewsCount})
                  </span>
                )}
              </div>
              
              {/* Downloads ou Acessos */}
              <div className="flex items-center gap-1 text-xs text-gray-500">
                {safeDownloads > 0 && (
                  <>
                    <Download className="h-3 w-3" />
                    <span>{formatDownloads(safeDownloads)}</span>
                  </>
                )}
                {safeUsageCount > 0 && safeDownloads === 0 && (
                  <>
                    <Eye className="h-3 w-3" />
                    <span>{formatAccesses(safeUsageCount)}</span>
                  </>
                )}
              </div>
            </div>
            
            {/* Indicador de sistema novo */}
            {system.isNew && (
              <div className="mt-2">
                <Badge className="bg-yellow-500 hover:bg-yellow-600 text-xs py-0.5 px-2">
                  <Clock className="h-3 w-3 mr-1" />
                  Novo
                </Badge>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}