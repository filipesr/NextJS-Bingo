/**
 * Apelidos e chamadas tradicionais de números do Bingo
 * Combina chamadas tradicionais brasileiras + animais do Jogo do Bicho
 */

export interface BingoCall {
  number: number;
  call: string;
  category: "traditional" | "jogo-do-bicho" | "cultural";
}

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

// Jogo do Bicho - 25 animais (cada um representa 4 números consecutivos)
// Usado para preencher números que não têm chamada tradicional
const JOGO_DO_BICHO_ANIMALS: Record<number, string> = {
  // Avestruz (01-04)
  1: "Avestruz",
  2: "Avestruz",
  3: "Avestruz",
  4: "Avestruz",
  // Águia (05-08)
  5: "Águia",
  6: "Águia",
  7: "Águia",
  8: "Águia",
  // Burro (09-12)
  9: "Burro",
  10: "Burro",
  11: "Burro",
  12: "Burro",
  // Borboleta (13-16)
  13: "Borboleta",
  14: "Borboleta",
  15: "Borboleta",
  16: "Borboleta",
  // Cachorro (17-20)
  17: "Cachorro",
  18: "Cachorro",
  19: "Cachorro",
  20: "Cachorro",
  // Cabra (21-24)
  21: "Cabra",
  22: "Cabra",
  23: "Cabra",
  24: "Cabra",
  // Carneiro (25-28)
  25: "Carneiro",
  26: "Carneiro",
  27: "Carneiro",
  28: "Carneiro",
  // Camelo (29-32)
  29: "Camelo",
  30: "Camelo",
  31: "Camelo",
  32: "Camelo",
  // Cobra (33-36)
  33: "Cobra",
  34: "Cobra",
  35: "Cobra",
  36: "Cobra",
  // Coelho (37-40)
  37: "Coelho",
  38: "Coelho",
  39: "Coelho",
  40: "Coelho",
  // Cavalo (41-44)
  41: "Cavalo",
  42: "Cavalo",
  43: "Cavalo",
  44: "Cavalo",
  // Elefante (45-48)
  45: "Elefante",
  46: "Elefante",
  47: "Elefante",
  48: "Elefante",
  // Galo (49-52)
  49: "Galo",
  50: "Galo",
  51: "Galo",
  52: "Galo",
  // Gato (53-56)
  53: "Gato",
  54: "Gato",
  55: "Gato",
  56: "Gato",
  // Jacaré (57-60)
  57: "Jacaré",
  58: "Jacaré",
  59: "Jacaré",
  60: "Jacaré",
  // Leão (61-64)
  61: "Leão",
  62: "Leão",
  63: "Leão",
  64: "Leão",
  // Macaco (65-68)
  65: "Macaco",
  66: "Macaco",
  67: "Macaco",
  68: "Macaco",
  // Porco (69-72)
  69: "Porco",
  70: "Porco",
  71: "Porco",
  72: "Porco",
  // Pavão (73-76)
  73: "Pavão",
  74: "Pavão",
  75: "Pavão",
  76: "Pavão",
  // Peru (77-80)
  77: "Peru",
  78: "Peru",
  79: "Peru",
  80: "Peru",
  // Touro (81-84)
  81: "Touro",
  82: "Touro",
  83: "Touro",
  84: "Touro",
  // Tigre (85-88)
  85: "Tigre",
  86: "Tigre",
  87: "Tigre",
  88: "Tigre",
  // Urso (89-92)
  89: "Urso",
  90: "Urso",
};

/**
 * Retorna o apelido/chamada de um número do Bingo
 * Prioridade: chamada tradicional > animal do Jogo do Bicho
 *
 * @param number - Número do bingo (1-90)
 * @returns Apelido do número ou undefined se não existir
 */
export function getNumberCall(number: number): string | undefined {
  // Prioridade 1: Chamadas tradicionais específicas
  if (TRADITIONAL_CALLS[number]) {
    return TRADITIONAL_CALLS[number];
  }

  // Prioridade 2: Animal do Jogo do Bicho
  if (JOGO_DO_BICHO_ANIMALS[number]) {
    return JOGO_DO_BICHO_ANIMALS[number];
  }

  return undefined;
}

/**
 * Verifica se um número tem apelido cadastrado
 */
export function hasNumberCall(number: number): boolean {
  return !!getNumberCall(number);
}
