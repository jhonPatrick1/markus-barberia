"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AOS from "aos";
import "aos/dist/aos.css";

// 👇 ACEPTAMOS onOpenReservations y quitamos el estado isModalOpen local
export default function Navbar({ onOpenReservations }: { onOpenReservations: () => void }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1000, 
      once: true,     
    });

    // Pequeño truco UI: Detectar scroll para cambiar el fondo del Navbar
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    // 👇 Navbar transparente arriba, oscuro al hacer scroll
    <nav className={`fixed w-full z-50 flex justify-between items-center px-6 md:px-12 py-5 transition-all duration-500 ${scrolled ? 'bg-[#101010]/95 backdrop-blur-md border-b border-stone-800 py-4 shadow-lg' : 'bg-transparent border-transparent'}`}>
      
      {/* Logo MARKUS */}
      <Link href="/" className="font-serif text-3xl font-bold tracking-widest text-white hover:text-[#B07D54] transition-colors duration-300">
        MARKUS
      </Link>

      {/* Menú Desktop */}
      <div className="hidden md:flex gap-10 text-[11px] font-bold tracking-[0.2em] text-stone-300 uppercase">
        <a href="#" className="hover:text-white transition-colors duration-300">Inicio</a>
        <a href="#servicios" className="hover:text-white transition-colors duration-300">Servicios</a>
        <a href="#crew" className="hover:text-white transition-colors duration-300">Staff</a>
        <a href="/tienda" className="text-[#B07D54] hover:text-white transition-colors duration-300">Tienda</a>
      </div>

      {/* 👇 Botón de Reserva conectado al Modal Global */}
      <button 
        onClick={onOpenReservations}
        className="bg-transparent border border-[#B07D54] text-[#B07D54] hover:bg-[#B07D54] hover:text-[#161616] px-8 py-2.5 rounded-full font-bold transition-colors duration-300 text-xs tracking-widest uppercase"
      >
        Reservar
      </button>
      
    </nav>
  );
}