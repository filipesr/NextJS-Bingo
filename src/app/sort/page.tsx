"use client";

import { useState } from "react";
import Link from "next/link";
import type { BingoMode } from "@/lib/bingo/types";
import { useBingoSort } from "@/hooks/useBingoSort";
import { ThemeToggle } from "@/components/ThemeToggle";

/**
 * Página de sorteio de números do Bingo
 * Permite sortear números aleatórios para ambas modalidades (75 e 90 bolas)
 */
export default function SortPage() {
  const [mode, setMode] = useState<BingoMode>("75");
  const { sortState, draw, reset, changeMode, hasMoreNumbers, drawnCount, totalNumbers } =
    useBingoSort(mode);

  // Função para mudar modalidade
  const handleModeChange = (newMode: BingoMode) => {
    if (
      sortState.drawnNumbers.length > 0 &&
      !confirm("Trocar a modalidade irá resetar o jogo. Confirmar?")
    ) {
      return;
    }
    setMode(newMode);
    changeMode(newMode);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <Link
              href="/"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-2 block"
            >
              ← Voltar para Home
            </Link>
            <h1 className="text-4xl font-bold">🎰 Sorteio de Bingo</h1>
          </div>
          <ThemeToggle />
        </header>

        {/* Seletor de modalidade */}
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-gray-300 dark:border-gray-700">
          <h2 className="font-semibold mb-3">Modalidade:</h2>
          <div className="flex gap-4">
            <button
              onClick={() => handleModeChange("75")}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
                mode === "75"
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              🇺🇸 Bingo 75 Bolas
            </button>
            <button
              onClick={() => handleModeChange("90")}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
                mode === "90"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              🇬🇧 Bingo 90 Bolas
            </button>
          </div>
        </div>

        {/* Display do número atual */}
        <div className="mb-6 bg-gradient-to-br from-yellow-400 to-orange-500 dark:from-yellow-500 dark:to-orange-600 rounded-lg p-8 border-4 border-yellow-600 dark:border-yellow-700 shadow-xl">
          <h2 className="text-center text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {sortState.currentNumber
              ? "Número Sorteado:"
              : "Aguardando Sorteio..."}
          </h2>
          <div className="text-center">
            {sortState.currentNumber ? (
              <div className="text-8xl font-bold text-gray-900 dark:text-white animate-pulse">
                {sortState.currentNumber}
              </div>
            ) : (
              <div className="text-6xl font-bold text-gray-600 dark:text-gray-400">
                --
              </div>
            )}
          </div>
        </div>

        {/* Controles */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={draw}
            disabled={!hasMoreNumbers}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg text-xl transition"
          >
            {hasMoreNumbers ? "🎲 Sortear Próximo" : "Sem Mais Números"}
          </button>
          <button
            onClick={reset}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg transition"
          >
            🔄 Resetar
          </button>
        </div>

        {/* Progresso */}
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-gray-300 dark:border-gray-700">
          <div className="flex justify-between text-sm mb-2">
            <span>Progresso:</span>
            <span className="font-semibold">
              {drawnCount}/{totalNumbers} números sorteados
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
            <div
              className="bg-blue-500 dark:bg-blue-600 h-full transition-all duration-300"
              style={{
                width: `${(drawnCount / totalNumbers) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Histórico de números sorteados */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border-2 border-gray-300 dark:border-gray-700">
          <h2 className="font-semibold text-lg mb-4">
            📝 Números Sorteados ({sortState.drawnNumbers.length})
          </h2>
          {sortState.drawnNumbers.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              Nenhum número sorteado ainda. Clique em &quot;Sortear Próximo&quot; para começar!
            </p>
          ) : (
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
              {sortState.drawnNumbers.map((num, index) => (
                <div
                  key={index}
                  className={`aspect-square flex items-center justify-center font-bold text-sm sm:text-base rounded border-2 ${
                    num === sortState.currentNumber
                      ? "bg-yellow-400 dark:bg-yellow-500 border-yellow-600 dark:border-yellow-700 text-gray-900 scale-110"
                      : "bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                  } transition-all`}
                >
                  {num}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instruções */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900 rounded-lg p-4 border-2 border-blue-300 dark:border-blue-700">
          <h3 className="font-semibold mb-2">ℹ️ Como usar:</h3>
          <ul className="space-y-1 text-sm">
            <li>
              1. Escolha a modalidade (75 ou 90 bolas)
            </li>
            <li>
              2. Clique em &quot;Sortear Próximo&quot; para sortear cada número
            </li>
            <li>
              3. Os números sorteados são salvos automaticamente
            </li>
            <li>
              4. Jogadores devem acessar suas cartelas usando códigos únicos (ex: /card/[código])
            </li>
            <li>
              5. Use &quot;Resetar&quot; para começar um novo jogo
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
