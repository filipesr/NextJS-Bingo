/**
 * Apelidos e chamadas tradicionais de números do Bingo
 * Apenas chamadas tradicionais brasileiras confirmadas (cerca de 16 números)
 */

// Chamadas tradicionais confirmadas do Bingo brasileiro
const TRADITIONAL_CALLS: Record<number, string> = {
  1: "Começou o jogo",
  5: "Cachorro",
  9: "Pingo no pé",
  10: "Craque de bola",
  11: "Dois pauzinhos",
  16: "O leão está solto",
  17: "O bicho que pula",
  22: "Dois patinhos na lagoa",
  24: "Rapazinho alegre",
  31: "Réveillon",
  33: "Idade de Cristo",
  38: "Justiça de Goiás",
  45: "Primeiro tempo",
  51: "Boa ideia",
  66: "Meia meia",
  75: "Terminou o jogo",
};

/**
 * Retorna o apelido/chamada de um número do Bingo
 * Apenas chamadas tradicionais únicas são retornadas
 *
 * @param number - Número do bingo (1-90)
 * @returns Apelido do número ou undefined se não existir
 */
export function getNumberCall(number: number): string | undefined {
  return TRADITIONAL_CALLS[number];
}

/**
 * Verifica se um número tem apelido cadastrado
 */
export function hasNumberCall(number: number): boolean {
  return !!getNumberCall(number);
}
