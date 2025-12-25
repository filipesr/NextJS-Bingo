"use client";

import { useState, useEffect, useCallback } from "react";
import type { BingoMode, SortState } from "@/lib/bingo/types";
import {
  initializeSortState,
  drawNextNumber,
  resetSort,
} from "@/lib/bingo/generator";
import {
  saveSortState,
  loadSortState,
  clearSortState,
} from "@/lib/storage/localStorage";

/**
 * Hook customizado para gerenciar o estado do sorteio de Bingo
 *
 * @param mode - Modalidade inicial (75 ou 90)
 * @returns Objeto com estado e funções de controle
 */
export function useBingoSort(mode: BingoMode) {
  const [sortState, setSortState] = useState<SortState>(() =>
    initializeSortState(mode)
  );
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregar estado salvo do localStorage na montagem
  useEffect(() => {
    const savedState = loadSortState();
    if (savedState && savedState.mode === mode) {
      setSortState(savedState);
    }
    setIsLoaded(true);
  }, [mode]);

  // Salvar estado no localStorage sempre que mudar
  useEffect(() => {
    if (isLoaded) {
      saveSortState(sortState);
    }
  }, [sortState, isLoaded]);

  // Sortear próximo número
  const draw = useCallback(() => {
    const newState = drawNextNumber(sortState);
    if (newState) {
      setSortState(newState);
    }
  }, [sortState]);

  // Resetar sorteio
  const reset = useCallback(() => {
    const newState = resetSort(sortState.mode);
    setSortState(newState);
    clearSortState();
  }, [sortState.mode]);

  // Mudar modalidade
  const changeMode = useCallback((newMode: BingoMode) => {
    const newState = initializeSortState(newMode);
    setSortState(newState);
    clearSortState();
  }, []);

  return {
    sortState,
    draw,
    reset,
    changeMode,
    hasMoreNumbers: sortState.availableNumbers.length > 0,
    drawnCount: sortState.drawnNumbers.length,
    totalNumbers: sortState.mode === "75" ? 75 : 90,
  };
}
