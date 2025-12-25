"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { BingoMode } from "@/lib/bingo/types";
import { generateRandomCard75, generateRandomCard90 } from "@/lib/bingo/generator-cards";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Collapsible } from "@/components/ui/Collapsible";

/**
 * Página de geração de cartelas aleatórias
 * Permite escolher a modalidade e gera automaticamente um código único
 */
export default function CardGeneratorPage() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = (mode: BingoMode) => {
    setIsGenerating(true);

    // Gerar cartela aleatória
    const card = mode === "75" ? generateRandomCard75() : generateRandomCard90();

    if (!card) {
      alert("Erro ao gerar cartela. Tente novamente.");
      setIsGenerating(false);
      return;
    }

    // Redirecionar para a página da cartela
    router.push(`/card/${card.code}`);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <Link
              href="/"
              className="text-sm text-primary hover:underline mb-2 block"
            >
              ← Voltar para Home
            </Link>
            <h1 className="text-4xl font-bold">🎲 Gerar Cartela Aleatória</h1>
            <p className="text-muted-foreground mt-2">
              Escolha a modalidade para gerar uma cartela única
            </p>
          </div>
          <ThemeToggle />
        </header>

        {/* Explicação */}
        <div className="mb-8">
          <Collapsible title="Como funciona" icon="ℹ️" defaultOpen={false}>
            <ul className="space-y-2 text-sm">
              <li>
                1. Escolha entre Bingo 75 bolas (Americano) ou 90 bolas (Britânico)
              </li>
              <li>
                2. Uma cartela com números aleatórios será gerada automaticamente
              </li>
              <li>
                3. Você será redirecionado para sua cartela com um código único
              </li>
              <li>
                4. Compartilhe o código da URL com outros jogadores se necessário
              </li>
            </ul>
          </Collapsible>
        </div>

        {/* Seletores de Modalidade */}
        <div className="space-y-6">
          <h2 className="font-semibold text-2xl mb-4">Escolha a Modalidade:</h2>

          {/* Bingo 75 Bolas */}
          <div className="bg-card rounded-lg p-6 border-2 border-border hover:border-[hsl(var(--bingo-75-header))] transition-colors">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">🇺🇸 Bingo 75 Bolas (Americano)</h3>
                <p className="text-muted-foreground mb-4">
                  Cartela 5×5 com colunas B-I-N-G-O e FREE space no centro
                </p>
                <ul className="space-y-1 text-sm mb-4">
                  <li>• 24 números aleatórios + FREE space</li>
                  <li>• Números de 1 a 75</li>
                  <li>• Padrões: linhas, diagonais, X, blackout</li>
                </ul>
                <button
                  onClick={() => handleGenerate("75")}
                  disabled={isGenerating}
                  className="bg-[hsl(var(--bingo-75-header))] hover:bg-[hsl(var(--bingo-75-header))]/90 disabled:bg-muted disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {isGenerating ? "Gerando..." : "🎲 Gerar Cartela 75 Bolas"}
                </button>
              </div>
            </div>
          </div>

          {/* Bingo 90 Bolas */}
          <div className="bg-card rounded-lg p-6 border-2 border-border hover:border-[hsl(var(--bingo-90-header))] transition-colors">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">🇬🇧 Bingo 90 Bolas (Britânico)</h3>
                <p className="text-muted-foreground mb-4">
                  Cartela 9×3 com números organizados por dezenas
                </p>
                <ul className="space-y-1 text-sm mb-4">
                  <li>• 15 números aleatórios</li>
                  <li>• Números de 1 a 90</li>
                  <li>• Padrões: 1 linha, 2 linhas, full house</li>
                </ul>
                <button
                  onClick={() => handleGenerate("90")}
                  disabled={isGenerating}
                  className="bg-[hsl(var(--bingo-90-header))] hover:bg-[hsl(var(--bingo-90-header))]/90 disabled:bg-muted disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {isGenerating ? "Gerando..." : "🎲 Gerar Cartela 90 Bolas"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="mt-8">
          <Collapsible title="Dicas" icon="💡" defaultOpen={false}>
            <ul className="space-y-2 text-sm">
              <li>
                • A cartela gerada terá um código único na URL que você pode compartilhar
              </li>
              <li>
                • Os números são distribuídos aleatoriamente de forma válida
              </li>
              <li>
                • Você pode gerar quantas cartelas quiser
              </li>
              <li>
                • Para jogar, acesse a{" "}
                <Link href="/sort" className="text-primary underline hover:no-underline">
                  página de sorteio
                </Link>
                {" "}em outra aba ou dispositivo
              </li>
            </ul>
          </Collapsible>
        </div>
      </div>
    </main>
  );
}
