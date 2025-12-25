/**
 * Apelidos e chamadas de números do Bingo
 * Combina cultura brasileira, história, esportes e cultura popular mundial
 * Total: ~60 chamadas únicas e memoráveis
 */

// Chamadas organizadas por categoria
const BINGO_CALLS: Record<number, string> = {
  // === CHAMADAS TRADICIONAIS BRASILEIRAS ===
  1: "Começou o jogo",
  5: "Cachorro",
  9: "Pingo no pé",
  10: "Craque de bola",
  11: "Dois pauzinhos",
  16: "O leão está solto",
  17: "O bicho que pula",
  24: "Rapazinho alegre",
  38: "Justiça de Goiás",
  51: "Boa ideia",
  66: "Meia meia",

  // === CULTURA POPULAR MUNDIAL ===
  2: "Pato Donald",
  6: "Meia dúzia",
  8: "Patas da aranha",
  13: "9 dedos",
  14: "Michael Jordan",
  18: "Maioridade",
  22: "Mito",
  23: "Air Jordan",
  40: "Ali Babá",
  42: "Sentido da vida",
  48: "Quatro dúzias",
  52: "Baralho completo",
  55: "Dois patinhos", // visual
  60: "Relógio marcando",
  77: "Sorte em dobro",
  80: "Volta ao mundo",

  // === HISTÓRIA DO BRASIL ===
  7: "Independência", // 7 de setembro
  12: "Dia das Crianças", // 12 de outubro
  15: "Proclamação", // 15 de novembro
  19: "Dia do Índio", // 19 de abril
  21: "Tiradentes", // 21 de abril
  64: "Regime Militar", // 1964
  85: "Nova República", // 1985
  88: "Constituição", // 1988
  89: "Muro caiu", // Queda do Muro de Berlim + eleições Brasil 1989

  // === DATAS ESPECIAIS ===
  25: "Aniversário de Jesus", // 25 de dezembro
  29: "Fevereiro bissexto", // 29 de fevereiro
  31: "Réveillon", // 31 de dezembro
  33: "Idade de Cristo", // 33 anos

  // === COPAS DO MUNDO (ATÉ 1970) ===
  50: "Maracanazo", // Copa 1950 no Brasil
  58: "Primeiro título", // Copa 1958 Suécia
  62: "Bi-campeão", // Copa 1962 Chile
  70: "Tri-campeão", // Copa 1970 México

  // === FUTEBOL ===
  45: "Primeiro tempo", // 45 minutos

  // === HISTÓRIA MUNDIAL (SÓ AS ICÔNICAS) ===
  69: "Lua", // Chegada à Lua 1969

  // === MATEMÁTICA E CURIOSIDADES ===
  3: "Três Reis Magos",
  4: "Quatro cantos",
  20: "Vintão",
  30: "Trinta réis",
  32: "Dentes completos",
  34: "Ronaldo Fenômeno",
  36: "Três dúzias",
  37: "Febre", // temperatura corporal
  39: "Quase quarenta",
  41: "Cachaça",
  43: "Quarentão passado",
  44: "Quatro por quatro",
  46: "Meio século chegando",
  47: "Quase metade",
  49: "Fim dos quarenta",
  53: "Herbie",
  54: "Meia centena chegando",
  56: "Dois times", // 11x2 = 22 jogadores
  57: "Heinz",
  59: "Quase sessenta",
  61: "Rota 61",
  63: "Sessenta passado",
  65: "Aposentadoria",
  67: "Sessenta e sete",
  68: "Sessenta e oito",
  71: "Setenta e um",
  72: "Seis dúzias",
  73: "Setenta e três",
  74: "Setenta e quatro",
  75: "Terminou o jogo", // Condicional para modo 75
  76: "Setenta e seis",
  78: "Setenta e oito",
  79: "Setenta e nove",
  81: "Oitenta e um",
  82: "Oitenta e dois",
  83: "Oitenta e três",
  84: "Orwell", // 1984
  86: "Oitenta e seis",
  87: "Oitenta e sete",
  90: "Terminou o jogo", // Condicional para modo 90
};

/**
 * Retorna o apelido/chamada de um número do Bingo
 * Combina cultura brasileira, história, esportes e cultura popular
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
