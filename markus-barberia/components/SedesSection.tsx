"use client";

import Link from "next/link";
import Image from "next/image";

// Sedes con el copywriting premium y rutas blindadas
const sedesEstaticas = [
  { 
    slug: "cercado-de-lima", 
    nombre: "Cercado de Lima", 
    img: "/cercado.png",
    desc: "Tradición y estilo en el corazón de la ciudad. El verdadero estándar premium donde inició nuestra leyenda."
  },
  { 
    slug: "pueblo-libre", 
    nombre: "Pueblo Libre", 
    img: "/pueblo.png",
    desc: "Elegancia y confort en un ambiente exclusivo. Tu escape perfecto para desconectar y renovar tu imagen."
  },
  { 
    slug: "magdalena-del-mar", 
    nombre: "Magdalena del Mar", 
    img: "/magdalena.png",
    desc: "Vanguardia y sofisticación. Instalaciones de primer nivel diseñadas para el hombre moderno y exigente."
  }
];

export default function SedesSection() {
  return (
    <section id="sedes" className="py-20 md:py-24 px-6 md:px-12 bg-[#161616] border-t border-stone-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Cabecera Responsiva */}
        <div className="text-center mb-10 md:mb-16" data-aos="fade-up">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 md:mb-6 tracking-wide uppercase leading-tight">
            Nuestros Templos de Estilo
          </h2>
          <p className="text-stone-400 font-light text-sm md:text-base max-w-2xl mx-auto tracking-wide px-4">
            Llegamos a donde estés para elevar tu imagen al siguiente nivel. Encuentra tu sede más cercana.
          </p>
        </div>

        {/* 🔥 INDICADOR DE SCROLL (SOLO MÓVIL) 🔥 */}
        <div className="md:hidden flex items-center justify-center w-full gap-2 text-[#B07D54] mb-8 animate-pulse">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 8l4 4-4 4M7 16l-4-4 4-4"/>
          </svg>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Desliza para explorar sedes</span>
        </div>

        {/* CONTENEDOR SEDES -> CARRUSEL EN MÓVIL / GRILLA EN PC */}
        {/* -mx-6 y px-6 permiten que el scroll llegue al borde de la pantalla en móvil */}
        <div className="flex md:grid overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none gap-6 md:gap-8 md:grid-cols-3 w-full pb-8 md:pb-0 -mx-6 px-6 md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          {sedesEstaticas.map((sede, index) => (
            <div 
              key={sede.slug} 
              // w-[85vw] permite que asome la siguiente tarjeta, invitando al scroll
              // snap-always obliga a frenar tarjeta por tarjeta
              className="shrink-0 w-[85vw] sm:w-[60vw] md:w-auto snap-start snap-always group flex flex-col rounded-2xl overflow-hidden bg-[#1A1A1A] border border-stone-800 hover:border-[#B07D54] transition-all duration-500 shadow-xl"
              data-aos="fade-up"
              data-aos-delay={index * 150}
            >
              {/* Imagen de la Sede con Efecto Grayscale */}
              <div className="w-full aspect-video md:aspect-[4/3] relative overflow-hidden bg-stone-900">
                <Image 
                  src={sede.img ? (sede.img.startsWith('http') || sede.img.startsWith('/') ? sede.img : `/${sede.img}`) : '/qr-default.png'} 
                  alt={`Sede ${sede.nombre}`}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                />
                {/* Overlay oscuro para legibilidad del título */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-[#161616]/20 to-transparent opacity-90"></div>
                <h3 className="absolute bottom-4 left-5 md:bottom-6 md:left-6 font-serif text-2xl md:text-3xl text-white tracking-widest z-10 uppercase">
                  {sede.nombre}
                </h3>
              </div>

              {/* Información y Acción */}
              <div className="p-6 md:p-8 flex flex-col gap-5 md:gap-6 flex-1 justify-between">
                <p className="text-stone-400 text-sm font-light leading-relaxed min-h-[60px]">
                  {sede.desc}
                </p>
                <Link 
                  href={`/sedes/${sede.slug}`}
                  className="w-full text-center py-4 border border-[#B07D54] text-[#B07D54] rounded-full text-[11px] md:text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#B07D54] hover:text-[#161616] transition-colors"
                >
                  Explorar Sede
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}