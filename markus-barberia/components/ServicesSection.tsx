"use client";

import { useState } from "react";
import BookingModal from "./BookingModal"; // 1. Importamos el Modal

const categories = [
  { id: "servicios", label: "Servicios" },
  { id: "combos", label: "Combos" },
  { id: "color", label: "Colorimetría" },
  { id: "permanentes", label: "Permanentes" },
  { id: "extras", label: "Extras" },
];

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

export default function ServicesSection() {
  const [activeTab, setActiveTab] = useState("servicios");
  const [isModalOpen, setIsModalOpen] = useState(false); // 2. Estado para abrir/cerrar

  return (
    <section id="servicios" className="py-24 bg-neutral-900 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Título */}
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4 uppercase">
            Nuestros Servicios
          </h2>
          <div className="w-24 h-1 bg-amber-600 mx-auto rounded-full"></div>
        </div>

        {/* Pestañas */}
        <div 
          className="flex flex-wrap justify-center gap-4 mb-12 overflow-x-auto pb-4"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-6 py-2 rounded-full font-bold text-sm tracking-wide transition-all duration-300 border ${
                activeTab === cat.id
                  ? "bg-amber-600 border-amber-600 text-white shadow-lg shadow-amber-900/50 scale-105"
                  : "bg-transparent border-white/20 text-gray-400 hover:border-amber-500 hover:text-white"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid de Tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesData[activeTab]?.map((service, index) => (
            <div 
              key={index}
              data-aos="zoom-in" 
              data-aos-delay={index * 100}
              className="bg-black border border-white/10 p-6 rounded-2xl hover:border-amber-500/50 transition duration-300 group hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-900/10 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-heading text-xl font-bold text-white">{service.title}</h3>
                  <span className="text-xs font-bold bg-neutral-800 text-gray-300 px-2 py-1 rounded border border-white/10">
                    {service.time}
                  </span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  {service.desc}
                </p>
              </div>
              
              <div className="flex justify-between items-center border-t border-white/10 pt-4 mt-auto">
                <span className="text-2xl font-bold text-amber-500">{service.price}</span>
                
                {/* 3. CONECTAMOS EL BOTÓN AL MODAL */}
                <button 
                  onClick={() => setIsModalOpen(true)} 
                  className="text-sm font-semibold text-white hover:text-amber-500 transition flex items-center gap-1 group-hover:gap-2"
                >
                  Reservar <span>→</span>
                </button>
              
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* 4. El Modal al final  */}
      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
    </section>
  );
}