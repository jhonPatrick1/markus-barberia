"use client"; // Esto permite que el botón funcione

import { useState } from "react";
import BookingModal from "./BookingModal";

export default function Hero() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <section className="relative h-screen flex flex-col justify-center items-center text-center px-4 overflow-hidden">
        
        {/* 1. VIDEO DE FONDO */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/60 z-10"></div>
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover opacity-50"
          >
            <source src="https://cdn.coverr.co/videos/coverr-barber-cutting-hair-5364/1080p.mp4" type="video/mp4" />
          </video>
        </div>

        {/* 2. CONTENIDO DE IMPACTO */}
        <div className="relative z-20 max-w-5xl space-y-8" data-aos="fade-up" data-aos-duration="1500">
          
          <h1 className="font-heading text-[15vw] md:text-[12rem] font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 opacity-90 select-none">
            MARKUS
          </h1>

          <p className="text-gray-300 text-lg md:text-xl tracking-[0.2em] uppercase font-light">
            Pueblo Libre &bull; Cercado de Lima
          </p>
          
          {/* 3. BOTÓN QUE ABRE EL MODAL */}
          <div className="pt-8">
            <button 
              onClick={() => setIsOpen(true)} 
              className="group relative px-8 py-3 bg-transparent overflow-hidden rounded-full border border-white/30 hover:border-amber-500 transition-all duration-300"
            >
              <div className="absolute inset-0 w-0 bg-amber-600 transition-all duration-[250ms] ease-out group-hover:w-full opacity-20"></div>
              <span className="relative text-white group-hover:text-amber-500 font-bold tracking-widest text-sm uppercase flex items-center gap-2">
                Reservar Experiencia
              </span>
            </button>
          </div>
        </div>

        {/* 4. INDICADOR DE SCROLL */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce z-20">
          <span className="text-white/50 text-xs uppercase tracking-widest mb-2 block">Descubre más</span>
          <svg className="w-6 h-6 text-amber-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
        </div>

      </section>

      {/* MODAL OCULTO */}
      <BookingModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
}