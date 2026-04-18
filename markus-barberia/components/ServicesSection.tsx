"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

// Categorías
const categories = [
  { id: "servicios", label: "Servicios" },
  { id: "combos", label: "Combos" },
  { id: "color", label: "Colorimetría" },
  { id: "permanentes", label: "Permanentes" },
  { id: "extras", label: "Extras" },
];

// Datos de servicios 
const servicesData: Record<string, Array<{ title: string; price: string; time: string; desc: string; image: string }>> = {
  servicios: [
    { title: "Corte Clásico", price: "S/ 35.00", time: "1h", desc: "Corte clásico con tijera o máquina.", image: "/CorteClasico.png" },
    { title: "Corte Degradado", price: "S/ 35.00", time: "1h", desc: "Fade moderno con navaja y precisión.", image: "/CorteDegradado.png" },
    { title: "Ritual Barba", price: "S/ 30.00", time: "45m", desc: "Perfilado, toalla caliente y aceites.", image: "/RitualBarba.png" },
    { title: "Facial Express", price: "S/ 20.00", time: "30m", desc: "Limpieza rápida y exfoliación.", image: "/FacialExpress.png" },
    { title: "Facial Premium", price: "S/ 90.00", time: "1h", desc: "Limpieza profunda, vapor y mascarilla negra.", image: "/FacialPremium.png" },
  ],
  combos: [
    { title: "Camuflaje Canas + Corte", price: "S/ 50.00", time: "1h 30m", desc: "Renueva tu look y refresca tu piel.", image: "/CamuflajeCanasCorte.png" },
    { title: "Corte + Barba", price: "S/ 60.00", time: "1h 30m", desc: "El paquete completo para renovar tu look.", image: "/CorteBarba.png" },
    { title: "Corte + Barba Facial", price: "S/ 80.00", time: "2h", desc: "Experiencia total de relajación y estilo.", image: "/CorteBarbaFacial.png" },
  ],
  color: [
    { title: "Camuflaje Canas", price: "S/ 30.00", time: "45m", desc: "Disimula las canas con un tono natural.", image: "/CamuflajeCanas.png" },
    { title: "Mechas", price: "S/ 200.00", time: "3h", desc: "Iluminación y estilo moderno.", image: "/Mechas.png" },
    { title: "Platinado", price: "S/ 250.00", time: "4h", desc: "Decoloración global para un blanco perfecto.", image: "/Platinado.png" },
  ],
  permanentes: [
    { title: "Ondulación", price: "S/ 185.00", time: "3h", desc: "Rizos definidos y con volumen.", image: "/Ondulacion.png" },
    { title: "Alisado", price: "S/ 100.00", time: "1h 30m", desc: "Cabello lacio y manejable por meses.", image: "/Alisado.png" },
  ],
  extras: [
    { title: "Cejas / Diseño", price: "S/ 20.00", time: "15m", desc: "Perfilado de cejas o líneas en el cabello.", image: "/CejasDiseno.png" },
    { title: "Hidratación", price: "S/ 35.00", time: "30m", desc: "Revitaliza tu cabello después del corte.", image: "/Hidratacion.png" },
  ]
};

