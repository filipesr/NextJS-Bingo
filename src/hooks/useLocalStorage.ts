"use client";

import { useState, useEffect } from "react";

/**
 * Hook customizado para usar localStorage com React
 *
 * @param key - Chave do localStorage
 * @param initialValue - Valor inicial se não encontrado no localStorage
 * @returns [value, setValue] - Tupla com valor e função para atualizar
 *
 * @example
 * const [name, setName] = useLocalStorage<string>("name", "");
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // Estado para armazenar o valor
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Carregar valor inicial do localStorage
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Erro ao carregar ${key} do localStorage:`, error);
    }
  }, [key]);

  // Função para atualizar o valor
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permitir que value seja uma função para seguir o padrão do useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      // Salvar no state
      setStoredValue(valueToStore);

      // Salvar no localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Erro ao salvar ${key} no localStorage:`, error);
    }
  };

  return [storedValue, setValue];
}
