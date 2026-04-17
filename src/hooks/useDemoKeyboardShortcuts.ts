"use client";

import { useEffect, useRef } from "react";

export function useDemoKeyboardShortcuts(handlers: {
  onReset?: () => void;
  onDemoPanel?: () => void;
}) {
  const ref = useRef(handlers);
  ref.current = handlers;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!e.shiftKey || !e.ctrlKey) return;
      if (e.key === "R" || e.key === "r") {
        e.preventDefault();
        ref.current.onReset?.();
      }
      if (e.key === "D" || e.key === "d") {
        e.preventDefault();
        ref.current.onDemoPanel?.();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}
