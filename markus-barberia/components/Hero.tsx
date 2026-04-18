"use client";

import Image from "next/image";
import { motion, Variants } from "framer-motion";

export default function HeroSection({ onOpenReservations }: { onOpenReservations: () => void }) {
  // =========================================
  // CONFIGURACIÓN DE ANIMACIONES (Framer Motion)
  // =========================================
  
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, 
        delayChildren: 0.3,   
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: [0.16, 1, 0.3, 1], 
      },
    },
  };

  return (
    <section id="inicio" className="relative w-full min-h-[100svh] flex items-center justify-center bg-[#101010] overflow-hidden">
      
      {/* FONDO FOTOGRÁFICO Y OVERLAY */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/fondo1.png" 
          alt="Markus Barbería Premium"
          fill
          priority
          quality={100}
          className="object-cover object-right md:object-center scale-105" 
        />
        {/* 🔥 FIX DE CONTRASTE: Velo oscuro fijo en móvil (bg-[#101010]/75) que se vuelve transparente en desktop (md:bg-transparent) */}
        <div className="absolute inset-0 bg-[#101010]/75 md:bg-transparent bg-gradient-to-t from-[#101010] via-[#101010]/80 to-transparent z-10" />
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-center h-full pt-24 pb-32 md:pt-0 md:pb-0">
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl flex flex-col gap-5 md:gap-6"
        >
          {/* Etiqueta Superior */}
          <motion.div variants={itemVariants}>
            <span className="text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase text-[#B07D54]">
              Barbería de Autor — Lima, Perú
            </span>
          </motion.div>

          {/* Título Principal */}
          <motion.h1 
            variants={itemVariants}
            className="text-5xl sm:text-6xl md:text-8xl font-serif text-white leading-[1.1]"
          >
            EL ESTÁNDAR <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-stone-500">
              MARKUS
            </span>
          </motion.h1>

          {/* Párrafo Descriptivo */}
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-stone-300 font-light max-w-xl leading-relaxed"
          >
            Redefiniendo la experiencia premium. Donde la precisión se encuentra con la vanguardia.
          </motion.p>

          {/* Botón de Acción */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center mt-4"
          >
            <button 
              onClick={onOpenReservations}
              className="w-full sm:w-auto px-10 py-4 bg-transparent border-2 border-[#B07D54] text-white text-xs tracking-widest uppercase font-bold transition-all duration-500 rounded-full hover:bg-[#B07D54] hover:shadow-[0_0_20px_rgba(176,125,84,0.4)]"
            >
              Asegurar mi silla
            </button>
          </motion.div>
          
        </motion.div>
      </div>

      {/* INDICADOR DE SCROLL */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center z-20 pointer-events-none"
      >
        <span className="text-[10px] text-stone-400 uppercase tracking-[0.3em] mb-4 font-medium">Descubre más</span>
        <div className="animate-bounce">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-stone-500">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </motion.div>
      
    </section>
  );
}