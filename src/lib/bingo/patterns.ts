import type {
  BingoCard75,
  BingoCard90,
  WinCheck,
  WinPattern75,
  WinPattern90,
} from "./types";

/**
 * Verifica se um padrão de vitória foi completado em uma cartela de Bingo 75
 *
 * @param card - Cartela de Bingo 75
 * @param markedNumbers - Números marcados pelo usuário
 * @param pattern - Padrão de vitória a verificar (opcional, usa padrões básicos se não especificado)
 * @returns Resultado da verificação
 */
export function checkWin75(
  card: BingoCard75,
  markedNumbers: number[],
  pattern?: WinPattern75
): WinCheck {
  const { grid } = card;

  // Criar grid de marcações (true = marcado, false = não marcado)
  const marked: boolean[][] = grid.map((row) =>
    row.map((num) => {
      if (num === null) return true; // FREE space sempre marcado
      return markedNumbers.includes(num);
    })
  );

  // Se pattern não especificado, verificar todos os padrões básicos
  if (!pattern) {
    // Verificar linhas horizontais
    for (let row = 0; row < 5; row++) {
      if (marked[row].every((m) => m)) {
        return {
          hasWon: true,
          pattern: "horizontal",
          winningPositions: Array.from({ length: 5 }, (_, col) => [row, col]),
        };
      }
    }

    // Verificar linhas verticais
    for (let col = 0; col < 5; col++) {
      if (marked.every((row) => row[col])) {
        return {
          hasWon: true,
          pattern: "vertical",
          winningPositions: Array.from({ length: 5 }, (_, row) => [row, col]),
        };
      }
    }

    // Verificar diagonal principal (↘)
    if (marked.every((row, i) => row[i])) {
      return {
        hasWon: true,
        pattern: "diagonal",
        winningPositions: Array.from({ length: 5 }, (_, i) => [i, i]),
      };
    }

    // Verificar diagonal secundária (↙)
    if (marked.every((row, i) => row[4 - i])) {
      return {
        hasWon: true,
        pattern: "diagonal",
        winningPositions: Array.from({ length: 5 }, (_, i) => [i, 4 - i]),
      };
    }

    // Verificar blackout (cartela cheia)
    if (marked.every((row) => row.every((m) => m))) {
      return {
        hasWon: true,
        pattern: "blackout",
        winningPositions: marked.flatMap((row, r) =>
          row.map((_, c) => [r, c] as [number, number])
        ),
      };
    }

    return { hasWon: false };
  }

  // Verificar padrão específico
  switch (pattern) {
    case "horizontal":
      for (let row = 0; row < 5; row++) {
        if (marked[row].every((m) => m)) {
          return {
            hasWon: true,
            pattern: "horizontal",
            winningPositions: Array.from({ length: 5 }, (_, col) => [
              row,
              col,
            ]),
          };
        }
      }
      break;

    case "vertical":
      for (let col = 0; col < 5; col++) {
        if (marked.every((row) => row[col])) {
          return {
            hasWon: true,
            pattern: "vertical",
            winningPositions: Array.from({ length: 5 }, (_, row) => [
              row,
              col,
            ]),
          };
        }
      }
      break;

    case "diagonal":
      // Diagonal principal
      if (marked.every((row, i) => row[i])) {
        return {
          hasWon: true,
          pattern: "diagonal",
          winningPositions: Array.from({ length: 5 }, (_, i) => [i, i]),
        };
      }
      // Diagonal secundária
      if (marked.every((row, i) => row[4 - i])) {
        return {
          hasWon: true,
          pattern: "diagonal",
          winningPositions: Array.from({ length: 5 }, (_, i) => [i, 4 - i]),
        };
      }
      break;

    case "four-corners":
      if (marked[0][0] && marked[0][4] && marked[4][0] && marked[4][4]) {
        return {
          hasWon: true,
          pattern: "four-corners",
          winningPositions: [
            [0, 0],
            [0, 4],
            [4, 0],
            [4, 4],
          ],
        };
      }
      break;

    case "x-pattern":
      // Ambas diagonais completas
      const diag1 = marked.every((row, i) => row[i]);
      const diag2 = marked.every((row, i) => row[4 - i]);
      if (diag1 && diag2) {
        return {
          hasWon: true,
          pattern: "x-pattern",
          winningPositions: [
            ...Array.from({ length: 5 }, (_, i) => [i, i] as [number, number]),
            ...Array.from({ length: 5 }, (_, i) => [i, 4 - i] as [
              number,
              number
            ]),
          ].filter(
            ([r, c], i, arr) =>
              arr.findIndex(([r2, c2]) => r2 === r && c2 === c) === i
          ), // Remove duplicata do centro
        };
      }
      break;

    case "blackout":
      if (marked.every((row) => row.every((m) => m))) {
        return {
          hasWon: true,
          pattern: "blackout",
          winningPositions: marked.flatMap((row, r) =>
            row.map((_, c) => [r, c] as [number, number])
          ),
        };
      }
      break;
  }

  return { hasWon: false };
}

