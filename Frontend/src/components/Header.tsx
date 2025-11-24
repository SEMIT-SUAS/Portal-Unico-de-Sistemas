import React from "react";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
// Corrigindo a importação da imagem
import logoSaoLuis from "../assets/logosaoluis.png";


interface HeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export function Header({ searchTerm, onSearchChange }: HeaderProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-col items-center gap-6 text-center sm:text-left sm:flex-row sm:justify-between">
          {/* Logo and Title */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="bg-white rounded-lg p-2 sm:p-3 flex items-center justify-center">
              <img 
                src={logoSaoLuis}
                alt="Prefeitura de São Luís"
                className="w-10 h-10 sm:w-12 sm:h-12"
              />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Catálogo de Sistemas Digitais</h1>
              <p className="text-blue-100 mt-1 text-sm sm:text-base">Prefeitura de São Luís</p>
              <p className="text-blue-200 text-xs sm:text-sm mt-1">
                Transformando a gestão pública e o atendimento ao cidadão com tecnologia e inovação.
              </p>
            </div>
          </div>
          
          
          
        </div>
      </div>
    </div>
  );
}