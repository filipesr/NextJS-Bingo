import type { BingoCard75, BingoCard90 } from "./types";

/**
 * Valida uma cartela de Bingo 90 bolas
 *
 * @param card - Cartela a ser validada
 * @returns true se válida, false caso contrário
 */
export function validateCard90(card: BingoCard90): boolean {
  try {
    // Validar mode
    if (card.mode !== "90") {
      return false;
    }

    // Validar que temos 9 grupos
    if (card.numbers.length !== 9) {
      return false;
    }

    const allNumbers: number[] = [];

    // Validar cada grupo
    for (let groupIndex = 0; groupIndex < 9; groupIndex++) {
      const groupNumbers = card.numbers[groupIndex];
      const base = groupIndex * 10;

      // Cada grupo pode ter 0-3 números
      if (groupNumbers.length > 3) {
        return false;
      }

      for (const number of groupNumbers) {
        // Validar range (1-90)
        if (number < 1 || number > 90 || !Number.isInteger(number)) {
          return false;
        }

        // Validar que pertence ao grupo correto
        const expectedMin = base + 1;
        const expectedMax = base + 10;
        if (number < expectedMin || number > expectedMax) {
          return false;
        }

        // Verificar duplicatas
        if (allNumbers.includes(number)) {
          return false;
        }

        allNumbers.push(number);
      }
    }

    // Deve ter exatamente 15 números
    if (allNumbers.length !== 15) {
      return false;
    }

    // No máximo 2 grupos podem estar vazios
    const emptyGroups = card.numbers.filter((g) => g.length === 0).length;
    if (emptyGroups > 2) {
      return false;
    }

    // Validar grid
    if (card.grid.length !== 3 || card.grid.some((row) => row.length !== 9)) {
      return false;
    }

    // Validar que cada linha tem exatamente 5 números
    for (const row of card.grid) {
      const numbersInRow = row.filter((cell) => cell !== null).length;
      if (numbersInRow !== 5) {
        return false;
      }
    }

    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Valida uma cartela de Bingo 75 bolas
 *
 * @param card - Cartela a ser validada
 * @returns true se válida, false caso contrário
 */
export function validateCard75(card: BingoCard75): boolean {
  try {
    // Validar mode
    if (card.mode !== "75") {
      return false;
    }

    const allNumbers: number[] = [];

    // Validar colunas
    const columns = [
      { key: "B" as const, min: 1, max: 15, count: 5 },
      { key: "I" as const, min: 16, max: 30, count: 5 },
      { key: "N" as const, min: 31, max: 45, count: 4 }, // 4 + FREE
      { key: "G" as const, min: 46, max: 60, count: 5 },
      { key: "O" as const, min: 61, max: 75, count: 5 },
    ];

    for (const column of columns) {
      const columnNumbers = card.numbers[column.key];

      // Validar contagem
      if (columnNumbers.length !== column.count) {
        return false;
      }

      for (const number of columnNumbers) {
        // Validar range
        if (
          number < column.min ||
          number > column.max ||
          !Number.isInteger(number)
        ) {
          return false;
        }

        // Verificar duplicatas
        if (allNumbers.includes(number)) {
          return false;
        }

        allNumbers.push(number);
      }
    }

    // Deve ter exatamente 24 números
    if (allNumbers.length !== 24) {
      return false;
    }

    // Validar grid
    if (card.grid.length !== 5 || card.grid.some((row) => row.length !== 5)) {
      return false;
    }

    // Validar FREE space no centro
    if (card.grid[2][2] !== null) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Valida uma cartela (detecta automaticamente a modalidade)
 *
 * @param card - Cartela a ser validada
 * @returns true se válida, false caso contrário
 */
export function validateCard(card: BingoCard75 | BingoCard90): boolean {
  if (card.mode === "90") {
    return validateCard90(card);
  } else if (card.mode === "75") {
    return validateCard75(card);
  }
  return false;
}