/**
 * Verifica se um padrão de vitória foi completado em uma cartela de Bingo 90
 *
 * @param card - Cartela de Bingo 90
 * @param markedNumbers - Números marcados pelo usuário
 * @param pattern - Padrão de vitória a verificar (opcional, usa padrões básicos se não especificado)
 * @returns Resultado da verificação
 */
export function checkWin90(
  card: BingoCard90,
  markedNumbers: number[],
  pattern?: WinPattern90
): WinCheck {
  const { grid } = card;

  // Criar grid de marcações (true = marcado, false = não marcado/vazio)
  const marked: boolean[][] = grid.map((row) =>
    row.map((num) => {
      if (num === null) return false; // Espaço vazio
      return markedNumbers.includes(num);
    })
  );

  // Se pattern não especificado, verificar todos os padrões
  if (!pattern) {
    // Verificar 1 linha completa
    for (let row = 0; row < 3; row++) {
      const rowNumbers = grid[row].filter((n) => n !== null);
      const rowMarked = rowNumbers.every((n) => markedNumbers.includes(n!));
      if (rowMarked && rowNumbers.length > 0) {
        return {
          hasWon: true,
          pattern: "one-line",
          winningPositions: grid[row]
            .map((num, col) => (num !== null ? [row, col] : null))
            .filter((pos) => pos !== null) as [number, number][],
        };
      }
    }

    return { hasWon: false };
  }

  // Verificar padrão específico
  switch (pattern) {
    case "one-line":
      for (let row = 0; row < 3; row++) {
        const rowNumbers = grid[row].filter((n) => n !== null);
        const rowMarked = rowNumbers.every((n) => markedNumbers.includes(n!));
        if (rowMarked && rowNumbers.length > 0) {
          return {
            hasWon: true,
            pattern: "one-line",
            winningPositions: grid[row]
              .map((num, col) => (num !== null ? [row, col] : null))
              .filter((pos) => pos !== null) as [number, number][],
          };
        }
      }
      break;

    case "two-lines":
      let completedLines = 0;
      const linePositions: [number, number][] = [];

      for (let row = 0; row < 3; row++) {
        const rowNumbers = grid[row].filter((n) => n !== null);
        const rowMarked = rowNumbers.every((n) => markedNumbers.includes(n!));
        if (rowMarked && rowNumbers.length > 0) {
          completedLines++;
          linePositions.push(
            ...(grid[row]
              .map((num, col) => (num !== null ? [row, col] : null))
              .filter((pos) => pos !== null) as [number, number][])
          );
        }
      }

      if (completedLines >= 2) {
        return {
          hasWon: true,
          pattern: "two-lines",
          winningPositions: linePositions,
        };
      }
      break;

    case "full-house":
      const allNumbers = grid.flat().filter((n) => n !== null);
      const allMarked = allNumbers.every((n) => markedNumbers.includes(n!));
      if (allMarked) {
        return {
          hasWon: true,
          pattern: "full-house",
          winningPositions: grid.flatMap((row, r) =>
            row
              .map((num, c) => (num !== null ? [r, c] : null))
              .filter((pos) => pos !== null)
          ) as [number, number][],
        };
      }
      break;
  }

  return { hasWon: false };
}

/**
 * Verifica vitória em qualquer tipo de cartela (detecta automaticamente)
 *
 * @param card - Cartela a verificar
 * @param markedNumbers - Números marcados
 * @param pattern - Padrão opcional
 * @returns Resultado da verificação
 */
export function checkWin(
  card: BingoCard75 | BingoCard90,
  markedNumbers: number[],
  pattern?: WinPattern75 | WinPattern90
): WinCheck {
  if (card.mode === "75") {
    return checkWin75(card, markedNumbers, pattern as WinPattern75);
  } else {
    return checkWin90(card, markedNumbers, pattern as WinPattern90);
  }
}
