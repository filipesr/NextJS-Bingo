"use client";

import type { BingoCard90 } from "@/lib/bingo/types";
import { BingoCell } from "./BingoCell";

interface BingoCard90Props {
  card: BingoCard90;
  markedNumbers: number[];
  drawnNumbers: number[];
  onNumberClick: (number: number) => void;
  winningPositions?: [number, number][];
}

/**
 * Componente de cartela Bingo 90 bolas (Britânico)
 * Grid 9x3 com números organizados por dezenas
 */
export function BingoCard90Component({
  card,
  markedNumbers,
  drawnNumbers,
  onNumberClick,
  winningPositions = [],
}: BingoCard90Props) {
  const isWinningPosition = (row: number, col: number) => {
    return winningPositions.some(([r, c]) => r === row && c === col);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header com ranges de números */}
      <div className="grid grid-cols-9 gap-1 mb-2">
        {[
          "1-10",
          "11-20",
          "21-30",
          "31-40",
          "41-50",
          "51-60",
          "61-70",
          "71-80",
          "81-90",
        ].map((range, i) => (
          <div
            key={i}
            className="aspect-square flex items-center justify-center font-semibold text-[10px] bg-blue-600 dark:bg-blue-700 text-white rounded"
          >
            {range}
          </div>
        ))}
      </div>

      {/* Grid 9x3 */}
      <div className="grid grid-cols-9 gap-1">
        {card.grid.map((row, rowIndex) =>
          row.map((number, colIndex) => {
            const isMarked = number !== null && markedNumbers.includes(number);
            const isDrawn = number !== null && drawnNumbers.includes(number);
            const isWinning = isWinningPosition(rowIndex, colIndex);

            return (
              <BingoCell
                key={`${rowIndex}-${colIndex}`}
                number={number}
                isMarked={isMarked}
                isDrawn={isDrawn}
                isWinning={isWinning}
                onClick={() => number && onNumberClick(number)}
              />
            );
          })
        )}
      </div>

      {/* Legenda */}
      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600"></div>
          <span>Não marcado</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-blue-500 border-2 border-blue-600"></div>
          <span>Marcado</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 ring-2 ring-red-500"></div>
          <span>Sorteado (não marcado)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-gray-200 dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700"></div>
          <span>Vazio</span>
        </div>
      </div>
    </div>
  );
}
