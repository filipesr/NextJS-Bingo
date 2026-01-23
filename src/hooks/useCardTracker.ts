"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type {
  BingoMode,
  TrackedCard,
  TrackedCardStatus,
} from "@/lib/bingo/types";
import { decodeCard } from "@/lib/bingo/decoder";
import { checkWin } from "@/lib/bingo/patterns";
import {
  saveCardTrackerState,
  loadCardTrackerState,
  clearCardTrackerState,
  loadSortState,
} from "@/lib/storage/localStorage";

/**
 * Hook para gerenciar o rastreamento de cartelas na página de sorteio
 */
export function useCardTracker() {
  const [trackedCards, setTrackedCards] = useState<TrackedCard[]>([]);
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [currentMode, setCurrentMode] = useState<BingoMode>("75");
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregar estado salvo no mount
  useEffect(() => {
    const savedState = loadCardTrackerState();
    if (savedState) {
      setTrackedCards(savedState.trackedCards);
    }

    // Carregar estado inicial do sorteio
    const sortState = loadSortState();
    if (sortState) {
      setDrawnNumbers(sortState.drawnNumbers);
      setCurrentMode(sortState.mode);
    }

    setIsLoaded(true);
  }, []);

  // Sincronizar com estado do sorteio via polling (500ms)
  useEffect(() => {
    const interval = setInterval(() => {
      const sortState = loadSortState();
      if (sortState) {
        setDrawnNumbers(sortState.drawnNumbers);
        setCurrentMode(sortState.mode);
      }

      // Verificar se tracker foi limpo externamente (pelo reset)
      const trackerState = loadCardTrackerState();
      if (!trackerState && trackedCards.length > 0) {
        setTrackedCards([]);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [trackedCards.length]);

  // Persistir mudanças automaticamente
  useEffect(() => {
    if (isLoaded) {
      saveCardTrackerState({
        trackedCards,
        lastUpdated: Date.now(),
      });
    }
  }, [trackedCards, isLoaded]);

  // Adicionar nova cartela
  const addCard = useCallback(
    (
      ownerName: string,
      cardCode: string
    ): { success: boolean; error?: string } => {
      const decodedCard = decodeCard(cardCode);

      if (!decodedCard) {
        return { success: false, error: "Codigo de cartela invalido" };
      }

      // Verificar se o modo da cartela combina com o jogo atual
      if (decodedCard.mode !== currentMode) {
        return {
          success: false,
          error: `Cartela e do modo ${decodedCard.mode}, mas o jogo atual e ${currentMode} bolas`,
        };
      }

      // Verificar duplicata
      const isDuplicate = trackedCards.some((tc) => tc.cardCode === cardCode);
      if (isDuplicate) {
        return { success: false, error: "Esta cartela ja esta sendo rastreada" };
      }

      // Extrair todos os números da cartela
      let cardNumbers: number[];
      if (decodedCard.mode === "75") {
        cardNumbers = Object.values(decodedCard.numbers).flat();
      } else {
        cardNumbers = decodedCard.numbers.flat();
      }

      const newCard: TrackedCard = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ownerName: ownerName.trim(),
        cardCode,
        mode: decodedCard.mode,
        cardNumbers,
        addedAt: Date.now(),
      };

      setTrackedCards((prev) => [...prev, newCard]);
      return { success: true };
    },
    [trackedCards, currentMode]
  );

  // Remover cartela
  const removeCard = useCallback((cardId: string) => {
    setTrackedCards((prev) => prev.filter((c) => c.id !== cardId));
  }, []);

  // Limpar todas as cartelas
  const clearAllCards = useCallback(() => {
    setTrackedCards([]);
    clearCardTrackerState();
  }, []);

  // Computar status de cada cartela
  const cardStatuses: TrackedCardStatus[] = useMemo(() => {
    return trackedCards
      .filter((card) => card.mode === currentMode) // Apenas cartelas do modo atual
      .map((card) => {
        const markedNumbers = card.cardNumbers.filter((n) =>
          drawnNumbers.includes(n)
        );
        const unmarkedNumbers = card.cardNumbers.filter(
          (n) => !drawnNumbers.includes(n)
        );
        const progress = (markedNumbers.length / card.cardNumbers.length) * 100;

        // Verificar bingo usando a função existente
        const decodedCard = decodeCard(card.cardCode);
        const hasBingo = decodedCard
          ? checkWin(decodedCard, markedNumbers).hasWon
          : false;

        return {
          card,
          markedNumbers,
          unmarkedNumbers,
          progress,
          hasBingo,
        };
      });
  }, [trackedCards, drawnNumbers, currentMode]);

  // Agrupar por dono (ordenado alfabeticamente)
  const cardsByOwner = useMemo(() => {
    const grouped = new Map<string, TrackedCardStatus[]>();
    for (const status of cardStatuses) {
      const existing = grouped.get(status.card.ownerName) || [];
      grouped.set(status.card.ownerName, [...existing, status]);
    }
    // Ordenar por nome do dono (alfabético)
    return new Map([...grouped.entries()].sort((a, b) => a[0].localeCompare(b[0])));
  }, [cardStatuses]);

  // Ordenar por progresso (maior primeiro), depois pelo nome do dono
  const cardsSortedByProgress = useMemo(() => {
    return [...cardStatuses].sort((a, b) => {
      // Primeiro por progresso (maior primeiro)
      if (b.progress !== a.progress) {
        return b.progress - a.progress;
      }
      // Depois pelo nome do dono (ordem alfabética)
      return a.card.ownerName.localeCompare(b.card.ownerName);
    });
  }, [cardStatuses]);

  // Contar cartelas com bingo
  const bingoCount = useMemo(() => {
    return cardStatuses.filter((s) => s.hasBingo).length;
  }, [cardStatuses]);

  return {
    trackedCards,
    cardStatuses,
    cardsByOwner,
    cardsSortedByProgress,
    drawnNumbers,
    currentMode,
    bingoCount,
    addCard,
    removeCard,
    clearAllCards,
    isLoaded,
  };
}
