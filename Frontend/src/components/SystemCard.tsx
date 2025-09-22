import { ExternalLink, Download, Star } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { DigitalSystem } from "../data/systems";

interface SystemCardProps {
  system: DigitalSystem;
  onSystemClick: (system: DigitalSystem) => void;
}

export function SystemCard({ system, onSystemClick }: SystemCardProps) {
  const formatDownloads = (downloads: number) => {
    if (downloads >= 1000) {
      return `${(downloads / 1000).toFixed(1)}k`;
    }
    return downloads.toString();
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-32">
      <div className="h-full">
        <div className="flex h-full p-4">
          {/* Ícone no canto superior esquerdo */}
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-yellow-100 flex-shrink-0">
            <ImageWithFallback
              src={system.iconUrl || ""}
              alt={`Ícone do ${system.name}`}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Conteúdo à direita do ícone */}
          <div className="flex-1 ml-3 flex flex-col justify-between">
            {/* Nome e badge no topo */}
            <div onClick={() => onSystemClick(system)} className="cursor-pointer">
              <div className="flex items-start gap-2 mb-2">
                <CardTitle className="text-sm leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors flex-1">
                  {system.name}
                </CardTitle>
                {system.isNew && (
                  <Badge variant="destructive" className="bg-yellow-500 hover:bg-yellow-600 text-xs px-1.5 py-0.5 flex-shrink-0">
                    NOVO
                  </Badge>
                )}
              </div>
              
              {/* Downloads e avaliação */}
              <div className="flex items-center gap-4 mb-3">
                {system.downloads && (
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Download className="h-3 w-3" />
                    <span>{formatDownloads(system.downloads)}</span>
                  </div>
                )}
                
                {system.rating && (
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{system.rating ? Number(system.rating).toFixed(1) : '0.0'}</span>
                    {system.reviewsCount && (
                      <span className="text-gray-400">({system.reviewsCount})</span>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Botão na parte inferior */}
            <Button 
              size="sm"
              className="w-full bg-blue-600 hover:bg-blue-700 text-xs h-7"
              onClick={(e) => {
                e.stopPropagation();
                if (system.accessUrl && system.accessUrl !== '#') {
                  window.open(system.accessUrl, '_blank');
                } else {
                  onSystemClick(system);
                }
              }}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Acessar
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}