import React from "react";
import { useState } from "react";
import { Star, MapPin, User, MessageCircle, Send } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";

interface RatingModalProps {
  systemName: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (ratingData: RatingData) => void;
}

export interface RatingData {
  userName: string;
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
  const [userName, setUserName] = useState("");
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
  const [idadeError, setIdadeError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const validateIdade = (idade: number): boolean => {
    return idade >= 1 && idade <= 120;
  };

  const handleIdadeChange = (value: string) => {
    const idadeValue = parseInt(value) || 0;
    setDemographics({...demographics, idade: idadeValue});
    
    if (idadeError) {
      setIdadeError("");
    }
  };

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
    if (!userName.trim()) {
      alert('Por favor, informe seu nome');
      return;
    }
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

  const handleSubmit = async () => {
    if (!demographics.cor || !demographics.sexo || demographics.idade === 0) {
      alert('Por favor, preencha todos os campos demográficos');
      return;
    }

    if (!validateIdade(demographics.idade)) {
      setIdadeError("Por favor, informe uma idade válida (1-120)");
      return;
    }

    setIsSubmitting(true);

    try {
      const ratingData: RatingData = {
        userName: userName.trim(),
        rating,
        comment: comment.trim(),
        demographics,
        location: location || undefined
      };

      await onSubmit(ratingData);
      
      // Não resetamos imediatamente para mostrar sucesso
      setTimeout(() => {
        resetForm();
        setIsSubmitting(false);
      }, 500);
      
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
      alert('Erro ao enviar avaliação. Tente novamente.');
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setUserName("");
    setRating(0);
    setHoverRating(0);
    setComment("");
    setDemographics({ cor: "", sexo: "", idade: 0 });
    setLocation(null);
    setStep('rating');
    setIdadeError("");
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1;
      const isFilled = starValue <= (hoverRating || rating);
      
      return (
        <button
          key={i}
          type="button"
          className="p-1"
          onClick={() => handleRatingClick(starValue)}
          onMouseEnter={() => setHoverRating(starValue)}
          onMouseLeave={() => setHoverRating(0)}
          disabled={isSubmitting}
        >
          <Star
            className={`h-10 w-10 transition-all duration-200 ${
              isFilled 
                ? 'fill-yellow-400 text-yellow-400 transform scale-110' 
                : 'text-gray-300'
            } hover:scale-125`}
          />
        </button>
      );
    });
  };

  const getRatingLabel = (rating: number) => {
    switch(rating) {
      case 1: return "Muito ruim";
      case 2: return "Ruim";
      case 3: return "Regular";
      case 4: return "Bom";
      case 5: return "Excelente";
      default: return "Selecione sua avaliação";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">
            {step === 'rating' ? 'Avaliar Sistema' : 'Informações Demográficas'}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {step === 'rating' 
              ? `Avalie o sistema ${systemName} e compartilhe sua experiência` 
              : 'Ajude-nos a melhorar nossos serviços'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="mb-4">
          <Progress value={step === 'rating' ? 50 : 100} className="h-2" />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span className={step === 'rating' ? 'font-medium text-blue-600' : ''}>
              Avaliação
            </span>
            <span className={step === 'demographics' ? 'font-medium text-blue-600' : ''}>
              Demográficos
            </span>
            <span className={isSubmitting ? 'font-medium text-blue-600' : ''}>
              Envio
            </span>
          </div>
        </div>

        {step === 'rating' ? (
          <div className="space-y-6">
            {/* Campo Nome */}
            <div>
              <Label htmlFor="userName" className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4" />
                Seu nome
              </Label>
              <Input
                id="userName"
                type="text"
                placeholder="Digite seu nome"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                disabled={isSubmitting}
                className="mt-1"
              />
            </div>

            <div className="text-center space-y-4">
              <h3 className="font-medium">Como você avalia o {systemName}?</h3>
              <div className="flex justify-center gap-1">
                {renderStars()}
              </div>
              {rating > 0 && (
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-yellow-600">
                    {getRatingLabel(rating)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Você selecionou {rating} {rating === 1 ? 'estrela' : 'estrelas'}
                  </p>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="comment" className="flex items-center gap-2 mb-2">
                <MessageCircle className="h-4 w-4" />
                Seu comentário
              </Label>
              <Textarea
                id="comment"
                placeholder="Conte-nos sobre sua experiência com este sistema..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={isSubmitting}
                className="min-h-[100px] resize-none"
                rows={4}
              />
              <p className="text-xs text-gray-500 mt-1">
                Seu comentário será público e ajudará outros usuários.
              </p>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handleClose} 
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleNextStep} 
                className="flex-1 gap-2"
                disabled={isSubmitting || rating === 0 || !comment.trim() || !userName.trim()}
              >
                Continuar
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                Suas informações demográficas nos ajudam a entender melhor nossos usuários e melhorar nossos serviços.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="cor">Cor/Raça</Label>
                <Select 
                  onValueChange={(value: CorOption) => setDemographics({...demographics, cor: value})}
                  value={demographics.cor}
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  onChange={(e) => handleIdadeChange(e.target.value)}
                  placeholder="Digite sua idade"
                  disabled={isSubmitting}
                  className={idadeError ? "border-red-500" : ""}
                />
                {idadeError && (
                  <p className="text-red-600 text-sm mt-1 font-medium">{idadeError}</p>
                )}
              </div>

              <div className="border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
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
                <p className="text-xs text-gray-600">
                  Sua localização nos ajuda a entender a distribuição geográfica dos usuários.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={getLocation}
                  disabled={isGettingLocation || !!location || isSubmitting}
                  className="w-full"
                >
                  {isGettingLocation ? (
                    <>
                      <div className="h-3 w-3 animate-spin rounded-full border-2 border-gray-400 border-t-transparent mr-2" />
                      Obtendo...
                    </>
                  ) : location ? (
                    'Localização obtida ✓'
                  ) : (
                    'Obter minha localização'
                  )}
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setStep('rating')} 
                className="flex-1"
                disabled={isSubmitting}
              >
                Voltar
              </Button>
              <Button 
                onClick={handleSubmit} 
                className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
                disabled={isSubmitting || !demographics.cor || !demographics.sexo || !demographics.idade}
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Enviando...
                  </>
                ) : (
                  <>
                    Enviar Avaliação
                    <Send className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}