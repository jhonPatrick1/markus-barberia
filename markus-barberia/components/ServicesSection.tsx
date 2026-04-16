"use client";

import { useState } from "react";
import Image from "next/image";

// Categorías con imágenes dinámicas
const categories = [
  { id: "servicios", label: "Servicios", image: "/navaja.png" },
  { id: "combos", label: "Combos", image: "/combos.png" },
  { id: "color", label: "Colorimetría", image: "/colorimetria.png" },
  { id: "permanentes", label: "Permanentes", image: "/textura.png" },
  { id: "extras", label: "Extras", image: "/extras.png" },
];

// Datos de servicios
const servicesData: Record<string, Array<{ title: string; price: string; time: string; desc: string }>> = {
  servicios: [
    { title: "Corte Básico", price: "S/ 35.00", time: "1h", desc: "Corte clásico con tijera o máquina." },
    { title: "Corte Degradado", price: "S/ 35.00", time: "1h", desc: "Fade moderno con navaja y precisión." },
    { title: "Ritual Barba", price: "S/ 30.00", time: "45m", desc: "Perfilado, toalla caliente y aceites." },
    { title: "Facial Express", price: "S/ 20.00", time: "30m", desc: "Limpieza rápida y exfoliación." },
    { title: "Facial Premium", price: "S/ 90.00", time: "1h", desc: "Limpieza profunda, vapor y mascarilla negra." },
  ],
  combos: [
    { title: "Camuflaje de Canas + Corte", price: "S/ 50.00", time: "1h 30m", desc: "Renueva tu look y refresca tu piel." },
    { title: "Corte + Barba", price: "S/ 60.00", time: "1h 30m", desc: "El paquete completo para renovar tu look." },
    { title: "Corte + Barba + Facial", price: "S/ 80.00", time: "2h", desc: "Experiencia total de relajación y estilo." },
  ],
  color: [
    { title: "Camuflaje de Canas", price: "S/ 30.00", time: "45m", desc: "Disimula las canas con un tono natural." },
    { title: "Mechas", price: "S/ 200.00", time: "3h", desc: "Iluminación y estilo moderno." },
    { title: "Platinado", price: "S/ 250.00", time: "4h", desc: "Decoloración global para un blanco perfecto." },
  ],
  permanentes: [
    { title: "Ondulación", price: "S/ 185.00", time: "3h", desc: "Rizos definidos y con volumen." },
    { title: "Alisado", price: "S/ 100.00", time: "1h 30m", desc: "Cabello lacio y manejable por meses." },
  ],
  extras: [
    { title: "Cejas / Diseños", price: "S/ 20.00", time: "15m", desc: "Perfilado de cejas o líneas en el cabello." },
    { title: "Hidratación Capilar", price: "S/ 35.00", time: "30m", desc: "Revitaliza tu cabello después del corte." },
  ]
};

