"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Navbar({ onOpenReservations }: { onOpenReservations?: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1000, 
      once: true,     
    });

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <nav className={`fixed w-full z-50 flex justify-between items-center px-6 md:px-12 py-5 transition-all duration-500 ${scrolled ? 'bg-[#101010]/95 backdrop-blur-md border-b border-stone-800 py-4 shadow-lg' : 'bg-transparent border-transparent'}`}>
        
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-stone-300 hover:text-white transition-colors z-50"
          aria-label="Menú"
        >
          {isMobileMenuOpen ? (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>

        {/* Menú Desktop */}
        {/* Aquí también quitamos la barra diagonal (/) para que el salto sea nativo e inmediato */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex gap-10 text-[11px] font-bold tracking-[0.2em] text-stone-300 uppercase items-center">
          <Link href="#inicio" className="hover:text-white transition-colors duration-300">Inicio</Link>
          <Link href="#servicios" className="hover:text-white transition-colors duration-300">Servicios</Link>
          <Link href="#sedes" className="hover:text-white transition-colors duration-300">Sedes</Link>
        </div>

        {/* Botón Inteligente de Reserva */}
        <div className="ml-auto relative z-50">
          {onOpenReservations ? (
            <button 
              onClick={() => {
                closeMobileMenu();
                onOpenReservations();
              }}
              className="bg-transparent border border-[#B07D54] text-[#B07D54] hover:bg-[#B07D54] hover:text-[#161616] px-6 md:px-8 py-2 md:py-2.5 rounded-full font-bold transition-colors duration-300 text-[10px] md:text-xs tracking-widest uppercase"
            >
              Reservar
            </button>
          ) : (
            <Link 
              href="/"
              onClick={closeMobileMenu}
              className="bg-transparent border border-[#B07D54] text-[#B07D54] hover:bg-[#B07D54] hover:text-[#161616] px-6 md:px-8 py-2 md:py-2.5 rounded-full font-bold transition-colors duration-300 text-[10px] md:text-xs tracking-widest uppercase text-center"
            >
              Reservar
            </Link>
          )}
        </div>
      </nav>

      {/* Menú Desplegable Móvil */}
      <div 
        className={`fixed inset-0 bg-[#101010]/98 backdrop-blur-xl z-40 flex flex-col items-center justify-center transition-all duration-500 md:hidden ${
          isMobileMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'
        }`}
      >
        <div className="flex flex-col items-center gap-10">
          {/* 👇 AQUÍ ESTÁ LA MAGIA: Cambiamos href="/#ancla" por href="#ancla" 👇 */}
          <Link 
            href="#inicio" 
            onClick={closeMobileMenu} 
            className="font-serif text-3xl text-white uppercase tracking-widest hover:text-[#B07D54] transition-colors"
          >
            Inicio
          </Link>
          <Link 
            href="#servicios" 
            onClick={closeMobileMenu} 
            className="font-serif text-3xl text-white uppercase tracking-widest hover:text-[#B07D54] transition-colors"
          >
            Servicios
          </Link>
          <Link 
            href="#sedes" 
            onClick={closeMobileMenu} 
            className="font-serif text-3xl text-white uppercase tracking-widest hover:text-[#B07D54] transition-colors"
          >
            Sedes
          </Link>
          
          <div className="w-12 h-px bg-[#B07D54]/30 mt-4 mb-4"></div>
          
          <span className="text-[#B07D54] text-xs font-bold tracking-[0.3em] uppercase">
            Markus Barbería
          </span>
        </div>
      </div>
    </>
  );
}