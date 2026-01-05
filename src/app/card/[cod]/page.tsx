"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useBingoCard } from "@/hooks/useBingoCard";
import { BingoCard75Component } from "@/components/BingoCard/BingoCard75";
import { BingoCard90Component } from "@/components/BingoCard/BingoCard90";
import { StatsPanel } from "@/components/StatsPanel/StatsPanel";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Collapsible } from "@/components/ui/Collapsible";
import { useWakeLock } from "@/hooks/useWakeLock";
import { Confetti } from "@/components/ui/Confetti";

interface PageProps {
  params: Promise<{ cod: string }>;
}

/**
 * Página de cartela individual de Bingo
 * Exibe a cartela decodificada e permite marcação manual dos números
 */
export default function CardPage({ params }: PageProps) {
  const { cod } = use(params);
  // Decodificar URL (+ é codificado como %2B)
  const decodedCod = decodeURIComponent(cod);
  const { card, markedNumbers, drawnNumbers, toggleNumber, winCheck, stats, isValid } =
    useBingoCard(decodedCod);
  const [showBingo, setShowBingo] = useState(true);
  
  // Prevent screen sleep
  useWakeLock();

  const handleNumberClick = (number: number) => {
    // Haptic feedback
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(50);
    }
    toggleNumber(number);
  };

  // Código inválido
  if (!isValid || !card) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="bg-destructive/10 rounded-lg p-8 border-2 border-destructive text-center">
            <h1 className="text-4xl font-bold mb-4 text-destructive">
              ❌ Código Inválido
            </h1>
            <p className="mb-6 text-lg">
              O código da cartela &quot;{decodedCod}&quot; não é válido.
            </p>
            <div className="space-y-4 text-left">
              <div>
                <h3 className="font-semibold mb-2">Formato esperado para Bingo 90 bolas:</h3>
                <code className="block bg-muted p-3 rounded border-2 border-border">
                  /card/123+45+6+78+0+12+345+67+89
                </code>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Formato esperado para Bingo 75 bolas:</h3>
                <code className="block bg-muted p-3 rounded border-2 border-border">
                  /card/1359B248AC78DE135AD39BEF
                </code>
              </div>
            </div>
            <Link
              href="/"
              className="inline-block mt-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              ← Voltar para Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <div>
            <Link
              href="/"
              className="text-sm text-primary hover:underline mb-2 block"
            >
              ← Voltar para Home
            </Link>
            <h1 className="text-3xl font-bold">
              {card.mode === "75" ? "🇺🇸" : "🇬🇧"} Cartela de Bingo {card.mode} Bolas
            </h1>
            <p className="text-sm text-muted-foreground font-mono mt-1">
              Código: {decodedCod}
            </p>
          </div>
          <ThemeToggle />
        </header>

        {/* Botão BINGO! */}
        {winCheck.hasWon && showBingo && (
          <>
            <Confetti />
            <div className="mb-6 bg-success rounded-lg p-6 border-4 border-success shadow-lg relative animate-in zoom-in duration-500">
              <button
                onClick={() => setShowBingo(false)}
                className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full text-white font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Fechar aviso"
              >
                ✕
              </button>
              <div className="text-center">
                <h2 className="text-6xl font-bold text-success-foreground mb-2 animate-pulse">
                  🎉 BINGO! 🎉
                </h2>
                <p className="text-xl text-success-foreground">
                  Parabéns! Você completou o padrão:{" "}
                  <strong>{winCheck.pattern}</strong>
                </p>
              </div>
            </div>
          </>
        )}

        {/* Grid Principal */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Cartela */}
          <div>
            <h2 className="font-semibold text-lg mb-3">🎯 Sua Cartela</h2>
            {card.mode === "75" ? (
              <BingoCard75Component
                card={card}
                markedNumbers={markedNumbers}
                drawnNumbers={drawnNumbers}
                onNumberClick={handleNumberClick}
                winningPositions={winCheck.winningPositions}
              />
            ) : (
              <BingoCard90Component
                card={card}
                markedNumbers={markedNumbers}
                drawnNumbers={drawnNumbers}
                onNumberClick={handleNumberClick}
                winningPositions={winCheck.winningPositions}
              />
            )}
            <p className="text-xs text-muted-foreground mt-4">
              💡 Clique nos números para marcar/desmarcar. Os números com borda
              vermelha foram sorteados mas ainda não foram marcados.
            </p>
          </div>

          {/* Estatísticas */}
          <div>
            <h2 className="font-semibold text-lg mb-3">📊 Estatísticas</h2>
            <StatsPanel stats={stats} drawnNumbers={drawnNumbers} />
          </div>
        </div>

        {/* Instruções */}
        <div className="mt-8">
          <Collapsible title="Como jogar" icon="ℹ️" defaultOpen={false}>
            <ul className="space-y-1 text-sm">
              <li>
                1. Aguarde os números serem sorteados na{" "}
                <Link href="/sort" className="text-primary underline hover:no-underline">
                  página de sorteio
                </Link>
              </li>
              <li>
                2. Clique nos números da sua cartela quando forem sorteados para marcá-los
              </li>
              <li>
                3. Os números já sorteados aparecem com borda vermelha se ainda não foram marcados
              </li>
              <li>
                4. Quando completar um padrão, o botão &quot;BINGO!&quot; aparecerá automaticamente
              </li>
              <li>
                5. Suas marcações são salvas automaticamente
              </li>
            </ul>
          </Collapsible>
        </div>
      </div>
    </main>
  );
}
