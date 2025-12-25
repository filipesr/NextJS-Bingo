/**
 * Utilitários gerais para o jogo de Bingo
 */

/**
 * Retorna o número com prefixo B-I-N-G-O para Bingo 75 bolas
 * B: 1-15, I: 16-30, N: 31-45, G: 46-60, O: 61-75
 *
 * @param number - Número do bingo (1-75)
 * @returns String no formato "B-1", "I-17", etc.
 */
export function getNumberWithLetter(number: number): string {
  if (number >= 1 && number <= 15) return `B-${number}`;
  if (number >= 16 && number <= 30) return `I-${number}`;
  if (number >= 31 && number <= 45) return `N-${number}`;
  if (number >= 46 && number <= 60) return `G-${number}`;
  if (number >= 61 && number <= 75) return `O-${number}`;

  // Fallback para números fora do range 1-75
  return String(number);
}

/**
 * Extrai apenas a letra do prefixo B-I-N-G-O
 *
 * @param number - Número do bingo (1-75)
 * @returns Letra "B", "I", "N", "G" ou "O"
 */
export function getBingoLetter(number: number): string {
  if (number >= 1 && number <= 15) return "B";
  if (number >= 16 && number <= 30) return "I";
  if (number >= 31 && number <= 45) return "N";
  if (number >= 46 && number <= 60) return "G";
  if (number >= 61 && number <= 75) return "O";

  return "";
}
