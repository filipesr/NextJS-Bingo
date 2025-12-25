"use client";

import { useState, type ReactNode } from "react";

interface CollapsibleProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  icon?: string;
  className?: string;
}

/**
 * Componente Collapsible reutilizável
 * Permite esconder/mostrar conteúdo para economizar espaço
 */
export function Collapsible({
  title,
  children,
  defaultOpen = false,
  icon,
  className = "",
}: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`bg-info/10 rounded-lg border-2 border-info ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-info/20 transition-colors rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-expanded={isOpen}
        aria-label={isOpen ? `Recolher ${title}` : `Expandir ${title}`}
      >
        <h3 className="font-semibold text-left">
          {icon && <span className="mr-2">{icon}</span>}
          {title}
        </h3>
        <span
          className={`text-xl transition-transform duration-200 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        >
          ▼
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pb-4 pt-2">{children}</div>
      </div>
    </div>
  );
}
