import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { DigitalSystem } from "../data/systems";
import { useState, useEffect } from "react";

interface FeaturedSystemsProps {
  systems: DigitalSystem[];
  onSystemClick: (system: DigitalSystem) => void;
}

export function FeaturedSystems({ systems, onSystemClick }: FeaturedSystemsProps) {
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  const [currentNewIndex, setCurrentNewIndex] = useState(0);
  const [imageKey, setImageKey] = useState(0); // ✅ Key para forçar recarregamento
  
  const featuredSystems = systems.filter(system => system.isHighlight);
  const newSystems = systems.filter(system => system.isNew);

  // ✅ Efeito para forçar recarregamento das imagens quando mudar o sistema
  useEffect(() => {
    setImageKey(prev => prev + 1);
  }, [currentFeaturedIndex, currentNewIndex]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentFeaturedIndex((prevIndex) => 
        prevIndex === featuredSystems.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(timer);
  }, [featuredSystems.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentNewIndex((prevIndex) => 
        prevIndex === newSystems.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [newSystems.length]);

  if (featuredSystems.length === 0 && newSystems.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-yellow-50 py-4">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Destaques */}
          {featuredSystems.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <h2 className="text-lg font-bold text-gray-900">Destaques</h2>
              </div>
              
              <Card className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800 text-white h-48">
                <CardContent className="p-0 h-full">
                  <div className="flex h-full">
                    <div className="w-1/3 relative">
                      <ImageWithFallback
                        key={`featured-${currentFeaturedIndex}-${imageKey}`} // ✅ Key única para forçar recarregamento
                        src={featuredSystems[currentFeaturedIndex]?.iconUrl || ""}
                        alt={featuredSystems[currentFeaturedIndex]?.name || ""}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.log('❌ Erro ao carregar imagem em destaque:', featuredSystems[currentFeaturedIndex]?.iconUrl);
                          // Fallback será aplicado pelo ImageWithFallback
                        }}
                      />
                      <div className="absolute inset-0 bg-black/20"></div>
                    </div>
                    
                    <div className="flex-1 p-3 flex flex-col justify-center">
                      <h3 className="text-base font-bold mb-2 line-clamp-2">
                        {featuredSystems[currentFeaturedIndex]?.name}
                      </h3>
                      <p className="text-blue-100 text-sm mb-3 line-clamp-2">
                        {featuredSystems[currentFeaturedIndex]?.description}
                      </p>
                      <Button 
                        size="sm"
                        onClick={() => onSystemClick(featuredSystems[currentFeaturedIndex])}
                        className="bg-white text-blue-800 hover:bg-blue-50 w-fit text-xs h-7"
                      >
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>
                  
                  {/* Dots for Featured */}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                    {featuredSystems.map((_, index) => (
                      <button
                        key={index}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${
                          index === currentFeaturedIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                        onClick={() => setCurrentFeaturedIndex(index)}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Novidades */}
          {newSystems.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-yellow-500 text-black">NOVO</Badge>
                <h2 className="text-lg font-bold text-gray-900">Novidades</h2>
              </div>
              
              <Card className="relative overflow-hidden bg-gradient-to-r from-green-600 to-green-800 text-white h-48">
                <CardContent className="p-0 h-full">
                  <div className="flex h-full">
                    <div className="w-1/3 relative">
                      <ImageWithFallback
                        key={`new-${currentNewIndex}-${imageKey}`} // ✅ Key única para forçar recarregamento
                        src={newSystems[currentNewIndex]?.iconUrl || ""}
                        alt={newSystems[currentNewIndex]?.name || ""}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.log('❌ Erro ao carregar imagem em novidades:', newSystems[currentNewIndex]?.iconUrl);
                          // Fallback será aplicado pelo ImageWithFallback
                        }}
                      />
                      <div className="absolute inset-0 bg-black/20"></div>
                    </div>
                    
                    <div className="flex-1 p-3 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-yellow-500 text-black text-xs">
                          NOVO {newSystems[currentNewIndex]?.launchYear}
                        </Badge>
                      </div>
                      <h3 className="text-base font-bold mb-2 line-clamp-2">
                        {newSystems[currentNewIndex]?.name}
                      </h3>
                      <p className="text-green-100 text-sm mb-3 line-clamp-2">
                        {newSystems[currentNewIndex]?.description}
                      </p>
                      <Button 
                        size="sm"
                        onClick={() => onSystemClick(newSystems[currentNewIndex])}
                        className="bg-white text-green-800 hover:bg-green-50 w-fit text-xs h-7"
                      >
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>
                  
                  {/* Dots for New */}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                    {newSystems.map((_, index) => (
                      <button
                        key={index}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${
                          index === currentNewIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                        onClick={() => setCurrentNewIndex(index)}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}