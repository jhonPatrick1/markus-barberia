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
    { title: "Corte + Barba", price: "S/ 60.00", time: "1h 30m", desc: "El paquete completo para renovar tu look." },
    { title: "Corte + Barba + Facial", price: "S/ 80.00", time: "2h", desc: "Experiencia total de relajación y estilo." },
  ],
  color: [
    { title: "Camuflaje de Canas", price: "S/ 30.00", time: "45m", desc: "Disimula las canas con un tono natural." },
    { title: "Mechas", price: "S/ 200.00", time: "3h", desc: "Iluminación y estilo moderno." },
    { title: "Platinado", price: "S/ 250.00", time: "4h", desc: "Decoloración global para un blanco perfecto." },
  ],
  permanentes: [
    { title: "Ondulación", price: "S/ 185.00", time: "2h", desc: "Rizos definidos y con volumen." },
    { title: "Alisado", price: "S/ 185.00", time: "2h", desc: "Cabello lacio y manejable por meses." },
  ],
  extras: [
    { title: "Cejas / Diseños", price: "S/ 10.00", time: "15m", desc: "Perfilado de cejas o líneas en el cabello." },
    { title: "Hidratación Capilar", price: "S/ 15.00", time: "20m", desc: "Revitaliza tu cabello después del corte." },
  ]
};

// 👇 ACEPTAMOS onOpenReservations COMO PROP
export default function ServicesSection({ onOpenReservations }: { onOpenReservations: () => void }) {
  const [activeTab, setActiveTab] = useState("servicios");

  const activeCategory = categories.find(cat => cat.id === activeTab);
  const currentImage = activeCategory?.image || "/navaja.png";

  return (
    <section id="servicios" className="py-24 bg-[#FDFBF7] px-4 md:px-8">
      
      <div className="max-w-7xl mx-auto bg-[#161616] rounded-[2rem] p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row gap-12 lg:gap-20 shadow-2xl overflow-hidden relative">
        
        <div className="flex-1 flex flex-col">
          <h2 className="font-serif text-4xl md:text-6xl text-white mb-8" data-aos="fade-up">
            Nuestros Servicios
          </h2>

          <div className="flex flex-wrap items-center gap-3 text-[10px] md:text-xs tracking-[0.2em] uppercase mb-8 text-stone-500 border-b border-stone-800 pb-6" data-aos="fade-up" data-aos-delay="100">
            {categories.map((cat, index) => (
              <div key={cat.id} className="flex items-center gap-3">
                <button 
                  onClick={() => setActiveTab(cat.id)} 
                  className={`transition-colors duration-300 hover:text-white ${activeTab === cat.id ? 'text-[#B07D54] font-bold' : ''}`}
                >
                  {cat.label}
                </button>
                {index < categories.length - 1 && <span className="text-stone-700">|</span>}
              </div>
            ))}
          </div>

          <div className="flex flex-col">
            {servicesData[activeTab]?.map((service, index) => (
              <div 
                key={index} 
                // 👇 REEMPLAZAMOS EL onClick VIEJO POR ESTE
                onClick={onOpenReservations} 
                className="group flex flex-col md:flex-row md:items-center justify-between py-6 border-b border-stone-800 cursor-pointer hover:border-stone-500 transition-colors" 
                data-aos="fade-up" 
                data-aos-delay={index * 100}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8 flex-1">
                  <h3 className="font-serif text-xl md:text-2xl text-white uppercase group-hover:text-[#B07D54] transition-colors md:w-1/2">
                    {service.title}
                  </h3>
                  <div className="flex flex-col text-[9px] md:text-[10px] text-stone-400 uppercase tracking-widest md:w-1/2">
                    <span className="text-stone-300 font-semibold mb-1">{service.time} | DETALLES</span>
                    <span className="leading-relaxed">{service.desc}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 mt-4 md:mt-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B07D54]"></span>
                  <span className="text-xl md:text-3xl font-serif text-white group-hover:text-[#B07D54] transition-colors">
                    {service.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div key={activeTab} className="hidden lg:block w-[35%] relative rounded-2xl overflow-hidden" data-aos="fade-left" data-aos-delay="300">
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