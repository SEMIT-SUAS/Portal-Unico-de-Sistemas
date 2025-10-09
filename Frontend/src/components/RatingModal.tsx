import React from "react";
import { useState } from "react";
import { Star, MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";

interface RatingModalProps {
  systemName: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (ratingData: RatingData) => void;
}

export interface RatingData {
  rating: number;
  comment: string;
  demographics: {
    cor: string;
    sexo: string;
    idade: number;
  };
  location?: {
    latitude: number;
    longitude: number;
  };
}

// Definindo tipos para os valores dos selects
type CorOption = "branca" | "preta" | "parda" | "amarela" | "indigena" | "nao-informar";
type SexoOption = "masculino" | "feminino" | "nao-binario" | "nao-informar";

export function RatingModal({ systemName, isOpen, onClose, onSubmit }: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [demographics, setDemographics] = useState({
    cor: "",
    sexo: "",
    idade: 0
  });
  const [location, setLocation] = useState<{latitude: number; longitude: number} | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [step, setStep] = useState<'rating' | 'demographics'>('rating');

  const getLocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocalização não é suportada pelo seu navegador');
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setIsGettingLocation(false);
      },
      (error) => {
        console.error('Erro ao obter localização:', error);
        alert('Não foi possível obter sua localização');
        setIsGettingLocation(false);
      }
    );
  };

  const handleRatingClick = (value: number) => {
    setRating(value);
  };

  const handleNextStep = () => {
    if (rating === 0) {
      alert('Por favor, selecione uma avaliação');
      return;
    }
    if (!comment.trim()) {
      alert('Por favor, escreva um comentário');
      return;
    }
    setStep('demographics');
  };

  const handleSubmit = () => {
    if (!demographics.cor || !demographics.sexo || demographics.idade === 0) {
      alert('Por favor, preencha todos os campos demográficos');
      return;
    }

    const ratingData: RatingData = {
      rating,
      comment,
      demographics,
      location: location || undefined
    };

    onSubmit(ratingData);
    onClose();
    
    // Reset form
    setRating(0);
    setComment("");
    setDemographics({ cor: "", sexo: "", idade: 0 });
    setLocation(null);
    setStep('rating');
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-8 w-8 cursor-pointer transition-colors ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
        }`}
        onClick={() => handleRatingClick(i + 1)}
      />
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 'rating' ? 'Avaliar Sistema' : 'Informações Demográficas'}
          </DialogTitle>
          <DialogDescription>
            {step === 'rating' 
              ? `Avalie o sistema ${systemName} e compartilhe sua experiência` 
              : 'Informações para melhorar nossos serviços'
            }
          </DialogDescription>
        </DialogHeader>

        {step === 'rating' ? (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="font-medium mb-2">Como você avalia o {systemName}?</h3>
              <div className="flex justify-center gap-1 mb-4">
                {renderStars()}
              </div>
              {rating > 0 && (
                <p className="text-sm text-gray-600">
                  {rating === 1 && "Muito ruim"}
                  {rating === 2 && "Ruim"}
                  {rating === 3 && "Regular"}
                  {rating === 4 && "Bom"}
                  {rating === 5 && "Excelente"}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="comment">Seu comentário</Label>
              <Textarea
                id="comment"
                placeholder="Conte-nos sobre sua experiência..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mt-1"
                rows={4}
              />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleNextStep} className="flex-1">
                Continuar
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Para melhorar nossos serviços, gostaríamos de conhecer melhor nossos usuários.
            </p>

            <div className="space-y-4">
              <div>
                <Label htmlFor="cor">Cor/Raça</Label>
                <Select 
                  onValueChange={(value: CorOption) => setDemographics({...demographics, cor: value})}
                  value={demographics.cor}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="branca">Branca</SelectItem>
                    <SelectItem value="preta">Preta</SelectItem>
                    <SelectItem value="parda">Parda</SelectItem>
                    <SelectItem value="amarela">Amarela</SelectItem>
                    <SelectItem value="indigena">Indígena</SelectItem>
                    <SelectItem value="nao-informar">Prefiro não informar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="sexo">Sexo</Label>
                <Select 
                  onValueChange={(value: SexoOption) => setDemographics({...demographics, sexo: value})}
                  value={demographics.sexo}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="feminino">Feminino</SelectItem>
                    <SelectItem value="nao-binario">Não-binário</SelectItem>
                    <SelectItem value="nao-informar">Prefiro não informar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="idade">Idade</Label>
                <Input
                  id="idade"
                  type="number"
                  min="1"
                  max="120"
                  value={demographics.idade || ""}
                  onChange={(e) => setDemographics({...demographics, idade: parseInt(e.target.value) || 0})}
                  placeholder="Digite sua idade"
                />
              </div>

              <div className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <Label className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Localização (opcional)
                  </Label>
                  {location && (
                    <Badge variant="secondary" className="text-xs">
                      Obtida
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-600 mb-3">
                  Sua localização nos ajuda a entender melhor a distribuição geográfica dos usuários.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={getLocation}
                  disabled={isGettingLocation || !!location}
                  className="w-full"
                >
                  {isGettingLocation ? 'Obtendo...' : location ? 'Localização obtida' : 'Obter localização'}
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep('rating')} className="flex-1">
                Voltar
              </Button>
              <Button onClick={handleSubmit} className="flex-1">
                Enviar Avaliação
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}