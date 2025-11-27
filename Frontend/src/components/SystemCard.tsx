// src/components/SystemCard.tsx
import React from "react";
import { Download, Star, Calendar, Ban } from "lucide-react";
import { Card, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { DigitalSystem } from "../data/systems";
import { systemUtils } from "../utils/systemUtils";

interface SystemCardProps {
  system: DigitalSystem;
  onSystemClick: (system: DigitalSystem) => void;
}

export function SystemCard({ system, onSystemClick }: SystemCardProps) {

  // Lógica simples: apenas categoria 'inativos' marca como inativo
  const isInactive = system.category === 'inativos';

  // Verificar se o sistema é novo (apenas para referência, não usado no UI)
  const systemCreatedAt = system.createdAt || systemUtils.generateDemoDate(Math.random() * 365);
  const relativeTime = systemUtils.getRelativeTime(systemCreatedAt);

  const formatDownloads = (downloads: number) => {
    if (downloads >= 1000) {
      return `${(downloads / 1000).toFixed(1)}k`;
    }
    return downloads.toString();
  };

  const handleAccessClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    
    // Se o sistema está inativo, não permite acesso
    if (isInactive) {
      return;
    }
    
    if (system.accessUrl && system.accessUrl !== '#') {
      window.open(system.accessUrl, '_blank');
    } else {
      onSystemClick(system);
    }
  };

  const handleCardClick = () => {
    // Permite clicar no card mesmo para sistemas inativos (para ver detalhes)
    onSystemClick(system);
  };

  return (
    <Card 
      className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-full relative overflow-hidden"
      onClick={handleCardClick} // Move o clique para o card inteiro
    >
      {/* Bolinha de status no canto superior direito */}
      <div className={`absolute top-1.5 right-2 w-3 h-3 rounded-full z-10 border-2 border-white shadow-sm ${
        isInactive ? 'bg-destructive' : 'bg-green-600'
      }`} />
      
      <div className="w-full h-full">
        {/* Ajustei o padding-top para descer o conteúdo */}
        <div className="flex p-4 pt-6 items-start h-full w-full">
          {/* Ícone com tamanho responsivo */}
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
          
          {/* Conteúdo à direita - REMOVIDA a classe cursor-pointer das divs internas */}
          <div className="flex-1 ml-3 flex flex-col justify-center min-h-0 w-full">
            {/* Nome do sistema - SEM cursor-pointer aqui */}
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
              <div className="text-xs text-gray-500 w-full">
                <span className="line-clamp-1 break-words w-full">{system.responsibleSecretary}</span>
              </div>
            )}
            
            {/* Linha inferior: Avaliação + Badge INATIVO */}
            <div className="flex items-center justify-between w-full mt-1">
              <div className="flex items-center gap-1 text-xs text-gray-600 flex-shrink-0">
                <Star className={`h-3 w-3 ${isInactive ? 'text-gray-500' : 'fill-yellow-400 text-yellow-400'}`} />
                <span>{system.rating !== null && system.rating !== undefined ? Number(system.rating).toFixed(1) : '0.0'}</span>
                {system.reviewsCount && (
                  <span className={isInactive ? 'text-gray-500' : 'text-gray-400'}>({system.reviewsCount})</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}