export default function ServicesSection({ onOpenReservations }: { onOpenReservations: () => void }) {
  const [activeTab, setActiveTab] = useState("servicios");
  const [activeHoverImage, setActiveHoverImage] = useState(servicesData["servicios"][0].image);
  
  // Referencia para controlar el scroll de los botones
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Función para mover el scroll con las flechas
  const scrollTabs = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -250 : 250;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (servicesData[activeTab] && servicesData[activeTab].length > 0) {
      setActiveHoverImage(servicesData[activeTab][0].image);
    }
  }, [activeTab]);

  return (
    <section id="servicios" className="py-12 md:py-24 bg-[#FDFBF7] px-4 md:px-8">
      <div className="max-w-7xl mx-auto bg-[#161616] rounded-3xl md:rounded-[2rem] p-5 sm:p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row gap-6 lg:gap-20 shadow-2xl relative items-stretch">
        
        {/* =========================================
            COLUMNA IZQUIERDA
            ========================================= */}
        <div className="w-full lg:w-1/2 flex flex-col lg:pr-12 xl:pr-16 z-10 relative">
          
          <h2 className="font-serif text-4xl md:text-6xl text-white mb-6 md:mb-8 text-center lg:text-left" data-aos="fade-up">
            Nuestros Servicios
          </h2>

          {/* 🔥 TABS Y FLECHAS ALINEADAS PERFECTAMENTE 🔥 */}
          <div className="mb-8 border-b border-stone-800 pb-6" data-aos="fade-up" data-aos-delay="100">
            <div className="relative group flex items-center w-full">
              
              {/* Flecha Izquierda */}
              <button 
                aria-label="Ver opciones anteriores"
                onClick={() => scrollTabs("left")}
                className="hidden md:flex absolute left-0 w-8 h-8 bg-stone-800 border border-stone-600 rounded-full items-center justify-center text-white z-20 opacity-0 group-hover:opacity-100 hover:bg-[#B07D54] hover:border-[#B07D54] transition-all shadow-lg cursor-pointer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
              </button>

              {/* Menú Tabs */}
              <div 
                ref={scrollContainerRef}
                className="flex overflow-x-auto items-center gap-2 lg:gap-3 text-xs tracking-widest uppercase [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth relative z-10 px-2 md:px-12 w-full" 
              >
                {categories.map((cat) => (
                  <button 
                    key={cat.id}
                    onClick={() => setActiveTab(cat.id)} 
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

              {/* Flecha Derecha */}
              <button 
                aria-label="Ver más opciones"
                onClick={() => scrollTabs("right")}
                className="hidden md:flex absolute right-0 w-8 h-8 bg-stone-800 border border-stone-600 rounded-full items-center justify-center text-white z-20 opacity-0 group-hover:opacity-100 hover:bg-[#B07D54] hover:border-[#B07D54] transition-all shadow-lg cursor-pointer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
              </button>

            </div>
          </div>

          <div className="md:hidden flex items-center justify-center gap-2 text-stone-500 mb-4 animate-pulse w-full">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 8l4 4-4 4M7 16l-4-4 4-4"/></svg>
            <span className="text-[10px] font-bold uppercase tracking-widest">Desliza los servicios</span>
          </div>  

          {/* LISTA DE SERVICIOS */}
          <div key={activeTab} className="flex md:flex-col overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none gap-4 md:gap-0 pb-4 md:pb-0 scroll-px-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            {servicesData[activeTab]?.map((service, index) => (
              <div 
                key={index} 
                onClick={onOpenReservations}
                onMouseEnter={() => setActiveHoverImage(service.image)}
                className="shrink-0 w-[85%] sm:w-[60vw] md:w-full snap-center snap-always group flex flex-col md:flex-row md:items-center justify-between bg-[#1A1A1A] md:bg-transparent rounded-3xl md:rounded-none border border-stone-800 md:border-0 md:border-b md:border-stone-800 cursor-pointer hover:border-[#B07D54] md:hover:border-stone-500 transition-all duration-300 shadow-xl md:shadow-none relative overflow-hidden md:overflow-visible" 
                data-aos="fade-up" 
                data-aos-delay={index * 100}
              >
                
                <div className="relative w-full aspect-[4/3] md:hidden shrink-0">
                  <Image 
                    src={service.image} 
                    alt={service.title} 
                    fill 
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 85vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] to-transparent opacity-90" />
                </div>

                <div className="p-8 md:p-0 md:py-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-8 flex-1 z-10 relative">
                  
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8 flex-1">
                    <h3 className="font-serif text-3xl md:text-2xl text-white uppercase group-hover:text-[#B07D54] transition-colors md:w-1/2 leading-tight">
                      {service.title}
                    </h3>
                    <div className="flex flex-col text-[11px] text-stone-400 md:w-1/2">
                      <span className="text-stone-300 font-semibold mb-1 tracking-widest uppercase">{service.time} | DETALLES</span>
                      <span className="leading-relaxed normal-case tracking-normal">{service.desc}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end mt-2 md:mt-0">
                    <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-[#B07D54] mr-3"></span>
                    <span className="text-3xl font-serif text-white group-hover:text-[#B07D54] transition-colors whitespace-nowrap">
                      {service.price}
                    </span>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================
            COLUMNA DERECHA
            ========================================= */}
        <div className="hidden lg:block w-1/2 relative rounded-2xl overflow-hidden bg-stone-900 border border-stone-800" data-aos="fade-left" data-aos-delay="300">
          <div className="absolute inset-0 aspect-[3/4] h-full w-full">
            {servicesData[activeTab]?.map((srv) => (
              <Image 
                key={`desktop-img-${srv.title}`}
                src={srv.image} 
                alt={`Detalle de ${srv.title} en Markus`} 
                fill 
                sizes="50vw"
                priority={activeHoverImage === srv.image}
                className={`object-cover object-top transition-all duration-700 ease-in-out ${
                  activeHoverImage === srv.image ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 scale-105"
                }`} 
              />
            ))}
          </div>
          <div className="absolute inset-0 bg-black/10 z-20 pointer-events-none" />
        </div>

      </div>
    </section>
  );
}