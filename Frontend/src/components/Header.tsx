import { Search } from "lucide-react";
import { Input } from "./ui/input";
// Corrigindo a importação da imagem
import logoSaoLuis from "../assets/f95aa73053455c41831cdd38cc0842368a9337c1.png";

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export function Header({ searchTerm, onSearchChange }: HeaderProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo and Title */}
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-lg p-3 flex items-center justify-center">
              <img 
                src={logoSaoLuis}
                alt="Brasão da Prefeitura de São Luís"
                className="w-16 h-16 object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Catálogo de Sistemas Digitais</h1>
              <p className="text-blue-100 mt-1">Prefeitura de São Luís</p>
              <p className="text-blue-200 text-sm mt-1">
                Transformando a gestão pública e o atendimento ao cidadão com tecnologia e inovação.
              </p>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Buscar sistemas..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder-blue-200 focus:bg-white/20"
            />
          </div>
        </div>
      </div>
    </div>
  );
}