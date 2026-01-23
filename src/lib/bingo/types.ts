/**
 * Tipos TypeScript para o jogo de Bingo
 */

// Modalidades de Bingo
export type BingoMode = "75" | "90";

// Números válidos para cada modalidade
export type BingoNumber75 = number; // 1-75
export type BingoNumber90 = number; // 1-90

// Cartela de Bingo 75 bolas (Americano)
export interface BingoCard75 {
  mode: "75";
  code: string; // Código hexadecimal de 24 caracteres
  numbers: {
    B: number[]; // 5 números (1-15)
    I: number[]; // 5 números (16-30)
    N: number[]; // 4 números (31-45) + FREE no centro
    G: number[]; // 5 números (46-60)
    O: number[]; // 5 números (61-75)
  };
  grid: (number | null)[][]; // Grid 5x5, null = FREE space
}

// Cartela de Bingo 90 bolas (Britânico)
export interface BingoCard90 {
  mode: "90";
  code: string; // Código com grupos separados por "+"
  numbers: number[][]; // 9 grupos (dezenas 0-9, 10-19, ..., 80-89)
  grid: (number | null)[][]; // Grid 9x3
}

// União dos tipos de cartela
export type BingoCard = BingoCard75 | BingoCard90;

// Estado do sorteio
export interface SortState {
  mode: BingoMode;
  drawnNumbers: number[]; // Números já sorteados
  currentNumber: number | null; // Último número sorteado
  availableNumbers: number[]; // Números disponíveis para sortear
  timestamp: number; // Timestamp da última atualização
}

// Padrões de vitória para Bingo 75
export type WinPattern75 =
  | "horizontal" // Qualquer linha horizontal
  | "vertical" // Qualquer linha vertical
  | "diagonal" // Diagonais
  | "four-corners" // Quatro cantos
  | "x-pattern" // Padrão X
  | "blackout"; // Cartela cheia

// Padrões de vitória para Bingo 90
export type WinPattern90 =
  | "one-line" // Uma linha completa
  | "two-lines" // Duas linhas completas
  | "full-house"; // Cartela cheia

// União dos padrões de vitória
export type WinPattern = WinPattern75 | WinPattern90;

// Estado de marcação da cartela
export interface CardMarking {
  code: string; // Código da cartela
  markedNumbers: number[]; // Números marcados pelo usuário
  timestamp: number; // Timestamp da última marcação
}

// Resultado de verificação de vitória
export interface WinCheck {
  hasWon: boolean;
  pattern?: WinPattern;
  winningPositions?: [number, number][]; // Posições [linha, coluna] que formam a vitória
}

// Estatísticas da cartela
export interface CardStats {
  totalNumbers: number; // Total de números na cartela
  markedNumbers: number; // Números marcados
  drawnButNotMarked: number; // Números sorteados mas não marcados
  percentage: number; // Porcentagem de progresso (0-100)
}

// Configuração do jogo
export interface GameConfig {
  mode: BingoMode;
  pattern?: WinPattern; // Padrão de vitória (opcional, usa padrão básico se não especificado)
  autoMark?: boolean; // Marcação automática (para futuras versões)
}

// Cartela rastreada na sidebar
export interface TrackedCard {
  id: string; // ID único (timestamp + random)
  ownerName: string; // Nome do dono
  cardCode: string; // Código da cartela
  mode: BingoMode; // 75 ou 90
  cardNumbers: number[]; // Números da cartela (flat array)
  addedAt: number; // Timestamp
}

// Estado do rastreador (para localStorage)
export interface CardTrackerState {
  trackedCards: TrackedCard[];
  lastUpdated: number;
}

// Status computado (runtime, não armazenado)
export interface TrackedCardStatus {
  card: TrackedCard;
  markedNumbers: number[]; // Números já sorteados
  unmarkedNumbers: number[]; // Números não sorteados
  progress: number; // Porcentagem (0-100)
  hasBingo: boolean; // Se ganhou
}

// LocalStorage keys
export const STORAGE_KEYS = {
  SORT_STATE: "bingo_sort_state",
  CARD_MARKING: "bingo_card_marking_",
  CARD_TRACKER: "bingo_card_tracker",
} as const;

// Constantes do jogo
export const GAME_CONSTANTS = {
  75: {
    MIN_NUMBER: 1,
    MAX_NUMBER: 75,
    GRID_ROWS: 5,
    GRID_COLS: 5,
    TOTAL_NUMBERS: 24, // + 1 FREE space
    COLUMNS: {
      B: { min: 1, max: 15, count: 5 },
      I: { min: 16, max: 30, count: 5 },
      N: { min: 31, max: 45, count: 4 }, // 4 + FREE
      G: { min: 46, max: 60, count: 5 },
      O: { min: 61, max: 75, count: 5 },
    },
  },
  90: {
    MIN_NUMBER: 1,
    MAX_NUMBER: 90,
    GRID_ROWS: 3,
    GRID_COLS: 9,
    TOTAL_NUMBERS: 15,
    NUMBERS_PER_ROW: 5,
    EMPTY_PER_ROW: 4,
  },
} as const;
