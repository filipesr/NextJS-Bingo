"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import type { BingoMode } from "@/lib/bingo/types";
import { useBingoSort } from "@/hooks/useBingoSort";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Collapsible } from "@/components/ui/Collapsible";
import { getNumberWithLetter } from "@/lib/bingo/utils";
import { getNumberCall } from "@/lib/bingo/calls";
import { useSpeech } from "@/hooks/useSpeech";
import { useToast } from "@/hooks/useToast";

import { Modal } from "@/components/ui/Modal";

/**
 * Página de sorteio de números do Bingo
 * Permite sortear números aleatórios para ambas modalidades (75 e 90 bolas)
 */
export default function SortPage() {
  const [mode, setMode] = useState<BingoMode>("75");
  const [sortOrder, setSortOrder] = useState<"chronological" | "numerical">("chronological");
  const { sortState, draw, reset, changeMode, hasMoreNumbers, drawnCount, totalNumbers } =
    useBingoSort(mode);

  const { speak, isMuted, toggleMute, supported: speechSupported } = useSpeech();
  const { success, info } = useToast();

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isModeModalOpen, setIsModeModalOpen] = useState(false);
  const [pendingMode, setPendingMode] = useState<BingoMode | null>(null);

  const [isRolling, setIsRolling] = useState(false);
  const [displayNumber, setDisplayNumber] = useState<number | null>(null);

  // Efeito para sincronizar o número exibido quando NÃO está rolando
  useEffect(() => {
    if (!isRolling) {
      setDisplayNumber(sortState.currentNumber);
    }
  }, [sortState.currentNumber, isRolling]);

  // Efeito para falar o número sorteado (apenas quando terminar de rolar)
  useEffect(() => {
    if (sortState.currentNumber && !isRolling) {
      const call = getNumberCall(sortState.currentNumber, mode);
      const letter = mode === "75" ? getNumberWithLetter(sortState.currentNumber).charAt(0) : "";
      
      let text = "";
      if (mode === "75") {
        text = `${letter}, ${sortState.currentNumber}`;
      } else {
        text = `${sortState.currentNumber}`;
      }
      
      if (call) {
        text += `. ${call}`;
      }
      
      speak(text);
    }
  }, [sortState.currentNumber, mode, speak, isRolling]);

  const handleResetClick = () => {
    if (sortState.drawnNumbers.length > 0) {
      setIsResetModalOpen(true);
    } else {
      performReset();
    }
  };

  const handleDraw = () => {
    if (!hasMoreNumbers || isRolling) return;

    setIsRolling(true);
    let counter = 0;
    const maxDuration = 1500; // 1.5s duration
    const intervalTime = 80; // Update every 80ms

    const interval = setInterval(() => {
      // Show random number from available range just for visual effect
      // We don't use sortState.availableNumbers here to avoid peeking logic complexity
      // Just random 1-75 or 1-90 is fine for the effect
      const max = mode === "75" ? 75 : 90;
      const randomNum = Math.floor(Math.random() * max) + 1;
      setDisplayNumber(randomNum);

      counter += intervalTime;
      if (counter >= maxDuration) {
        clearInterval(interval);
        draw(); // Actually draw the real number
        setIsRolling(false);
      }
    }, intervalTime);
  };

  const performReset = () => {
    reset();
    success("Jogo resetado com sucesso!");
  };

  const handleModeChangeClick = (newMode: BingoMode) => {
    if (newMode === mode) return;

    if (sortState.drawnNumbers.length > 0) {
      setPendingMode(newMode);
      setIsModeModalOpen(true);
    } else {
      performModeChange(newMode);
    }
  };

  const performModeChange = (newMode: BingoMode) => {
    setMode(newMode);
    changeMode(newMode);
    info(`Modo alterado para Bingo ${newMode} bolas`);
    setPendingMode(null);
  };

  // Números ordenados conforme preferência do usuário
  const displayedNumbers = useMemo(() => {
    if (sortOrder === "numerical") {
      return [...sortState.drawnNumbers].sort((a, b) => a - b);
    }
    return sortState.drawnNumbers;
  }, [sortState.drawnNumbers, sortOrder]);

  // Últimos 5 números (excluindo o atual)
  const last5Numbers = useMemo(() => {
    const history = [...sortState.drawnNumbers];
    if (history.length > 0) history.pop(); // Remove atual
    return history.slice(-5).reverse();
  }, [sortState.drawnNumbers]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <Link
              href="/"
              className="text-sm text-primary hover:underline mb-2 block"
            >
              ← Voltar para Home
            </Link>
            <h1 className="text-4xl font-bold">🎰 Sorteio de Bingo</h1>
          </div>
          <div className="flex gap-2">
            {speechSupported && (
              <button
                onClick={toggleMute}
                className={`p-2 rounded-full border-2 transition-colors ${
                  isMuted 
                    ? "bg-muted text-muted-foreground border-border" 
                    : "bg-primary text-primary-foreground border-primary"
                }`}
                title={isMuted ? "Ativar som" : "Desativar som"}
              >
                {isMuted ? "🔇" : "🔊"}
              </button>
            )}
            <ThemeToggle />
          </div>
        </header>

        {/* Seletor de modalidade */}
        <div className="mb-6 bg-card rounded-lg p-4 border-2 border-border">
          <h2 className="font-semibold mb-3">Modalidade:</h2>
          <div className="flex gap-4">
            <button
              onClick={() => handleModeChangeClick("75")}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                mode === "75"
                  ? "bg-[hsl(var(--bingo-75-header))] text-white"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              🇺🇸 Bingo 75 Bolas
            </button>
            <button
              onClick={() => handleModeChangeClick("90")}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                mode === "90"
                  ? "bg-[hsl(var(--bingo-90-header))] text-white"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              🇬🇧 Bingo 90 Bolas
            </button>
          </div>
        </div>

        {/* Display do número atual */}
        <div className="mb-6 bg-warning/20 rounded-lg p-8 border-4 border-warning shadow-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-warning/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <h2 className="text-center text-xl font-semibold mb-4 relative z-10">
            {sortState.currentNumber
              ? "Número Sorteado:"
              : "Aguardando Sorteio..."}
          </h2>
          <div className="text-center relative z-10">
            {displayNumber ? (
              <div key={displayNumber} className={isRolling ? "scale-110 transition-transform duration-75" : "animate-in zoom-in fade-in duration-300"}>
                <div className={`text-9xl font-black drop-shadow-xl tracking-tighter ${isRolling ? "text-warning-foreground/70 blur-[1px]" : "text-foreground dark:text-warning"}`}>
                  {mode === "75" && !isRolling
                    ? getNumberWithLetter(displayNumber)
                    : displayNumber}
                </div>

                {/* Apelido/chamada do número - Só mostra quando parar */}
                {!isRolling && getNumberCall(displayNumber, mode) && (
                  <div className="text-3xl mt-4 italic font-medium text-foreground/80 dark:text-warning/90">
                    &quot;{getNumberCall(displayNumber, mode)}&quot;
                  </div>
                )}
              </div>
            ) : (
              <div className="text-8xl font-bold text-muted-foreground/30">
                --
              </div>
            )}
          </div>
        </div>

        {/* Últimos 5 Números */}
        {last5Numbers.length > 0 && (
          <div className="mb-6 flex items-center justify-center gap-4 py-4 overflow-x-auto">
            <span className="text-sm font-semibold text-muted-foreground whitespace-nowrap">Últimos 5:</span>
            <div className="flex gap-2">
              {last5Numbers.map((num, i) => (
                <div 
                  key={`${num}-${i}`} 
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-secondary border-2 border-border font-bold text-sm shadow-sm"
                >
                  {num}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Controles */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={handleDraw}
            disabled={!hasMoreNumbers || isRolling}
            className="flex-1 bg-success hover:bg-success/90 disabled:bg-muted disabled:cursor-not-allowed text-success-foreground font-bold py-4 px-6 rounded-lg text-xl transition-all active:scale-95 shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {isRolling 
              ? "🎲 Sorteando..." 
              : hasMoreNumbers 
                ? "🎲 Sortear Próximo" 
                : "Sem Mais Números"}
          </button>
          <button
            onClick={handleResetClick}
            disabled={isRolling}
            className="bg-destructive hover:bg-destructive/90 disabled:opacity-50 text-destructive-foreground font-bold py-4 px-6 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shadow-md"
          >
            🔄 Resetar
          </button>
        </div>

        {/* Modals */}
        <Modal
          isOpen={isResetModalOpen}
          onClose={() => setIsResetModalOpen(false)}
          title="Resetar Jogo?"
          confirmLabel="Sim, Resetar"
          onConfirm={performReset}
          variant="destructive"
        >
          <p>
            Tem certeza que deseja resetar o jogo atual? Todo o progresso será
            perdido.
          </p>
        </Modal>

        <Modal
          isOpen={isModeModalOpen}
          onClose={() => {
            setIsModeModalOpen(false);
            setPendingMode(null);
          }}
          title="Mudar Modalidade?"
          confirmLabel="Mudar e Resetar"
          onConfirm={() => pendingMode && performModeChange(pendingMode)}
          variant="destructive"
        >
          <p>
            Trocar a modalidade irá resetar o jogo atual. Todo o progresso será
            perdido. Deseja continuar?
          </p>
        </Modal>

        {/* Progresso */}
        <div className="mb-6 bg-card rounded-lg p-4 border-2 border-border">
          <div className="flex justify-between text-sm mb-2">
            <span>Progresso:</span>
            <span className="font-semibold">
              {drawnCount}/{totalNumbers} números sorteados
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-300"
              style={{
                width: `${(drawnCount / totalNumbers) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Histórico de números sorteados */}
        <div className="bg-card rounded-lg p-6 border-2 border-border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg">
              📝 Números Sorteados ({sortState.drawnNumbers.length})
            </h2>

            {sortState.drawnNumbers.length > 0 && (
              <button
                onClick={() => setSortOrder(prev =>
                  prev === "chronological" ? "numerical" : "chronological"
                )}
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring border-2 border-border"
                aria-label="Alternar ordenação dos números"
              >
                {sortOrder === "chronological" ? (
                  <>
                    <span>⏱️</span>
                    <span className="hidden sm:inline">Ordem de chamada</span>
                  </>
                ) : (
                  <>
                    <span>🔢</span>
                    <span className="hidden sm:inline">Ordem crescente</span>
                  </>
                )}
              </button>
            )}
          </div>

          {sortState.drawnNumbers.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhum número sorteado ainda. Clique em &quot;Sortear Próximo&quot; para começar!
            </p>
          ) : (
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
              {displayedNumbers.map((num, index) => (
                <div
                  key={index}
                  className={`aspect-square flex items-center justify-center font-bold text-xs sm:text-sm rounded border-2 ${
                    num === sortState.currentNumber
                      ? "bg-warning border-warning text-warning-foreground scale-110 shadow-lg z-10"
                      : "bg-muted text-foreground border-border"
                  } transition-all duration-300`}
                >
                  {mode === "75" ? getNumberWithLetter(num) : num}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instruções */}
        <div className="mt-8">
          <Collapsible title="Como usar" icon="ℹ️" defaultOpen={false}>
            <ul className="space-y-1 text-sm">
              <li>
                1. Escolha a modalidade (75 ou 90 bolas)
              </li>
              <li>
                2. Clique em &quot;Sortear Próximo&quot; para sortear cada número
              </li>
              <li>
                3. Os números sorteados são salvos automaticamente
              </li>
              <li>
                4. Jogadores devem acessar suas cartelas usando códigos únicos (ex: /card/[código])
              </li>
              <li>
                5. Use &quot;Resetar&quot; para começar um novo jogo
              </li>
            </ul>
          </Collapsible>
        </div>
      </div>
    </main>
  );
}
