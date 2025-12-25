import type { BingoCard75, BingoCard90 } from "./types";

/**
 * Decodifica um código de cartela Bingo 90 bolas
 *
 * Formato: 9 grupos decimais separados por "+"
 * Exemplo: "123+45+6+78+0+12+345+67+89"
 *
 * @param code - Código da cartela
 * @returns Cartela decodificada ou null se inválido
 */
export function decode90(code: string): BingoCard90 | null {
  try {
    // Dividir código em grupos
    const groups = code.split("+");

    // Deve ter exatamente 9 grupos
    if (groups.length !== 9) {
      return null;
    }

    const allNumbers: number[] = [];
    const numbersByGroup: number[][] = [];

    // Decodificar cada grupo
    for (let groupIndex = 0; groupIndex < 9; groupIndex++) {
      const group = groups[groupIndex];
      const base = groupIndex * 10; // Base: 0, 10, 20, ..., 80
      const groupNumbers: number[] = [];

      // Processar cada dígito do grupo
      for (const digit of group) {
        const digitNum = parseInt(digit, 10);

        if (isNaN(digitNum) || digitNum < 0 || digitNum > 9) {
          return null; // Dígito inválido
        }

        // Dígito "0" representa o múltiplo de 10 (10, 20, 30, etc)
        const number = digitNum === 0 ? base + 10 : base + digitNum;

        // Validar range (1-90)
        if (number < 1 || number > 90) {
          return null;
        }

        // Verificar duplicatas
        if (allNumbers.includes(number)) {
          return null;
        }

        groupNumbers.push(number);
        allNumbers.push(number);
      }

      numbersByGroup.push(groupNumbers);
    }

    // Deve ter exatamente 15 números no total
    if (allNumbers.length !== 15) {
      return null;
    }

    // Criar grid 9x3
    const grid = createGrid90(numbersByGroup);

    return {
      mode: "90",
      code,
      numbers: numbersByGroup,
      grid,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Cria o grid 9x3 para Bingo 90 bolas
 * Distribui os 15 números em 3 linhas, cada linha com 5 números e 4 espaços vazios
 * Usa algoritmo determinístico para garantir consistência
 */
function createGrid90(numbersByGroup: number[][]): (number | null)[][] {
  const grid: (number | null)[][] = Array(3)
    .fill(null)
    .map(() => Array(9).fill(null));

  // Contar números disponíveis por coluna
  const columnCounts = numbersByGroup.map(group => group.length);
  const rowCounts = [0, 0, 0]; // Contador de números por linha

  // Para cada coluna, decidir em quais linhas colocar números
  for (let col = 0; col < 9; col++) {
    const numbersInCol = columnCounts[col];
    if (numbersInCol === 0) continue;

    // Determinar quais linhas receberão números desta coluna
    // Usar hash determinístico baseado nos números da coluna
    const colNumbers = numbersByGroup[col];
    const rowAssignments: number[] = [];

    // Criar seed baseado na soma dos números da coluna
    const seed = colNumbers.reduce((sum, num) => sum + num, 0);

    // Gerar lista de linhas candidatas (0, 1, 2)
    const availableRows = [0, 1, 2];

    // Embaralhar deterministicamente usando o seed
    for (let i = availableRows.length - 1; i > 0; i--) {
      const j = (seed * (i + 1) * 17) % (i + 1); // Hash determinístico
      [availableRows[i], availableRows[j]] = [availableRows[j], availableRows[i]];
    }

    // Atribuir números às linhas, priorizando linhas com menos números
    for (let i = 0; i < numbersInCol; i++) {
      // Encontrar a linha com menos números que ainda pode receber mais
      let targetRow = -1;
      let minCount = Infinity;

      for (const row of availableRows) {
        if (rowCounts[row] < 5 && rowCounts[row] < minCount) {
          minCount = rowCounts[row];
          targetRow = row;
        }
      }

      if (targetRow === -1) {
        // Fallback: usar hash se todas as linhas estão cheias (não deveria acontecer)
        targetRow = (seed + i) % 3;
      }

      rowAssignments.push(targetRow);
      rowCounts[targetRow]++;
    }

    // Colocar os números no grid
    for (let i = 0; i < numbersInCol; i++) {
      const row = rowAssignments[i];
      grid[row][col] = colNumbers[i];
    }
  }

  return grid;
}

/**
 * Decodifica um código de cartela Bingo 75 bolas
 *
 * Formato: 24 caracteres hexadecimais contínuos (sem separador)
 * Posições: [0-4]=B, [5-9]=I, [10-13]=N, [14-18]=G, [19-23]=O
 * Exemplo: "1359B248AC78DE135AD39BEF"
 *
 * @param code - Código da cartela
 * @returns Cartela decodificada ou null se inválido
 */
export function decode75(code: string): BingoCard75 | null {
  try {
    // Deve ter exatamente 24 caracteres
    if (code.length !== 24) {
      return null;
    }

    // Validar que todos são caracteres hex válidos (1-F, não usa 0)
    if (!/^[1-9A-Fa-f]{24}$/.test(code)) {
      return null;
    }

    const allNumbers: number[] = [];
    const numbers = {
      B: [] as number[],
      I: [] as number[],
      N: [] as number[],
      G: [] as number[],
      O: [] as number[],
    };

    // Decodificar cada coluna
    const columns = [
      { key: "B" as const, start: 0, end: 5, base: 0 }, // B: [0-4]
      { key: "I" as const, start: 5, end: 10, base: 15 }, // I: [5-9]
      { key: "N" as const, start: 10, end: 14, base: 30 }, // N: [10-13]
      { key: "G" as const, start: 14, end: 19, base: 45 }, // G: [14-18]
      { key: "O" as const, start: 19, end: 24, base: 60 }, // O: [19-23]
    ];

    for (const column of columns) {
      const hexChars = code.substring(column.start, column.end);

      for (const hexChar of hexChars) {
        const hexValue = parseInt(hexChar, 16);

        if (isNaN(hexValue) || hexValue < 1 || hexValue > 15) {
          return null; // Valor hex inválido (deve ser 1-F)
        }

        // Converter para número (hex + base)
        const number = hexValue + column.base;

        // Validar range (1-75)
        if (number < 1 || number > 75) {
          return null;
        }

        // Verificar duplicatas
        if (allNumbers.includes(number)) {
          return null;
        }

        numbers[column.key].push(number);
        allNumbers.push(number);
      }
    }

    // Deve ter exatamente 24 números
    if (allNumbers.length !== 24) {
      return null;
    }

    // Validar contagem por coluna
    if (
      numbers.B.length !== 5 ||
      numbers.I.length !== 5 ||
      numbers.N.length !== 4 || // N tem 4 + FREE
      numbers.G.length !== 5 ||
      numbers.O.length !== 5
    ) {
      return null;
    }

    // Criar grid 5x5
    const grid = createGrid75(numbers);

    return {
      mode: "75",
      code,
      numbers,
      grid,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Cria o grid 5x5 para Bingo 75 bolas
 * Distribui os 24 números + FREE space no centro
 */
function createGrid75(numbers: {
  B: number[];
  I: number[];
  N: number[];
  G: number[];
  O: number[];
}): (number | null)[][] {
  const grid: (number | null)[][] = Array(5)
    .fill(null)
    .map(() => Array(5).fill(null));

  // Coluna B (col 0)
  for (let row = 0; row < 5; row++) {
    grid[row][0] = numbers.B[row];
  }

  // Coluna I (col 1)
  for (let row = 0; row < 5; row++) {
    grid[row][1] = numbers.I[row];
  }

  // Coluna N (col 2) - apenas 4 números, centro é FREE
  for (let row = 0; row < 4; row++) {
    const actualRow = row < 2 ? row : row + 1; // Pular centro (row 2)
    grid[actualRow][2] = numbers.N[row];
  }
  grid[2][2] = null; // FREE space

  // Coluna G (col 3)
  for (let row = 0; row < 5; row++) {
    grid[row][3] = numbers.G[row];
  }

  // Coluna O (col 4)
  for (let row = 0; row < 5; row++) {
    grid[row][4] = numbers.O[row];
  }

  return grid;
}

/**
 * Decodifica um código de cartela (detecta automaticamente a modalidade)
 *
 * @param code - Código da cartela
 * @returns Cartela decodificada ou null se inválido
 */
export function decodeCard(code: string): BingoCard75 | BingoCard90 | null {
  // Detectar modalidade pelo formato
  if (code.includes("+")) {
    // Bingo 90 bolas (tem separador "+")
    return decode90(code);
  } else if (code.length === 24) {
    // Bingo 75 bolas (24 caracteres hex)
    return decode75(code);
  }

  return null;
}
