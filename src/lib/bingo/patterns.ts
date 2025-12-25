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

  // Coletar TODOS os padrões completos
  const completedPatterns: [number, number][] = [];

  // Verificar linhas horizontais
  for (let row = 0; row < 5; row++) {
    if (marked[row].every((m) => m)) {
      completedPatterns.push(
        ...Array.from({ length: 5 }, (_, col) => [row, col] as [number, number])
      );
    }
  }

  // Verificar linhas verticais
  for (let col = 0; col < 5; col++) {
    if (marked.every((row) => row[col])) {
      completedPatterns.push(
        ...Array.from({ length: 5 }, (_, row) => [row, col] as [number, number])
      );
    }
  }

  // Verificar diagonal principal (↘)
  if (marked.every((row, i) => row[i])) {
    completedPatterns.push(
      ...Array.from({ length: 5 }, (_, i) => [i, i] as [number, number])
    );
  }

  // Verificar diagonal secundária (↙)
  if (marked.every((row, i) => row[4 - i])) {
    completedPatterns.push(
      ...Array.from({ length: 5 }, (_, i) => [i, 4 - i] as [number, number])
    );
  }

  // Verificar four-corners
  if (marked[0][0] && marked[0][4] && marked[4][0] && marked[4][4]) {
    completedPatterns.push([0, 0], [0, 4], [4, 0], [4, 4]);
  }

  // Remover duplicatas (mesma célula pode estar em múltiplos padrões)
  const uniquePositions = completedPatterns.filter(
    ([r, c], i, arr) =>
      arr.findIndex(([r2, c2]) => r2 === r && c2 === c) === i
  );

  // Verificar blackout (cartela cheia)
  const isBlackout = marked.every((row) => row.every((m) => m));

  // Vitória APENAS quando blackout
  if (isBlackout) {
    return {
      hasWon: true,
      pattern: "blackout",
      winningPositions: marked.flatMap((row, r) =>
        row.map((_, c) => [r, c] as [number, number])
      ),
    };
  }

  // Se tem padrões completos mas não é blackout, retornar posições para destaque
  // mas hasWon = false
  if (uniquePositions.length > 0) {
    return {
      hasWon: false,
      winningPositions: uniquePositions,
    };
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

  // Detectar TODAS as linhas completas
  let completedLines = 0;
  const allCompletedPositions: [number, number][] = [];

  for (let row = 0; row < 3; row++) {
    const rowNumbers = grid[row].filter((n) => n !== null);
    const rowMarked = rowNumbers.every((n) => markedNumbers.includes(n!));

    if (rowMarked && rowNumbers.length > 0) {
      completedLines++;
      // Adicionar todas as posições desta linha
      const rowPositions = grid[row]
        .map((num, col) => (num !== null ? [row, col] as [number, number] : null))
        .filter((pos): pos is [number, number] => pos !== null);
      allCompletedPositions.push(...rowPositions);
    }
  }

  // Vitória APENAS quando 3 linhas completas (full-house)
  if (completedLines === 3) {
    return {
      hasWon: true,
      pattern: "full-house",
      winningPositions: allCompletedPositions,
    };
  }

  // Se tem linhas completas mas não é full-house, retornar posições para destaque visual
  // mas hasWon = false
  if (completedLines > 0) {
    return {
      hasWon: false,
      winningPositions: allCompletedPositions,
    };
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
