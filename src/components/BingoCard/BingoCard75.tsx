"use client";

import type { BingoCard75 } from "@/lib/bingo/types";
import { BingoCell } from "./BingoCell";

interface BingoCard75Props {
  card: BingoCard75;
  markedNumbers: number[];
  drawnNumbers: number[];
  onNumberClick: (number: number) => void;
  winningPositions?: [number, number][];
}

/**
 * Componente de cartela Bingo 75 bolas (Americano)
 * Grid 5x5 com colunas B-I-N-G-O
 */
export function BingoCard75Component({
  card,
  markedNumbers,
  drawnNumbers,
  onNumberClick,
  winningPositions = [],
}: BingoCard75Props) {
  const isWinningPosition = (row: number, col: number) => {
    return winningPositions.some(([r, c]) => r === row && c === col);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header com B-I-N-G-O */}
      <div className="grid grid-cols-5 gap-1 mb-2">
        {["B", "I", "N", "G", "O"].map((letter) => (
          <div
            key={letter}
            className="aspect-square flex items-center justify-center font-bold text-xl bg-red-600 dark:bg-red-700 text-white rounded"
          >
            {letter}
          </div>
        ))}
      </div>

      {/* Grid 5x5 */}
      <div className="grid grid-cols-5 gap-1">
        {card.grid.map((row, rowIndex) =>
          row.map((number, colIndex) => {
            const isFree = rowIndex === 2 && colIndex === 2; // Centro é FREE
            const isMarked = number !== null && markedNumbers.includes(number);
            const isDrawn = number !== null && drawnNumbers.includes(number);
            const isWinning = isWinningPosition(rowIndex, colIndex);

            return (
              <BingoCell
                key={`${rowIndex}-${colIndex}`}
                number={number}
                isMarked={isMarked}
                isDrawn={isDrawn}
                isFree={isFree}
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
          <div className="w-4 h-4 bg-yellow-400 border-2 border-yellow-500"></div>
          <span>FREE</span>
        </div>
      </div>
    </div>
  );
}
