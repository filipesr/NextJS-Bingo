"use client";

import { useEffect, useState, useCallback } from "react";

export function useWakeLock() {
  const [isLocked, setIsLocked] = useState(false);

  const requestWakeLock = useCallback(async () => {
    if ("wakeLock" in navigator) {
      try {
        const lock = await (navigator as any).wakeLock.request("screen");
        setIsLocked(true);
        lock.addEventListener("release", () => {
          setIsLocked(false);
        });
      } catch (err) {
        console.error(`${err} - Wake Lock request failed`);
      }
    }
  }, []);

  useEffect(() => {
    requestWakeLock();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        requestWakeLock();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [requestWakeLock]);

  return isLocked;
}
