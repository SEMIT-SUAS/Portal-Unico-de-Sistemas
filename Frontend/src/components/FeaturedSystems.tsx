import React from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [imageKey, setImageKey] = useState(0);
  
  const featuredSystems = systems.filter(system => system.isHighlight);
  const newSystems = systems.filter(system => system.isNew);

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

  // Funções de navegação para Destaques
  const nextFeatured = () => {
    setCurrentFeaturedIndex((prevIndex) => 
      prevIndex === featuredSystems.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevFeatured = () => {
    setCurrentFeaturedIndex((prevIndex) => 
      prevIndex === 0 ? featuredSystems.length - 1 : prevIndex - 1
    );
  };

  // Funções de navegação para Novidades
  const nextNew = () => {
    setCurrentNewIndex((prevIndex) => 
      prevIndex === newSystems.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevNew = () => {
    setCurrentNewIndex((prevIndex) => 
      prevIndex === 0 ? newSystems.length - 1 : prevIndex - 1
    );
  };

  if (featuredSystems.length === 0 && newSystems.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-yellow-50 py-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mx-4">
          {/* Destaques */}
          {featuredSystems.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <h2 className="text-lg font-bold text-gray-900">Destaques</h2>
              </div>
              
              <Card className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800 text-white h-48">
                <CardContent className="p-6 h-full"> {/* ✅ Alterado de p-5 para p-6 (igual Novidades) */}
                  <div className="flex h-full items-center justify-center pl-8 pr-8 py-4"> {/* ✅ Alterado pr-4 para pr-8 (igual Novidades) */}
                    {/* Setas de navegação para Destaques */}
                    {featuredSystems.length > 0 && (
                      <button
                        onClick={prevFeatured}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-1 transition-all"
                      >
                        <ChevronLeft className="h-6 w-6 text-white" />
                      </button>
                    )}
                    
                    <div className="w-1/3 relative ml-4">
                      <ImageWithFallback
                        key={`featured-${currentFeaturedIndex}-${imageKey}`}
                        src={featuredSystems[currentFeaturedIndex]?.iconUrl || ""}
                        alt={featuredSystems[currentFeaturedIndex]?.name || ""}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          console.log('❌ Erro ao carregar imagem em destaque:', featuredSystems[currentFeaturedIndex]?.iconUrl);
                        }}
                      />
                      <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
                    </div>
                    
                    <div className="flex-1 p-4 flex flex-col justify-center">
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

                    {featuredSystems.length > 0 && (
                      <button
                        onClick={nextFeatured}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-1 transition-all"
                      >
                        <ChevronRight className="h-6 w-6 text-white" />
                      </button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Novidades */}
          {newSystems.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <h2 className="text-lg font-bold text-gray-900">Novidades</h2>
              </div>
              
              <Card className="relative overflow-hidden bg-gradient-to-r from-green-600 to-green-800 text-white h-48">
                <CardContent className="p-6 h-full">
                  <div className="flex h-full items-center justify-center pl-8 pr-8 py-4">
                    {/* Setas de navegação para Novidades */}
                    {newSystems.length > 0 && (
                      <button
                        onClick={prevNew}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-1 transition-all"
                      >
                        <ChevronLeft className="h-6 w-6 text-white" />
                      </button>
                    )}
                    
                    <div className="w-1/3 relative ml-4">
                      <ImageWithFallback
                        key={`new-${currentNewIndex}-${imageKey}`}
                        src={newSystems[currentNewIndex]?.iconUrl || ""}
                        alt={newSystems[currentNewIndex]?.name || ""}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          console.log('❌ Erro ao carregar imagem em novidades:', newSystems[currentNewIndex]?.iconUrl);
                        }}
                      />
                      <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
                    </div>
                    
                    <div className="flex-1 p-4 flex flex-col justify-center">
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

                    {newSystems.length > 0 && (
                      <button
                        onClick={nextNew}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-1 transition-all"
                      >
                        <ChevronRight className="h-6 w-6 text-white" />
                      </button>
                    )}
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