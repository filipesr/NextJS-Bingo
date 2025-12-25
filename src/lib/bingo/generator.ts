import type { BingoMode, SortState } from "./types";

/**
 * Gera um array com todos os números disponíveis para uma modalidade
 *
 * @param mode - Modalidade (75 ou 90)
 * @returns Array com números de 1 a 75 ou 1 a 90
 */
export function generateAvailableNumbers(mode: BingoMode): number[] {
  const max = mode === "75" ? 75 : 90;
  return Array.from({ length: max }, (_, i) => i + 1);
}

/**
 * Sorteia um número aleatório de um array
 *
 * @param numbers - Array de números disponíveis
 * @returns Número sorteado ou null se array vazio
 */
export function drawRandomNumber(numbers: number[]): number | null {
  if (numbers.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * numbers.length);
  return numbers[randomIndex];
}

/**
 * Inicializa o estado do sorteio
 *
 * @param mode - Modalidade (75 ou 90)
 * @returns Estado inicial do sorteio
 */
export function initializeSortState(mode: BingoMode): SortState {
  return {
    mode,
    drawnNumbers: [],
    currentNumber: null,
    availableNumbers: generateAvailableNumbers(mode),
    timestamp: Date.now(),
  };
}

/**
 * Sorteia o próximo número
 *
 * @param state - Estado atual do sorteio
 * @returns Novo estado com número sorteado ou null se não há mais números
 */
export function drawNextNumber(state: SortState): SortState | null {
  if (state.availableNumbers.length === 0) {
    return null; // Não há mais números para sortear
  }

  const drawnNumber = drawRandomNumber(state.availableNumbers);

  if (drawnNumber === null) {
    return null;
  }

  // Atualizar estado
  return {
    ...state,
    drawnNumbers: [...state.drawnNumbers, drawnNumber],
    currentNumber: drawnNumber,
    availableNumbers: state.availableNumbers.filter((n) => n !== drawnNumber),
    timestamp: Date.now(),
  };
}

/**
 * Reseta o sorteio (mantém a modalidade)
 *
 * @param mode - Modalidade (75 ou 90)
 * @returns Novo estado resetado
 */
export function resetSort(mode: BingoMode): SortState {
  return initializeSortState(mode);
}

/**
 * Embaralha um array usando algoritmo Fisher-Yates
 *
 * @param array - Array a ser embaralhado
 * @returns Novo array embaralhado
 */
export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
