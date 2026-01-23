"use client";

import { useState } from "react";
import type { BingoMode } from "@/lib/bingo/types";
import { generateRandomCard75, generateRandomCard90 } from "@/lib/bingo/generator-cards";

interface AddCardFormProps {
  onSubmit: (
    ownerName: string,
    cardCode: string
  ) => { success: boolean; error?: string };
  onCancel: () => void;
  currentMode: BingoMode;
}

/**
 * Formulario para adicionar uma nova cartela ao rastreador
 */
export function AddCardForm({
  onSubmit,
  onCancel,
  currentMode,
}: AddCardFormProps) {
  const [ownerName, setOwnerName] = useState("");
  const [cardCode, setCardCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleGenerateCard = () => {
    const card = currentMode === "75" ? generateRandomCard75() : generateRandomCard90();
    if (card) {
      setCardCode(card.code);
      setError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!ownerName.trim()) {
      setError("Nome do dono e obrigatorio");
      return;
    }

    if (!cardCode.trim()) {
      setError("Codigo da cartela e obrigatorio");
      return;
    }

    const result = onSubmit(ownerName, cardCode.trim());
    if (!result.success) {
      setError(result.error || "Erro ao adicionar cartela");
    } else {
      // Limpar apenas o codigo, mantendo o nome para adicionar multiplas cartelas
      setCardCode("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium mb-1">Nome do Dono</label>
        <input
          type="text"
          value={ownerName}
          onChange={(e) => setOwnerName(e.target.value)}
          className="w-full px-3 py-2 border-2 border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Ex: Joao Silva"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Codigo da Cartela ({currentMode} bolas)
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={cardCode}
            onChange={(e) => setCardCode(e.target.value)}
            className="flex-1 px-3 py-2 border-2 border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring font-mono text-sm"
            placeholder={
              currentMode === "75"
                ? "Ex: 1359B248AC..."
                : "Ex: 12+34+5+..."
            }
          />
          <button
            type="button"
            onClick={handleGenerateCard}
            className="bg-secondary text-secondary-foreground px-3 py-2 rounded-lg font-medium hover:bg-secondary/80 transition-colors text-sm whitespace-nowrap"
          >
            Gerar
          </button>
        </div>
      </div>

      {error && (
        <p className="text-destructive text-sm bg-destructive/10 p-2 rounded">
          {error}
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Adicionar
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-secondary text-secondary-foreground py-2 px-4 rounded-lg font-medium hover:bg-secondary/80 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
