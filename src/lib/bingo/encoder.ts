import type { BingoCard75, BingoCard90 } from "./types";

/**
 * Codifica números de uma cartela Bingo 90 bolas em código compacto
 *
 * Formato: 9 grupos decimais separados por "+"
 * Cada grupo representa uma dezena (0-9, 10-19, ..., 80-89)
 * Dígito "0" representa o múltiplo de 10 (10, 20, 30, etc)
 *
 * @param numbers - Array de 9 arrays, cada um com os números do grupo
 * @returns Código da cartela ou null se inválido
 *
 * @example
 * encode90([[1,2,3], [14,15], [26], [37,38], [50], [51,52], [63,64,65], [76,77], [88,89]])
 * // Returns: "123+45+6+78+0+12+345+67+89"
 */
export function encode90(numbers: number[][]): string | null {
  try {
    // Validar que temos 9 grupos
    if (numbers.length !== 9) {
      return null;
    }

    const groups: string[] = [];
    const allNumbers: number[] = [];

    for (let groupIndex = 0; groupIndex < 9; groupIndex++) {
      const groupNumbers = numbers[groupIndex];
      const base = groupIndex * 10; // Base: 0, 10, 20, ..., 80
      let groupCode = "";

      // Validar quantidade (0-3 números por grupo)
      if (groupNumbers.length > 3) {
        return null;
      }

      for (const number of groupNumbers) {
        // Validar range (1-90)
        if (number < 1 || number > 90 || !Number.isInteger(number)) {
          return null;
        }

        // Validar que o número pertence a este grupo
        const expectedMin = base + 1;
        const expectedMax = base + 10;
        if (number < expectedMin || number > expectedMax) {
          return null;
        }

        // Verificar duplicatas
        if (allNumbers.includes(number)) {
          return null;
        }
        allNumbers.push(number);

        // Converter número para dígito relativo ao grupo
        // Se número é múltiplo de 10 (10, 20, 30...), usar "0"
        const digit = number % 10 === 0 ? 0 : number % 10;
        groupCode += digit.toString();
      }

      groups.push(groupCode);
    }

    // Validar que temos exatamente 15 números
    if (allNumbers.length !== 15) {
      return null;
    }

    // Validar que no máximo 2 grupos estão vazios
    const emptyGroups = groups.filter((g) => g === "").length;
    if (emptyGroups > 2) {
      return null;
    }

    return groups.join("+");
  } catch (error) {
    return null;
  }
}

/**
 * Codifica números de uma cartela Bingo 75 bolas em código hexadecimal
 *
 * Formato: 24 caracteres hexadecimais contínuos (sem separador)
 * Posições: [0-4]=B, [5-9]=I, [10-13]=N, [14-18]=G, [19-23]=O
 * Range hex: 1-F (não usa 0)
 *
 * @param numbers - Objeto com arrays de números para cada coluna (B-I-N-G-O)
 * @returns Código da cartela ou null se inválido
 *
 * @example
 * encode75({ B: [1,3,5,9,11], I: [17,19,23,25,27], N: [37,38,43,44], G: [46,48,50,55,58], O: [63,69,71,74,75] })
 * // Returns: "1359B248AC78DE135AD39BEF"
 */
export function encode75(numbers: {
  B: number[];
  I: number[];
  N: number[];
  G: number[];
  O: number[];
}): string | null {
  try {
    const allNumbers: number[] = [];
    let code = "";

    // Configuração das colunas
    const columns = [
      { key: "B" as const, base: 0, expectedCount: 5 },
      { key: "I" as const, base: 15, expectedCount: 5 },
      { key: "N" as const, base: 30, expectedCount: 4 }, // 4 + FREE
      { key: "G" as const, base: 45, expectedCount: 5 },
      { key: "O" as const, base: 60, expectedCount: 5 },
    ];

    for (const column of columns) {
      const columnNumbers = numbers[column.key];

      // Validar contagem
      if (columnNumbers.length !== column.expectedCount) {
        return null;
      }

      for (const number of columnNumbers) {
        // Validar range (1-75)
        if (number < 1 || number > 75 || !Number.isInteger(number)) {
          return null;
        }

        // Validar que o número pertence a esta coluna
        const expectedMin = column.base + 1;
        const expectedMax = column.base + 15;
        if (number < expectedMin || number > expectedMax) {
          return null;
        }

        // Verificar duplicatas
        if (allNumbers.includes(number)) {
          return null;
        }
        allNumbers.push(number);

        // Converter número para hex relativo à base
        const hexValue = number - column.base;

        // Validar que está no range hex (1-F)
        if (hexValue < 1 || hexValue > 15) {
          return null;
        }

        // Converter para caractere hex
        const hexChar = hexValue.toString(16).toUpperCase();
        code += hexChar;
      }
    }

    // Validar que temos exatamente 24 caracteres
    if (code.length !== 24) {
      return null;
    }

    // Validar que temos exatamente 24 números únicos
    if (allNumbers.length !== 24) {
      return null;
    }

    return code;
  } catch (error) {
    return null;
  }
}

/**
 * Codifica uma cartela completa (detecta automaticamente a modalidade)
 *
 * @param card - Cartela a ser codificada
 * @returns Código da cartela ou null se inválido
 */
export function encodeCard(card: BingoCard75 | BingoCard90): string | null {
  if (card.mode === "90") {
    return encode90(card.numbers);
  } else if (card.mode === "75") {
    return encode75(card.numbers);
  }
  return null;
}
