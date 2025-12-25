"use client";

import { cn } from "@/lib/utils";

interface BingoCellProps {
  number: number | null;
  isMarked: boolean;
  isDrawn: boolean;
  isFree?: boolean;
  onClick?: () => void;
  isWinning?: boolean;
}

/**
 * Componente de célula individual da cartela de Bingo
 * Exibe um número, FREE space ou célula vazia
 */
export function BingoCell({
  number,
  isMarked,
  isDrawn,
  isFree = false,
  onClick,
  isWinning = false,
}: BingoCellProps) {
  return (
    <button
      onClick={onClick}
      disabled={isFree || number === null}
      className={cn(
        "aspect-square flex items-center justify-center font-bold text-sm sm:text-base md:text-lg",
        "border-2 transition-all duration-200",
        "disabled:cursor-default",
        // Estado normal
        !isMarked &&
          !isFree &&
          number !== null &&
          "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700",
        // Estado marcado
        isMarked &&
          !isWinning &&
          "bg-blue-500 dark:bg-blue-600 border-blue-600 dark:border-blue-700 text-white",
        // Estado vencedor
        isWinning &&
          "bg-green-500 dark:bg-green-600 border-green-600 dark:border-green-700 text-white animate-pulse",
        // FREE space
        isFree &&
          "bg-yellow-500 dark:bg-yellow-600 border-yellow-600 dark:border-yellow-700 text-white dark:text-white",
        // Número sorteado mas não marcado
        isDrawn &&
          !isMarked &&
          !isFree &&
          "ring-2 ring-red-500 dark:ring-red-400",
        // Célula vazia (Bingo 90)
        number === null && !isFree && "bg-gray-300 dark:bg-gray-900 border-gray-400 dark:border-gray-700"
      )}
    >
      {isFree ? (
        <span className="text-xs font-bold">FREE</span>
      ) : number !== null ? (
        <span>{number}</span>
      ) : null}
    </button>
  );
}
