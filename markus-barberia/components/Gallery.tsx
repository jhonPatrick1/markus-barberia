"use client";

import { useState } from "react";

// Base de datos de fotos (Cámbialas por las reales cuando las tengas)
const galleryData = [
  { id: 1, src: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop", sede: "Pueblo Libre", alt: "Corte Fade" },
  { id: 2, src: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=1976&auto=format&fit=crop", sede: "Cercado de Lima", alt: "Arreglo de Barba" },
  { id: 3, src: "https://images.unsplash.com/photo-1512864084360-7c0c4d0a0845?q=80&w=2070&auto=format&fit=crop", sede: "Magdalena del Mar", alt: "Corte Clásico" },
  { id: 4, src: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=1974&auto=format&fit=crop", sede: "Cercado de Lima", alt: "Diseño Urbano" },
  { id: 5, src: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=1974&auto=format&fit=crop", sede: "Pueblo Libre", alt: "Perfilado" },
  { id: 6, src: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070&auto=format&fit=crop", sede: "Magdalena del Mar", alt: "Tijera" },
];

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState("Todas");

  // Filtramos las imágenes según el botón seleccionado
  const filteredImages = activeFilter === "Todas" 
    ? galleryData 
    : galleryData.filter(img => img.sede === activeFilter);

  const filters = ["Todas", "Pueblo Libre", "Cercado de Lima", "Magdalena del Mar"];

  return (
    // CONTENEDOR EXTERIOR: FONDO BLANCO PURO 
    <section className="py-20 md:py-24 bg-white px-4 sm:px-6 md:px-12 border-t border-stone-100">
      <div className="max-w-[1400px] mx-auto">
        
        {/* BLOQUE CENTRAL NEGRO CON BORDES REDONDEADOS */}
        {/* Estilo idéntico al 'ticket' o exhibidor de tu imagen de referencia */}
        <div 
          className="bg-[#101010] rounded-3xl p-6 sm:p-10 md:p-16 shadow-[0_15px_60px_-15px_rgba(176,125,84,0.3)] border border-stone-800"
          data-aos="fade-up"
        >
          
          {/* CABECERA (Ahora dentro del bloque negro) */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 border-b border-stone-800 pb-8 md:pb-10">
            <div>
              <h2 className="font-serif text-4xl sm:text-5xl md:text-7xl font-bold text-white tracking-tighter uppercase mb-3 md:mb-4">
                NUESTRO ARTE
              </h2>
              <p className="text-stone-400 font-light text-xs sm:text-sm md:text-base max-w-xl">
                Un vistazo a la calidad y precisión que define nuestro trabajo en cada una de nuestras sedes.
              </p>
            </div>
            {/* Link en Cobre/Blanco */}
            <a href="https://www.instagram.com/markus_barberia/" target="_blank" rel="noopener noreferrer" className="text-[#B07D54] text-[10px] md:text-xs font-bold tracking-widest uppercase hover:text-white transition-colors mt-6 md:mt-0 flex items-center gap-2 group">
              Ver más en Instagram 
              <svg className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
            </a>
          </div>

          {/* BOTONES DE FILTRO (SCROLL HORIZONTAL EN MÓVIL) */}
          {/* Ocultamos scrollbar y forzamos una fila con whitespace-nowrap */}
          <div className="flex overflow-x-auto whitespace-nowrap gap-3 mb-10 md:mb-12 pb-2 scrollbar-hide snap-x md:flex-wrap md:overflow-x-visible">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`snap-start px-5 py-2.5 rounded-full text-[10px] md:text-xs font-bold tracking-widest uppercase transition-all duration-300 border
                  ${activeFilter === filter 
                    ? 'border-[#B07D54] bg-[#B07D54]/10 text-[#B07D54] shadow-[0_0_15px_rgba(176,125,84,0.15)]' // Activo
                    : 'border-stone-800 text-stone-500 hover:border-stone-600 hover:text-white bg-[#161616]' // Inactivo
                  }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* GRILLA DE IMÁGENES (PINTEREST STYLE: 2 en móvil, 3 en tablet, 4 en PC) */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {filteredImages.map((item, index) => (
              <div 
                key={item.id} 
                className="group aspect-[4/5] sm:aspect-square overflow-hidden rounded-xl md:rounded-2xl bg-[#161616] relative cursor-pointer shadow-lg border border-stone-800 transition-all duration-500 hover:border-[#B07D54]/50"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                {/* Imagen */}
                <img 
                  src={item.src} 
                  alt={item.alt}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                
                {/* Hover: Overlay de gradiente cobre y textos */}
                {/* En móvil el gradiente siempre se ve un poco, en PC es puro hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#161616]/95 via-[#161616]/40 to-transparent opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-3 sm:p-4 md:p-6">
                  <span className="text-[#B07D54] text-[8px] sm:text-[10px] font-bold uppercase tracking-widest mb-0.5 sm:mb-1 truncate">{item.sede}</span>
                  <span className="text-white font-serif text-sm sm:text-base md:text-xl truncate">{item.alt}</span>
                </div>
              </div>
            ))}
          </div>

        </div> {/* FIN DEL BLOQUE CENTRAL NEGRO */}

      </div>
    </section>
  );
}