"use client";

import type { TrackedCardStatus } from "@/lib/bingo/types";
import { cn } from "@/lib/utils";

interface TrackedCardItemProps {
  status: TrackedCardStatus;
  onRemove: () => void;
  showOwner?: boolean;
}

/**
 * Exibe uma cartela rastreada com seus numeros e progresso
 * Usa cores simplificadas: marcado (primary) vs disponivel (card)
 */
export function TrackedCardItem({
  status,
  onRemove,
  showOwner = true,
}: TrackedCardItemProps) {
  const { card, markedNumbers, progress, hasBingo } = status;

  return (
    <div
      className={cn(
        "bg-card border-2 rounded-lg p-3 transition-all relative overflow-hidden",
        hasBingo
          ? "border-success bg-success/10 shadow-lg shadow-success/20"
          : "border-border"
      )}
    >
      {/* Área de hover na metade direita - gatilho do group */}
      <div className="absolute inset-y-0 right-0 w-1/2 z-10 group">
        {/* Overlay com degradê - visível apenas no hover desta área */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end pr-3 bg-gradient-to-l from-card via-card/95 to-transparent">
          <button
            onClick={onRemove}
            className="flex items-center gap-1.5 text-destructive hover:text-destructive-foreground hover:bg-destructive px-3 py-1.5 rounded-lg transition-colors text-sm font-medium"
            title="Remover cartela"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
            <span>Excluir</span>
          </button>
        </div>
      </div>

      {/* Header com nome e badge bingo */}
      <div className="flex items-center gap-2 mb-2">
        {showOwner && (
          <span className="font-semibold text-sm truncate max-w-[180px]">
            {card.ownerName}
          </span>
        )}
        {hasBingo && (
          <span className="text-xs bg-success text-success-foreground px-2 py-0.5 rounded-full font-bold animate-pulse">
            BINGO!
          </span>
        )}
      </div>

      {/* Barra de progresso */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>
            {markedNumbers.length}/{card.cardNumbers.length}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-300",
              hasBingo ? "bg-success" : "bg-primary"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Numeros em grid simplificado */}
      <div className="flex flex-wrap gap-1">
        {[...card.cardNumbers].sort((a, b) => a - b).map((num) => {
          const isMarked = markedNumbers.includes(num);
          return (
            <span
              key={num}
              className={cn(
                "w-7 h-7 flex items-center justify-center text-xs font-medium rounded border-2 transition-all",
                isMarked
                  ? "bg-primary border-primary text-primary-foreground"
                  : "bg-card border-border text-card-foreground"
              )}
            >
              {num}
            </span>
          );
        })}
      </div>
    </div>
  );
}
