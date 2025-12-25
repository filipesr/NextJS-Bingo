import type { BingoCard75, BingoCard90 } from "./types";
import { encode75, encode90 } from "./encoder";
import { shuffle } from "./generator";

/**
 * Gera uma cartela aleatória de Bingo 75 bolas
 *
 * @returns Cartela 75 bolas com números aleatórios válidos
 */
export function generateRandomCard75(): BingoCard75 | null {
  try {
    // Gerar 5 números para cada coluna
    const B: number[] = [];
    const I: number[] = [];
    const N: number[] = [];
    const G: number[] = [];
    const O: number[] = [];

    // Coluna B (1-15)
    const bNumbers = shuffle(Array.from({ length: 15 }, (_, i) => i + 1));
    B.push(...bNumbers.slice(0, 5));

    // Coluna I (16-30)
    const iNumbers = shuffle(Array.from({ length: 15 }, (_, i) => i + 16));
    I.push(...iNumbers.slice(0, 5));

    // Coluna N (31-45) - apenas 4 números (centro é FREE)
    const nNumbers = shuffle(Array.from({ length: 15 }, (_, i) => i + 31));
    N.push(...nNumbers.slice(0, 4));

    // Coluna G (46-60)
    const gNumbers = shuffle(Array.from({ length: 15 }, (_, i) => i + 46));
    G.push(...gNumbers.slice(0, 5));

    // Coluna O (61-75)
    const oNumbers = shuffle(Array.from({ length: 15 }, (_, i) => i + 61));
    O.push(...oNumbers.slice(0, 5));

    // Ordenar números dentro de cada coluna
    B.sort((a, b) => a - b);
    I.sort((a, b) => a - b);
    N.sort((a, b) => a - b);
    G.sort((a, b) => a - b);
    O.sort((a, b) => a - b);

    const numbers = { B, I, N, G, O };

    // Gerar código
    const code = encode75(numbers);
    if (!code) {
      return null;
    }

    // Criar grid 5x5
    const grid: (number | null)[][] = Array(5)
      .fill(null)
      .map(() => Array(5).fill(null));

    // Preencher grid
    for (let row = 0; row < 5; row++) {
      grid[row][0] = B[row];
      grid[row][1] = I[row];
      // Coluna N - centro é FREE
      if (row < 2) {
        grid[row][2] = N[row];
      } else if (row > 2) {
        grid[row][2] = N[row - 1];
      } // row === 2 fica null (FREE)
      grid[row][3] = G[row];
      grid[row][4] = O[row];
    }

    return {
      mode: "75",
      code,
      numbers,
      grid,
    };
  } catch (error) {
    console.error("Erro ao gerar cartela 75:", error);
    return null;
  }
}

/**
 * Gera uma cartela aleatória de Bingo 90 bolas
 *
 * @returns Cartela 90 bolas com números aleatórios válidos
 */
export function generateRandomCard90(): BingoCard90 | null {
  try {
    // Para Bingo 90, cada linha deve ter exatamente 5 números
    // Estratégia: primeiro criar o layout (quais células terão números),
    // depois preencher com números aleatórios válidos

    let grid: (number | null)[][] = [];
    let numbersByGroup: number[][] = [];
    let attempts = 0;
    const maxAttempts = 100;

    // Tentar gerar um layout válido
    while (attempts < maxAttempts) {
      attempts++;

      // Criar grid 3x9 vazio
      grid = Array(3)
        .fill(null)
        .map(() => Array(9).fill(null));

      // Para cada linha, selecionar aleatoriamente 5 colunas para ter números
      for (let row = 0; row < 3; row++) {
        const availableColumns = Array.from({ length: 9 }, (_, i) => i);
        const shuffledColumns = shuffle(availableColumns);
        const selectedColumns = shuffledColumns.slice(0, 5);

        // Marcar essas colunas com um placeholder
        for (const col of selectedColumns) {
          grid[row][col] = -1; // Placeholder temporário
        }
      }

      // Verificar se o layout é válido:
      // - Cada coluna deve ter no máximo 3 números
      // - No máximo 2 colunas podem estar vazias (mínimo 7 com números)
      const columnCounts = Array(9).fill(0);
      for (let col = 0; col < 9; col++) {
        for (let row = 0; row < 3; row++) {
          if (grid[row][col] !== null) {
            columnCounts[col]++;
          }
        }
      }

      const maxPerColumn = Math.max(...columnCounts);
      const emptyColumns = columnCounts.filter(c => c === 0).length;

      if (maxPerColumn <= 3 && emptyColumns <= 2) {
        // Layout válido encontrado!
        break;
      }
    }

    if (attempts >= maxAttempts) {
      console.error("Não foi possível gerar um layout válido após", maxAttempts, "tentativas");
      return null;
    }

    // Agora preencher o grid com números reais
    numbersByGroup = Array(9)
      .fill(null)
      .map(() => []);

    for (let col = 0; col < 9; col++) {
      // Coletar quais linhas precisam de números nesta coluna
      const rowsWithNumbers: number[] = [];
      for (let row = 0; row < 3; row++) {
        if (grid[row][col] !== null) {
          rowsWithNumbers.push(row);
        }
      }

      if (rowsWithNumbers.length === 0) continue;

      // Gerar números aleatórios para esta coluna
      const base = col * 10;
      const min = base + 1;
      const max = base + 10;

      const available = Array.from({ length: 10 }, (_, i) => min + i);
      const shuffled = shuffle(available);
      const selected = shuffled.slice(0, rowsWithNumbers.length).sort((a, b) => a - b);

      // Atribuir números às linhas
      for (let i = 0; i < rowsWithNumbers.length; i++) {
        const row = rowsWithNumbers[i];
        grid[row][col] = selected[i];
      }

      numbersByGroup[col] = selected;
    }

    // Gerar código
    const code = encode90(numbersByGroup);
    if (!code) {
      return null;
    }

    return {
      mode: "90",
      code,
      numbers: numbersByGroup,
      grid,
    };
  } catch (error) {
    console.error("Erro ao gerar cartela 90:", error);
    return null;
  }
}
