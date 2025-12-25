"use client";

import type { CardStats } from "@/lib/bingo/types";

interface StatsPanelProps {
  stats: CardStats;
  currentNumber: number | null;
  drawnNumbers: number[];
}

/**
 * Componente de painel de estatísticas da cartela
 * Mostra progresso, números sorteados e estatísticas em tempo real
 */
export function StatsPanel({
  stats,
  currentNumber,
  drawnNumbers,
}: StatsPanelProps) {
  return (
    <div className="space-y-4">
      {/* Estatísticas principais */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-gray-300 dark:border-gray-700">
        <h3 className="font-semibold text-lg mb-3">📊 Estatísticas</h3>

        {/* Progresso */}
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span>Acertos:</span>
            <span className="font-semibold">
              {stats.markedNumbers}/{stats.totalNumbers} ({stats.percentage}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className="bg-green-500 dark:bg-green-600 h-full transition-all duration-300"
              style={{ width: `${stats.percentage}%` }}
            />
          </div>
        </div>

        {/* Números faltantes */}
        {stats.remainingToWin > 0 && (
          <div className="text-sm">
            <span className="text-orange-600 dark:text-orange-400 font-semibold">
              🎯 Faltam {stats.remainingToWin} número
              {stats.remainingToWin !== 1 && "s"} para o próximo padrão!
            </span>
          </div>
        )}

        {/* Avisos */}
        {stats.drawnButNotMarked > 0 && (
          <div className="mt-2 text-sm text-red-600 dark:text-red-400 font-semibold">
            ⚠️ {stats.drawnButNotMarked} número{stats.drawnButNotMarked !== 1 && "s"}{" "}
            sorteado{stats.drawnButNotMarked !== 1 && "s"} não marcado
            {stats.drawnButNotMarked !== 1 && "s"}!
          </div>
        )}
      </div>

      {/* Último número sorteado */}
      {currentNumber && (
        <div className="bg-yellow-100 dark:bg-yellow-900 rounded-lg p-4 border-2 border-yellow-400 dark:border-yellow-600">
          <h3 className="font-semibold text-sm mb-2 text-gray-700 dark:text-gray-300">
            Último Sorteado:
          </h3>
          <div className="text-5xl font-bold text-center text-yellow-700 dark:text-yellow-300">
            {currentNumber}
          </div>
        </div>
      )}

      {/* Histórico de números sorteados */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-gray-300 dark:border-gray-700">
        <h3 className="font-semibold text-sm mb-3">
          🔢 Números Sorteados ({drawnNumbers.length})
        </h3>
        <div className="max-h-40 overflow-y-auto">
          {drawnNumbers.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              Nenhum número sorteado ainda
            </p>
          ) : (
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-1">
              {drawnNumbers.map((num, index) => (
                <div
                  key={index}
                  className="aspect-square flex items-center justify-center text-xs font-semibold bg-gray-200 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600"
                >
                  {num}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
