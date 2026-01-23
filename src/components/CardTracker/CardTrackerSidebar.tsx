"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useCardTracker } from "@/hooks/useCardTracker";
import { TrackedCardItem } from "./TrackedCardItem";
import { AddCardForm } from "./AddCardForm";

interface CardTrackerSidebarProps {
  className?: string;
}

/**
 * Barra lateral flutuante para rastrear cartelas em jogo
 * Posicao fixa no lado direito, colapsavel, responsiva
 */
export function CardTrackerSidebar({ className }: CardTrackerSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"owner" | "progress">("progress");
  const [showAddForm, setShowAddForm] = useState(false);

  const {
    cardStatuses,
    cardsByOwner,
    cardsSortedByProgress,
    bingoCount,
    addCard,
    removeCard,
    clearAllCards,
    currentMode,
  } = useCardTracker();

  const handleAddCard = (ownerName: string, cardCode: string) => {
    const result = addCard(ownerName, cardCode);
    if (result.success) {
      setShowAddForm(false);
    }
    return result;
  };

  return (
    <>
      {/* Botao de toggle (visivel quando sidebar fechada) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-primary text-primary-foreground px-2 py-4 rounded-l-lg shadow-lg hover:bg-primary/90 transition-colors"
          aria-label="Abrir rastreador de cartelas"
        >
          <span className="writing-mode-vertical text-sm font-medium">
            Cartelas {cardStatuses.length > 0 && `(${cardStatuses.length})`}
          </span>
          {bingoCount > 0 && (
            <span className="absolute -top-2 -left-2 bg-success text-success-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse">
              {bingoCount}
            </span>
          )}
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed right-0 top-0 h-full bg-card border-l-2 border-border shadow-xl z-50 transition-transform duration-300 flex flex-col",
          "w-80 lg:w-96",
          isOpen ? "translate-x-0" : "translate-x-full",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
          <div>
            <h2 className="font-bold text-lg">Cartelas em Jogo</h2>
            <p className="text-xs text-muted-foreground">
              Modo: {currentMode} bolas
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

        {/* Controles */}
        <div className="p-4 border-b border-border space-y-3 shrink-0">
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex-1 bg-success text-success-foreground py-2 px-3 rounded-lg font-medium hover:bg-success/90 transition-colors text-sm"
            >
              + Adicionar Cartela
            </button>
            {cardStatuses.length > 0 && (
              <button
                onClick={clearAllCards}
                className="bg-destructive text-destructive-foreground py-2 px-3 rounded-lg font-medium hover:bg-destructive/90 transition-colors text-sm"
                title="Limpar todas"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Toggle de ordenacao */}
          {cardStatuses.length > 1 && (
            <div className="flex gap-2 text-sm">
              <button
                onClick={() => setSortBy("progress")}
                className={cn(
                  "flex-1 py-1.5 px-2 rounded-lg transition-colors",
                  sortBy === "progress"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                Por Progresso
              </button>
              <button
                onClick={() => setSortBy("owner")}
                className={cn(
                  "flex-1 py-1.5 px-2 rounded-lg transition-colors",
                  sortBy === "owner"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                Por Dono
              </button>
            </div>
          )}
        </div>

        {/* Formulario de adicao */}
        {showAddForm && (
          <div className="p-4 border-b border-border bg-muted/50 shrink-0">
            <AddCardForm
              onSubmit={handleAddCard}
              onCancel={() => setShowAddForm(false)}
              currentMode={currentMode}
            />
          </div>
        )}

        {/* Lista de cartelas */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cardStatuses.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <p className="mb-2">Nenhuma cartela sendo rastreada.</p>
              <p className="text-sm">
                Clique em &quot;Adicionar Cartela&quot; para comecar.
              </p>
            </div>
          ) : sortBy === "progress" ? (
            // Ordenado por progresso
            cardsSortedByProgress.map((status) => (
              <TrackedCardItem
                key={status.card.id}
                status={status}
                onRemove={() => removeCard(status.card.id)}
              />
            ))
          ) : (
            // Agrupado por dono
            Array.from(cardsByOwner.entries()).map(([owner, cards]) => (
              <div key={owner} className="space-y-2">
                <h3 className="font-semibold text-sm text-muted-foreground border-b border-border pb-1">
                  {owner} ({cards.length} cartela{cards.length > 1 ? "s" : ""})
                </h3>
                {cards.map((status) => (
                  <TrackedCardItem
                    key={status.card.id}
                    status={status}
                    onRemove={() => removeCard(status.card.id)}
                    showOwner={false}
                  />
                ))}
              </div>
            ))
          )}
        </div>

        {/* Footer com contagem */}
        {cardStatuses.length > 0 && (
          <div className="p-3 border-t border-border bg-muted/50 text-sm text-center text-muted-foreground shrink-0">
            {cardStatuses.length} cartela{cardStatuses.length > 1 ? "s" : ""}{" "}
            rastreada{cardStatuses.length > 1 ? "s" : ""}
            {bingoCount > 0 && (
              <span className="ml-2 text-success font-semibold">
                ({bingoCount} BINGO!)
              </span>
            )}
          </div>
        )}
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