export default function ServicesSection({ onOpenReservations }: { onOpenReservations: () => void }) {
  const [activeTab, setActiveTab] = useState("servicios");

  const activeCategory = categories.find(cat => cat.id === activeTab);
  const currentImage = activeCategory?.image || "/navaja.png";

  return (
    <section id="servicios" className="py-12 md:py-24 bg-[#FDFBF7] px-4 md:px-8">
      
      {/* Contenedor Principal: flex-col en móvil, lg:flex-row en desktop */}
      <div className="max-w-7xl mx-auto bg-[#161616] rounded-3xl md:rounded-[2rem] p-5 sm:p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row gap-6 lg:gap-20 shadow-2xl relative">
        
        <div className="flex-1 flex flex-col">
          
          {/* 1. TÍTULO ALINEADO: Centrado en móvil, Izquierda en desktop */}
          <h2 className="font-serif text-4xl md:text-6xl text-white mb-6 md:mb-8 text-center lg:text-left" data-aos="fade-up">
            Nuestros Servicios
          </h2>

          {/* 2. MENÚ TIPO PILL: Scroll horizontal en móvil sin barra visible */}
          <div 
            /* Se eliminó el uppercase y tracking del contenedor para uniformidad */
            className="flex overflow-x-auto items-center gap-2 lg:gap-3 text-xs tracking-widest uppercase mb-8 border-b border-stone-800 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" 
            data-aos="fade-up" 
            data-aos-delay="100"
          >
            {categories.map((cat) => (
              <button 
                key={cat.id}
                onClick={() => setActiveTab(cat.id)} 
                /* 👇 Reduje ligeramente el padding horizontal (px-4) para asegurar que entren todos en PC 👇 */
                className={`shrink-0 text-[10px] md:text-xs tracking-widest font-medium uppercase px-4 lg:px-5 py-2.5 rounded-full transition-all duration-300 border ${
                  activeTab === cat.id 
                    ? 'bg-[#B07D54] text-white border-[#B07D54] shadow-lg' 
                    : 'text-stone-400 bg-transparent border-white/20 hover:text-white hover:bg-stone-800/50 hover:border-white/60'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* 🔥 INDICADOR DE SCROLL (SOLO MÓVIL) CENTRADO 🔥 */}
          <div className="md:hidden flex items-center justify-center gap-2 text-stone-500 mb-4 animate-pulse w-full">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8l4 4-4 4M7 16l-4-4 4-4"/></svg>
            <span className="text-[10px] font-bold uppercase tracking-widest">Desliza los servicios</span>
          </div>  

          {/* 3. LISTA DE SERVICIOS -> CENTRADO PERFECTO EN MÓVIL */}
          {/* Usamos scroll-px-4 para que el snap-start se detenga con un margen elegante */}
          <div key={activeTab} className="flex md:flex-col overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none gap-4 md:gap-0 pb-4 md:pb-0 scroll-px-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            {servicesData[activeTab]?.map((service, index) => (
              <div 
                key={index} 
                onClick={onOpenReservations} 
                // Usamos w-[88%] y snap-center para que quede perfectamente al medio de la pantalla
                className="shrink-0 w-[88%] sm:w-[60vw] md:w-full snap-center snap-always group flex flex-col md:flex-row md:items-center justify-between p-6 md:p-0 md:py-6 bg-[#1A1A1A] md:bg-transparent rounded-2xl md:rounded-none border border-stone-800 md:border-0 md:border-b md:border-stone-800 cursor-pointer hover:border-[#B07D54] md:hover:border-stone-500 transition-colors gap-4 md:gap-0 shadow-lg md:shadow-none relative" 
                data-aos="fade-up" 
                data-aos-delay={index * 100}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8 flex-1">
                  <h3 className="font-serif text-2xl text-white uppercase group-hover:text-[#B07D54] transition-colors md:w-1/2">
                    {service.title}
                  </h3>
                  <div className="flex flex-col text-[11px] text-stone-400 md:w-1/2">
                    <span className="text-stone-300 font-semibold mb-1 tracking-widest uppercase">{service.time} | DETALLES</span>
                    <span className="leading-relaxed normal-case tracking-normal">{service.desc}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 sm:justify-end mt-2 md:mt-0">
                  <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-[#B07D54]"></span>
                  <span className="text-2xl md:text-3xl font-serif text-white group-hover:text-[#B07D54] transition-colors whitespace-nowrap">
                    {service.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* IMAGEN: Oculta en móviles, visible y estilizada en desktop */}
        <div key={activeTab} className="hidden lg:block w-[40%] relative rounded-2xl overflow-hidden" data-aos="fade-left" data-aos-delay="300">
          <Image 
            src={currentImage} 
            alt={`Detalle de servicio ${activeTab} en Markus`} 
            fill 
            className="object-cover grayscale hover:grayscale-0 transition-all duration-700 cursor-pointer" 
          />
        </div>

      </div>
    </section>
  );
}