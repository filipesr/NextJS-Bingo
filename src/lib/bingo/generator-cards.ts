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
    // Gerar 15 números distribuídos em 9 grupos (dezenas)
    const numbersByGroup: number[][] = Array(9)
      .fill(null)
      .map(() => []);

    // Distribuir números: 15 números total, cada linha tem 5 números
    // Precisamos garantir que cada linha tenha exatamente 5 números

    // Estratégia: selecionar aleatoriamente quais grupos terão números
    // e quantos números cada grupo terá (respeitando mín 1, máx 3 por grupo)

    const totalNumbers = 15;
    let numbersPlaced = 0;
    const groupCounts = Array(9).fill(0);

    // Distribuir contagens aleatoriamente
    while (numbersPlaced < totalNumbers) {
      const groupIndex = Math.floor(Math.random() * 9);

      // Permitir no máximo 3 números por grupo
      if (groupCounts[groupIndex] < 3) {
        groupCounts[groupIndex]++;
        numbersPlaced++;
      }
    }

    // Garantir que no máximo 2 grupos estejam vazios
    const emptyGroups = groupCounts.filter(c => c === 0).length;
    if (emptyGroups > 2) {
      // Redistribuir: pegar números de grupos cheios e colocar nos vazios
      const fullGroups = groupCounts
        .map((count, index) => ({ count, index }))
        .filter(g => g.count > 1)
        .sort((a, b) => b.count - a.count);

      const emptyGroupIndices = groupCounts
        .map((count, index) => ({ count, index }))
        .filter(g => g.count === 0)
        .map(g => g.index);

      let redistributed = 0;
      for (let i = 0; i < emptyGroupIndices.length && redistributed < emptyGroups - 2; i++) {
        const emptyIndex = emptyGroupIndices[i];
        const fullGroup = fullGroups[i % fullGroups.length];

        if (fullGroup && groupCounts[fullGroup.index] > 1) {
          groupCounts[fullGroup.index]--;
          groupCounts[emptyIndex]++;
          redistributed++;
        }
      }
    }

    // Gerar números para cada grupo
    for (let groupIndex = 0; groupIndex < 9; groupIndex++) {
      const count = groupCounts[groupIndex];
      if (count === 0) continue;

      const base = groupIndex * 10;
      const min = base + 1;
      const max = base + 10;

      // Gerar números disponíveis para este grupo
      const available = Array.from({ length: 10 }, (_, i) => min + i);
      const shuffled = shuffle(available);
      const selected = shuffled.slice(0, count).sort((a, b) => a - b);

      numbersByGroup[groupIndex] = selected;
    }

    // Gerar código
    const code = encode90(numbersByGroup);
    if (!code) {
      return null;
    }

    // Criar grid 9x3
    // Cada linha deve ter exatamente 5 números e 4 espaços vazios
    const grid: (number | null)[][] = Array(3)
      .fill(null)
      .map(() => Array(9).fill(null));

    // Distribuir números no grid
    // Para cada coluna, distribuir seus números nas linhas
    for (let col = 0; col < 9; col++) {
      const colNumbers = numbersByGroup[col];
      for (let i = 0; i < colNumbers.length; i++) {
        grid[i][col] = colNumbers[i];
      }
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
