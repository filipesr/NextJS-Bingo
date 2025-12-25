/**
 * Apelidos e chamadas de números do Bingo
 * Apenas chamadas autênticas tradicionais brasileiras + personalizadas pelo usuário
 * Total: 20 chamadas únicas
 */

// Chamadas de bingo (autênticas + personalizadas)
const BINGO_CALLS: Record<number, string> = {
  // === CHAMADAS AUTÊNTICAS TRADICIONAIS DO BINGO BRASILEIRO ===
  1: "Começou o jogo",
  5: "Cachorro",
  9: "Pingo no pé",
  10: "Craque de bola",
  11: "Dois pauzinhos",
  16: "O leão está solto",
  17: "O bicho que pula",
  22: "Dois patinhos na lagoa",
  24: "Veado",
  31: "Réveillon",
  33: "Idade de Cristo",
  38: "Justiça de Goiás",
  45: "Primeiro tempo",
  51: "Boa ideia",
  66: "Meia meia",

  // === CHAMADAS PERSONALIZADAS (não tradicionais) ===
  13: "9 dedos",
  25: "Aniversário de Jesus",
  29: "Fevereiro bissexto",
  64: "Regime Militar",

  // === CONDICIONAIS (dependem do modo) ===
  75: "Terminou o jogo", // Apenas modo 75
  90: "Terminou o jogo", // Apenas modo 90
};

/**
 * Retorna o apelido/chamada de um número do Bingo
 * Apenas chamadas autênticas tradicionais + personalizadas
 *
 * @param number - Número do bingo (1-90)
 * @param mode - Modalidade do jogo (opcional, necessário para números 75/90)
 * @returns Apelido do número ou undefined se não existir
 */
export function getNumberCall(number: number, mode?: "75" | "90"): string | undefined {
  // Lógica condicional para "Terminou o jogo"
  if (number === 75 && mode === "75") {
    return "Terminou o jogo";
  }
  if (number === 90 && mode === "90") {
    return "Terminou o jogo";
  }

  // Para outros números, retornar da tabela
  // Mas 75/90 só aparecem se for a modalidade correta
  if ((number === 75 && mode === "90") || (number === 90 && mode === "75")) {
    return BINGO_CALLS[number]; // Retorna a chamada normal se existir
  }

  return BINGO_CALLS[number];
}

/**
 * Verifica se um número tem apelido cadastrado
 */
export function hasNumberCall(number: number, mode?: "75" | "90"): boolean {
  return !!getNumberCall(number, mode);
}
