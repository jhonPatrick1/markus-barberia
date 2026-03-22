"use client";

import { useEffect, useState } from "react";

export default function Preloader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // El preloader desaparece a los 2 segundos (2000ms)
    const timer = setTimeout(() => {
      setShow(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center transition-opacity duration-700 opacity-100 animate-fade-out">
      <div className="text-center">
        {/* Logo animado */}
        <h1 className="font-heading text-6xl font-bold text-white tracking-tighter animate-pulse">
          MARKUS
        </h1>
        <p className="text-amber-500 text-sm font-bold tracking-[0.5em] mt-2 animate-bounce">
          LOADING
        </p>
      </div>
    </div>
  );
}