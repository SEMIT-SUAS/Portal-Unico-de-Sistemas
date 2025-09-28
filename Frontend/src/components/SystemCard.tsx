import React from "react";
import { ExternalLink, Download, Star, Calendar, Ban } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
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

  // Verificar se o sistema é novo e calcular informações
  const systemCreatedAt = system.createdAt || systemUtils.generateDemoDate(Math.random() * 365);
  const isNew = systemUtils.isNewSystem(systemCreatedAt) && !isInactive;
  const daysRemaining = systemUtils.getDaysRemaining(systemCreatedAt);
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

    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-32">
      {/* REMOVIDA COMPLETAMENTE a div da tag NOVO */}

      
      <div className="h-full">
        <div className="flex h-full p-4">
          {/* Ícone no canto superior esquerdo */}
          <div className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 ${
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
          
          {/* Conteúdo à direita do ícone */}
          <div className="flex-1 ml-3 flex flex-col justify-between">
            {/* Nome e tag INATIVO na mesma linha */}
            <div onClick={handleCardClick} className="cursor-pointer">
              <div className="flex items-start justify-between mb-2">
                <CardTitle className={`text-sm leading-tight line-clamp-2 transition-colors flex-1 mr-2 ${
                  isInactive 
                    ? 'text-gray-800' // Texto mais escuro para inativos
                    : 'group-hover:text-blue-600'
                }`}>
                  {system.name}
                </CardTitle>
                
                {/* Tag INATIVO vermelha ao lado do nome */}
                {isInactive && (
                  <Badge variant="default" className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 flex items-center gap-1 shrink-0">
                    <Ban className="h-3 w-3" />
                    INATIVO
                  </Badge>
                )}
              </div>
              
              {/* Informações de data */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1 text-xs ${
                  isInactive ? 'text-gray-600' : 'text-gray-500' // Texto mais escuro para inativos
                }">
                  <Calendar className="h-3 w-3" />
                  <span>{systemUtils.getRelativeTime(system.createdAt || systemUtils.generateDemoDate(10))}</span>
                </div>

                {isNew && !isInactive && (
                  <Badge variant="outline" className="text-xs px-1.5 py-0 border-green-200 text-green-700 bg-green-50">
                    {daysRemaining}d restantes
                  </Badge>
                )}

              </div>
              
              {/* Downloads e avaliação */}
              <div className="flex items-center gap-4">
                {system.downloads && (
                  <div className="flex items-center gap-1 text-xs ${
                    isInactive ? 'text-gray-600' : 'text-gray-600' // Texto mais escuro para inativos
                  }">
                    <Download className="h-3 w-3" />
                    <span>{formatDownloads(system.downloads)}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-1 text-xs ${
                  isInactive ? 'text-gray-600' : 'text-gray-600' // Texto mais escuro para inativos
                }">
                  <Star className={`h-3 w-3 ${isInactive ? 'text-gray-500' : 'fill-yellow-400 text-yellow-400'}`} />
                  <span>{system.rating !== null && system.rating !== undefined ? Number(system.rating).toFixed(1) : '0.0'}</span>
                  {system.reviewsCount && (
                    <span className={isInactive ? 'text-gray-500' : 'text-gray-400'}>({system.reviewsCount})</span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Botão na parte inferior - mantém a cor original para inativos */}
            <Button 
              size="sm"
              className={`w-full text-xs h-7 ${
                isInactive
                  ? 'bg-gray-400 hover:bg-gray-500 cursor-not-allowed' // Mantém cinza para inativos
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
              onClick={handleAccessClick}
              disabled={isInactive}
            >
              {isInactive ? (
                <>
                  <Ban className="h-3 w-3 mr-1" />
                  Indisponível
                </>
              ) : (
                <>
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Acessar
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}