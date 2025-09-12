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
    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col">
      <div onClick={() => onSystemClick(system)} className="flex-1">
        <CardHeader className="pb-3 p-4">
          {/* Larger Icon in rectangular layout */}
          <div className="w-20 h-20 mx-auto rounded-xl overflow-hidden bg-gradient-to-br from-blue-100 to-yellow-100 flex-shrink-0 mb-4">
            <ImageWithFallback
              src={system.iconUrl || ""}
              alt={`Ícone do ${system.name}`}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-2">
              <CardTitle className="text-sm leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                {system.name}
              </CardTitle>
              {system.isNew && (
                <Badge variant="destructive" className="bg-yellow-500 hover:bg-yellow-600 text-xs px-1.5 py-0.5 ml-1">
                  NOVO
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0 pb-3 p-4">
          <div className="flex items-center justify-between">
            {/* Downloads */}
            {system.downloads && (
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Download className="h-3 w-3" />
                <span>{formatDownloads(system.downloads)}</span>
              </div>
            )}
            
            {/* Rating */}
            {system.rating && (
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{system.rating.toFixed(1)}</span>
                {system.reviewsCount && (
                  <span className="text-gray-400">({system.reviewsCount})</span>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </div>

      <CardFooter className="pt-0 p-4">
        <Button 
          size="sm"
          className="w-full bg-blue-600 hover:bg-blue-700 text-xs h-8"
          onClick={(e) => {
            e.stopPropagation();
            if (system.accessUrl && system.accessUrl !== '#') {
              window.open(system.accessUrl, '_blank');
            }
          }}
        >
          <ExternalLink className="h-3 w-3 mr-1" />
          Acessar
        </Button>
      </CardFooter>
    </Card>
  );
}