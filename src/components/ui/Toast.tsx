"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
  index: number;
}

export function Toast({ toast, onClose, index }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Stagger effect based on index (though usually index is 0 for new ones if prepended, 
    // or last if appended. Here we append, so index increases)
    // Actually, just small delay is enough.
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Wait for exit animation
    setTimeout(() => onClose(toast.id), 300);
  };

  useEffect(() => {
    if (toast.duration) {
      const timer = setTimeout(handleClose, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast.duration]);

  const icons = {
    success: "✅",
    error: "❌",
    info: "ℹ️",
  };

  const bgColors = {
    success: "bg-background border-success text-foreground",
    error: "bg-background border-destructive text-foreground",
    info: "bg-background border-info text-foreground",
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border-l-4 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] transform min-w-[300px] max-w-md pointer-events-auto",
        bgColors[toast.type],
        isVisible 
          ? "translate-x-0 opacity-100 scale-100" 
          : "translate-x-full opacity-0 scale-95"
      )}
      role={toast.type === "error" ? "alert" : "status"}
    >
      <span className="text-xl" aria-hidden="true">{icons[toast.type]}</span>
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={handleClose}
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        ✕
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

export function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
  return (
    <div 
      aria-live="polite"
      aria-atomic="false"
      className="fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none"
    >
      {toasts.map((toast, index) => (
        <Toast key={toast.id} toast={toast} onClose={removeToast} index={index} />
      ))}
    </div>
  );
}
