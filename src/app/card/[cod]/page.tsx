"use client";

import { use } from "react";
import Link from "next/link";
import { useBingoCard } from "@/hooks/useBingoCard";
import { BingoCard75Component } from "@/components/BingoCard/BingoCard75";
import { BingoCard90Component } from "@/components/BingoCard/BingoCard90";
import { StatsPanel } from "@/components/StatsPanel/StatsPanel";
import { ThemeToggle } from "@/components/ThemeToggle";
import { loadSortState } from "@/lib/storage/localStorage";

interface PageProps {
  params: Promise<{ cod: string }>;
}

/**
 * Página de cartela individual de Bingo
 * Exibe a cartela decodificada e permite marcação manual dos números
 */
export default function CardPage({ params }: PageProps) {
  const { cod } = use(params);
  const { card, markedNumbers, drawnNumbers, toggleNumber, winCheck, stats, isValid } =
    useBingoCard(cod);

  // Carregar último número sorteado
  const sortState = loadSortState();
  const currentNumber = sortState?.currentNumber || null;

  // Código inválido
  if (!isValid || !card) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="bg-red-50 dark:bg-red-900 rounded-lg p-8 border-2 border-red-300 dark:border-red-700 text-center">
            <h1 className="text-4xl font-bold mb-4 text-red-700 dark:text-red-300">
              ❌ Código Inválido
            </h1>
            <p className="mb-6 text-lg">
              O código da cartela &quot;{cod}&quot; não é válido.
            </p>
            <div className="space-y-4 text-left">
              <div>
                <h3 className="font-semibold mb-2">Formato esperado para Bingo 90 bolas:</h3>
                <code className="block bg-gray-100 dark:bg-gray-800 p-3 rounded">
                  /card/123+45+6+78+0+12+345+67+89
                </code>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Formato esperado para Bingo 75 bolas:</h3>
                <code className="block bg-gray-100 dark:bg-gray-800 p-3 rounded">
                  /card/1359B248AC78DE135AD39BEF
                </code>
              </div>
            </div>
            <Link
              href="/"
              className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
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
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-2 block"
            >
              ← Voltar para Home
            </Link>
            <h1 className="text-3xl font-bold">
              {card.mode === "75" ? "🇺🇸" : "🇬🇧"} Cartela de Bingo {card.mode} Bolas
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-mono mt-1">
              Código: {cod}
            </p>
          </div>
          <ThemeToggle />
        </header>

        {/* Botão BINGO! */}
        {winCheck.hasWon && (
          <div className="mb-6 bg-green-500 dark:bg-green-600 rounded-lg p-6 border-4 border-green-700 dark:border-green-800 animate-pulse">
            <div className="text-center">
              <h2 className="text-6xl font-bold text-white mb-2">
                🎉 BINGO! 🎉
              </h2>
              <p className="text-xl text-white">
                Parabéns! Você completou o padrão:{" "}
                <strong>{winCheck.pattern}</strong>
              </p>
            </div>
          </div>
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
                onNumberClick={toggleNumber}
                winningPositions={winCheck.winningPositions}
              />
            ) : (
              <BingoCard90Component
                card={card}
                markedNumbers={markedNumbers}
                drawnNumbers={drawnNumbers}
                onNumberClick={toggleNumber}
                winningPositions={winCheck.winningPositions}
              />
            )}
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">
              💡 Clique nos números para marcar/desmarcar. Os números com borda
              vermelha foram sorteados mas ainda não foram marcados.
            </p>
          </div>

          {/* Estatísticas */}
          <div>
            <h2 className="font-semibold text-lg mb-3">📊 Estatísticas</h2>
            <StatsPanel
              stats={stats}
              currentNumber={currentNumber}
              drawnNumbers={drawnNumbers}
            />
          </div>
        </div>

        {/* Instruções */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900 rounded-lg p-4 border-2 border-blue-300 dark:border-blue-700">
          <h3 className="font-semibold mb-2">ℹ️ Como jogar:</h3>
          <ul className="space-y-1 text-sm">
            <li>
              1. Aguarde os números serem sorteados na{" "}
              <Link href="/sort" className="text-blue-600 dark:text-blue-400 underline">
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
        </div>
      </div>
    </main>
  );
}
