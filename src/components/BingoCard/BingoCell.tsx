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
          "bg-card border-border text-card-foreground hover:bg-muted/50",
        // Estado marcado
        isMarked &&
          !isWinning &&
          "bg-primary border-primary text-primary-foreground",
        // Estado vencedor
        isWinning &&
          "bg-success border-success text-success-foreground animate-pulse shadow-lg shadow-success/20",
        // FREE space
        isFree &&
          "bg-warning border-warning text-warning-foreground font-extrabold",
        // Número sorteado mas não marcado
        isDrawn &&
          !isMarked &&
          !isFree &&
          "ring-2 ring-destructive ring-offset-1",
        // Célula vazia (Bingo 90)
        number === null && !isFree && "bg-muted border-muted-foreground/20 text-muted-foreground/40"
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
