"use client";

import { useState, useCallback, useEffect } from "react";

export function useSpeech() {
  const [isMuted, setIsMuted] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported("speechSynthesis" in window);
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!supported || isMuted || !text) return;

      // Cancel previous utterances
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "pt-BR";
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      window.speechSynthesis.speak(utterance);
    },
    [isMuted, supported]
  );

  const toggleMute = () => setIsMuted((prev) => !prev);

  return { speak, isMuted, toggleMute, supported };
}
