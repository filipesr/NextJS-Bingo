"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { BingoMode } from "@/lib/bingo/types";
import { getNumberWithLetter } from "@/lib/bingo/utils";

interface DrawnNumbersSidebarProps {
  drawnNumbers: number[];
  currentNumber: number | null;
  mode: BingoMode;
  drawnCount: number;
  totalNumbers: number;
  className?: string;
}

/**
 * Barra lateral flutuante para exibir numeros sorteados
 * Posicao fixa no lado esquerdo, colapsavel, responsiva
 */
export function DrawnNumbersSidebar({
  drawnNumbers,
  currentNumber,
  mode,
  drawnCount,
  totalNumbers,
  className,
}: DrawnNumbersSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<"chronological" | "numerical">("chronological");

  // Numeros ordenados conforme preferencia
  const displayedNumbers =
    sortOrder === "numerical"
      ? [...drawnNumbers].sort((a, b) => a - b)
      : drawnNumbers;

  return (
    <>
      {/* Botao de toggle (visivel quando sidebar fechada) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed left-0 top-1/2 -translate-y-1/2 z-40 bg-primary text-primary-foreground px-2 py-4 rounded-r-lg shadow-lg hover:bg-primary/90 transition-colors"
          aria-label="Abrir lista de numeros sorteados"
        >
          <span className="writing-mode-vertical text-sm font-medium">
            Numeros {drawnNumbers.length > 0 && `(${drawnNumbers.length})`}
          </span>
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full bg-card border-r-2 border-border shadow-xl z-50 transition-transform duration-300 flex flex-col",
          "w-72 lg:w-80",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
          <div>
            <h2 className="font-bold text-lg">Numeros Sorteados</h2>
            <p className="text-xs text-muted-foreground">
              Modo: {mode} bolas
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Fechar sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Controle de ordenacao */}
        {drawnNumbers.length > 0 && (
          <div className="p-4 border-b border-border shrink-0">
            <div className="flex gap-2 text-sm">
              <button
                onClick={() => setSortOrder("chronological")}
                className={cn(
                  "flex-1 py-1.5 px-2 rounded-lg transition-colors flex items-center justify-center gap-1",
                  sortOrder === "chronological"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                <span>⏱️</span>
                <span>Chamada</span>
              </button>
              <button
                onClick={() => setSortOrder("numerical")}
                className={cn(
                  "flex-1 py-1.5 px-2 rounded-lg transition-colors flex items-center justify-center gap-1",
                  sortOrder === "numerical"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                <span>🔢</span>
                <span>Crescente</span>
              </button>
            </div>
          </div>
        )}

        {/* Lista de numeros */}
        <div className="flex-1 overflow-y-auto p-4">
          {drawnNumbers.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <p className="mb-2">Nenhum numero sorteado ainda.</p>
              <p className="text-sm">
                Clique em &quot;Sortear&quot; ou pressione Espaco para comecar.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
              {displayedNumbers.map((num, index) => (
                <div
                  key={index}
                  className={cn(
                    "aspect-square flex items-center justify-center font-bold text-xs rounded border-2 transition-all",
                    num === currentNumber
                      ? "bg-warning border-warning text-warning-foreground scale-110 shadow-lg z-10"
                      : "bg-muted text-foreground border-border"
                  )}
                >
                  {mode === "75" ? getNumberWithLetter(num) : num}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer com progresso */}
        <div className="p-4 border-t border-border bg-muted/50 shrink-0 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progresso:</span>
            <span className="font-semibold">
              {drawnCount}/{totalNumbers}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-300"
              style={{
                width: `${(drawnCount / totalNumbers) * 100}%`,
              }}
            />
          </div>
        </div>
      </aside>

      {/* Backdrop para mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
