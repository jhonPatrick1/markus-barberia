"use client";

import { useEffect } from "react";

export default function SecurityShield() {
  useEffect(() => {
    // 1. Bloquear el menú contextual (Clic derecho)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // 2. Bloquear atajos de teclado para DevTools
    const handleKeyDown = (e: KeyboardEvent) => {
      // 👇 SOLUCIÓN AQUÍ: Si e.key no existe (suele pasar en celulares), salimos de la función sin hacer nada.
      if (!e.key) return; 

      const isCtrl = e.ctrlKey || e.metaKey;
      const key = e.key.toLowerCase();

      if (
        e.key === "F12" || // F12
        (isCtrl && e.shiftKey && key === "i") || // Ctrl + Shift + I (Inspeccionar)
        (isCtrl && e.shiftKey && key === "j") || // Ctrl + Shift + J (Consola)
        (isCtrl && e.shiftKey && key === "c") || // Ctrl + Shift + C (Selector)
        (isCtrl && key === "u") // Ctrl + U (Ver código fuente)
      ) {
        e.preventDefault();
      }
    };

    // Activar el escudo
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    // Apagar el escudo
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return null;
}