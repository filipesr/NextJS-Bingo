import type { SortState, CardMarking } from "../bingo/types";
import { STORAGE_KEYS } from "../bingo/types";

/**
 * Salva o estado do sorteio no localStorage
 *
 * @param state - Estado do sorteio a ser salvo
 */
export function saveSortState(state: SortState): void {
  try {
    if (typeof window === "undefined") return; // SSR safety
    localStorage.setItem(STORAGE_KEYS.SORT_STATE, JSON.stringify(state));
  } catch (error) {
    console.error("Erro ao salvar estado do sorteio:", error);
  }
}

/**
 * Carrega o estado do sorteio do localStorage
 *
 * @returns Estado do sorteio ou null se não encontrado
 */
export function loadSortState(): SortState | null {
  try {
    if (typeof window === "undefined") return null; // SSR safety
    const data = localStorage.getItem(STORAGE_KEYS.SORT_STATE);
    if (!data) return null;
    return JSON.parse(data) as SortState;
  } catch (error) {
    console.error("Erro ao carregar estado do sorteio:", error);
    return null;
  }
}

/**
 * Limpa o estado do sorteio do localStorage
 */
export function clearSortState(): void {
  try {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEYS.SORT_STATE);
  } catch (error) {
    console.error("Erro ao limpar estado do sorteio:", error);
  }
}

/**
 * Salva as marcações de uma cartela no localStorage
 *
 * @param code - Código da cartela
 * @param marking - Marcações da cartela
 */
export function saveCardMarking(code: string, marking: CardMarking): void {
  try {
    if (typeof window === "undefined") return;
    const key = STORAGE_KEYS.CARD_MARKING + code;
    localStorage.setItem(key, JSON.stringify(marking));
  } catch (error) {
    console.error("Erro ao salvar marcações da cartela:", error);
  }
}

/**
 * Carrega as marcações de uma cartela do localStorage
 *
 * @param code - Código da cartela
 * @returns Marcações da cartela ou null se não encontrado
 */
export function loadCardMarking(code: string): CardMarking | null {
  try {
    if (typeof window === "undefined") return null;
    const key = STORAGE_KEYS.CARD_MARKING + code;
    const data = localStorage.getItem(key);
    if (!data) return null;
    return JSON.parse(data) as CardMarking;
  } catch (error) {
    console.error("Erro ao carregar marcações da cartela:", error);
    return null;
  }
}

/**
 * Limpa as marcações de uma cartela do localStorage
 *
 * @param code - Código da cartela
 */
export function clearCardMarking(code: string): void {
  try {
    if (typeof window === "undefined") return;
    const key = STORAGE_KEYS.CARD_MARKING + code;
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Erro ao limpar marcações da cartela:", error);
  }
}

/**
 * Limpa todos os dados do Bingo do localStorage
 */
export function clearAllBingoData(): void {
  try {
    if (typeof window === "undefined") return;

    // Limpar estado do sorteio
    clearSortState();

    // Limpar todas as marcações de cartelas
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key.startsWith(STORAGE_KEYS.CARD_MARKING)) {
        localStorage.removeItem(key);
      }
    }
  } catch (error) {
    console.error("Erro ao limpar todos os dados do Bingo:", error);
  }
}
