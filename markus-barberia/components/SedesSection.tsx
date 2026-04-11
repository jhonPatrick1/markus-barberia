"use client";

import Link from "next/link";
import Image from "next/image";

// 👇 AQUÍ ESTÁN LAS SEDES CON SU NUEVO COPYWRITING PREMIUM 👇
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
    <section id="sedes" className="py-20 md:py-24 px-6 md:px-12 bg-[#161616] border-t border-stone-800 relative">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        <div className="text-center mb-12 md:mb-16" data-aos="fade-up">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 md:mb-6 tracking-wide uppercase leading-tight">
            Nuestros Templos de Estilo
          </h2>
          <p className="text-stone-400 font-light text-sm md:text-base max-w-2xl mx-auto tracking-wide px-4">
            Llegamos a donde estés para elevar tu imagen al siguiente nivel. Encuentra tu sede más cercana.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full">
          {sedesEstaticas.map((sede, index) => (
            <div 
              key={sede.slug} 
              className="group flex flex-col rounded-2xl overflow-hidden bg-[#1A1A1A] border border-stone-800 hover:border-[#B07D54] transition-all duration-500 shadow-lg"
              data-aos="fade-up"
              data-aos-delay={index * 150}
            >
              {/* Imagen de la Sede: Más panorámica en móvil (aspect-video) y original en PC (md:aspect-[4/3]) */}
              <div className="w-full aspect-video md:aspect-[4/3] relative overflow-hidden bg-stone-900">
                {/* 👇 COMPONENTE IMAGE BLINDADO 👇 */}
                <Image 
                  src={
                    sede.img 
                      ? (sede.img.startsWith('http') || sede.img.startsWith('/') ? sede.img : `/${sede.img}`)
                      : '/qr-default.png'
                  } 
                  alt={`Sede ${sede.nombre}`}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-[#161616]/40 to-transparent opacity-90"></div>
                {/* Título un poco más pequeño en móvil para encajar mejor */}
                <h3 className="absolute bottom-4 left-5 md:bottom-6 md:left-6 font-serif text-xl sm:text-2xl md:text-3xl text-white tracking-widest z-10">
                  {sede.nombre}
                </h3>
              </div>

              {/* Contenido y Botón: Padding reducido en móvil (p-5 en lugar de p-8) */}
              <div className="p-5 md:p-8 flex flex-col gap-4 md:gap-6 flex-1 justify-between">
                
                {/* 👇 TEXTO DINÁMICO Y ALTURA UNIFORME 👇 */}
                <p className="text-stone-400 text-xs sm:text-sm font-light leading-relaxed min-h-[60px]">
                  {sede.desc}
                </p>
                
                <Link 
                  href={`/sedes/${sede.slug}`}
                  className="w-full text-center py-3 border border-[#B07D54] text-[#B07D54] rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:bg-[#B07D54] hover:text-[#161616] transition-colors"
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