"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { BingoCard75, BingoCard90, CardStats, WinCheck } from "@/lib/bingo/types";
import { decodeCard } from "@/lib/bingo/decoder";
import { checkWin } from "@/lib/bingo/patterns";
import {
  saveCardMarking,
  loadCardMarking,
  loadSortState,
} from "@/lib/storage/localStorage";

/**
 * Hook customizado para gerenciar uma cartela de Bingo
 *
 * @param code - Código da cartela
 * @returns Objeto com cartela, estado e funções de controle
 */
export function useBingoCard(code: string) {
  const [card, setCard] = useState<BingoCard75 | BingoCard90 | null>(null);
  const [markedNumbers, setMarkedNumbers] = useState<number[]>([]);
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Decodificar cartela
  useEffect(() => {
    const decodedCard = decodeCard(code);
    if (decodedCard) {
      setCard(decodedCard);
    }
  }, [code]);

  // Carregar marcações salvas
  useEffect(() => {
    if (!card) return;

    const savedMarking = loadCardMarking(code);
    if (savedMarking) {
      setMarkedNumbers(savedMarking.markedNumbers);
    }
    setIsLoaded(true);
  }, [code, card]);

  // Carregar números sorteados do localStorage
  useEffect(() => {
    const interval = setInterval(() => {
      const sortState = loadSortState();
      if (sortState && card && sortState.mode === card.mode) {
        setDrawnNumbers(sortState.drawnNumbers);
      }
    }, 500); // Verificar a cada 500ms

    return () => clearInterval(interval);
  }, [card]);

  // Salvar marcações sempre que mudar
  useEffect(() => {
    if (isLoaded && card) {
      saveCardMarking(code, {
        code,
        markedNumbers,
        timestamp: Date.now(),
      });
    }
  }, [markedNumbers, code, isLoaded, card]);

  // Marcar/desmarcar número
  const toggleNumber = useCallback((number: number) => {
    setMarkedNumbers((prev) => {
      if (prev.includes(number)) {
        return prev.filter((n) => n !== number);
      } else {
        return [...prev, number];
      }
    });
  }, []);

  // Verificar vitória
  const winCheck: WinCheck = useMemo(() => {
    if (!card) {
      return { hasWon: false };
    }
    return checkWin(card, markedNumbers);
  }, [card, markedNumbers]);

  // Calcular estatísticas
  const stats: CardStats = useMemo(() => {
    if (!card) {
      return {
        totalNumbers: 0,
        markedNumbers: 0,
        drawnButNotMarked: 0,
        percentage: 0,
        remainingToWin: 0,
      };
    }

    // Obter todos os números da cartela
    const cardNumbers =
      card.mode === "75"
        ? Object.values(card.numbers).flat()
        : card.numbers.flat();

    const totalNumbers = cardNumbers.length;
    const marked = markedNumbers.length;

    // Números sorteados que estão na cartela mas não foram marcados
    const drawnButNotMarked = drawnNumbers.filter(
      (n) => cardNumbers.includes(n) && !markedNumbers.includes(n)
    ).length;

    // Porcentagem de progresso
    const percentage = totalNumbers > 0 ? (marked / totalNumbers) * 100 : 0;

    // Números faltantes para vitória (simplificado: próximo padrão de linha)
    let remainingToWin = 0;
    if (card.mode === "75") {
      // Verificar linha mais próxima de ser completada
      for (let row = 0; row < 5; row++) {
        const rowNumbers = card.grid[row].filter((n) => n !== null);
        const rowMarked = rowNumbers.filter((n) =>
          markedNumbers.includes(n!)
        ).length;
        const rowRemaining = rowNumbers.length - rowMarked;
        if (remainingToWin === 0 || rowRemaining < remainingToWin) {
          remainingToWin = rowRemaining;
        }
      }
    } else {
      // Bingo 90: verificar primeira linha
      for (let row = 0; row < 3; row++) {
        const rowNumbers = card.grid[row].filter((n) => n !== null);
        const rowMarked = rowNumbers.filter((n) =>
          markedNumbers.includes(n!)
        ).length;
        const rowRemaining = rowNumbers.length - rowMarked;
        if (remainingToWin === 0 || rowRemaining < remainingToWin) {
          remainingToWin = rowRemaining;
        }
      }
    }

    return {
      totalNumbers,
      markedNumbers: marked,
      drawnButNotMarked,
      percentage: Math.round(percentage),
      remainingToWin,
    };
  }, [card, markedNumbers, drawnNumbers]);

  return {
    card,
    markedNumbers,
    drawnNumbers,
    toggleNumber,
    winCheck,
    stats,
    isValid: card !== null,
  };
}
