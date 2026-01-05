"use client";

import { useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  variant?: "default" | "destructive";
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  variant = "default",
}: ModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative bg-card text-card-foreground rounded-lg border shadow-lg w-full max-w-lg p-6 animate-in fade-in zoom-in-95 duration-200"
      >
        <h2 id="modal-title" className="text-xl font-bold mb-4">
          {title}
        </h2>

        <div className="mb-6">{children}</div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {cancelLabel}
          </button>
          {onConfirm && (
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={cn(
                "px-4 py-2 rounded-md font-medium text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                variant === "destructive"
                  ? "bg-destructive hover:bg-destructive/90"
                  : "bg-primary hover:bg-primary/90"
              )}
            >
              {confirmLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
