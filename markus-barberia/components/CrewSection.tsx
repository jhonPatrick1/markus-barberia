"use client";

import { useState } from "react";

// 👇 Base de datos de Barberos AMPLADA con reseñas y portafolio
const barbersData = [
  { 
    name: "Markus", 
    role: "Fundador / Maestro", 
    img: "/Marcos.jpg", 
    location: "Ambas",
    rating: 5.0,
    reviews: 124,
    bio: "Con más de 10 años de experiencia, Markus es el visionario detrás de la marca. Especialista en visagismo y cortes de alta gama.",
    portfolio: [
      "https://images.unsplash.com/photo-1621570273822-793502698651?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1532715088550-62f09305f765?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519014816548-bf5fe059e98b?q=80&w=2000&auto=format&fit=crop"
    ]
  },
  { 
    name: "Sebastián", 
    role: "Fade Specialist", 
    img: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=1976&auto=format&fit=crop", 
    location: "Pueblo Libre",
    rating: 4.9,
    reviews: 89,
    bio: "El rey de los degradados. Sebastián tiene una precisión milimétrica con la máquina para lograr transiciones perfectas.",
    portfolio: [
      "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2000&auto=format&fit=crop"
    ]
  },
  { 
    name: "Yeampier", 
    role: "Urban Style", 
    img: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=1974&auto=format&fit=crop", 
    location: "Cercado de Lima",
    rating: 4.8,
    reviews: 76,
    bio: "Tendencias, freestyle y diseños urbanos. Si buscas un look moderno y atrevido, Yeampier es tu especialista.",
    portfolio: [
      "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512864084360-7c0c4d0a0845?q=80&w=2000&auto=format&fit=crop"
    ]
  },
  { 
    name: "Jesús", 
    role: "Cortes Clásicos", 
    img: "https://images.unsplash.com/photo-1512864084360-7c0c4d0a0845?q=80&w=2070&auto=format&fit=crop", 
    location: "Pueblo Libre",
    rating: 4.9,
    reviews: 112,
    bio: "Dominio absoluto de la tijera. Jesús se especializa en estilos atemporales, arreglos de barba tradicionales y toalla caliente.",
    portfolio: [
      "https://images.unsplash.com/photo-1512864084360-7c0c4d0a0845?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1621570273822-793502698651?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1532715088550-62f09305f765?q=80&w=2000&auto=format&fit=crop"
    ]
  },
  { 
    name: "Leo", 
    role: "Barbería Clásica", 
    img: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=1974&auto=format&fit=crop", 
    location: "Cercado de Lima",
    rating: 4.8,
    reviews: 65,
    bio: "Experto en texturas y cuidado facial. Leo transforma un simple corte en una experiencia de relajación completa.",
    portfolio: [
      "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2000&auto=format&fit=crop"
    ]
  },
  {
    name: "Jeremias",
    role: "Ondulación",
    img: "/integrante1.jpg",
    location: "Magdalena del Mar",
    rating: 4.8,
    reviews: 80,
    bio: "Experto en hacer ondulación permanente",
    portfolio: [
      "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2000&auto=format&fit=crop"
    ]
  },
  {
    name: "Alexander",
    role: "Cortes clasicos",
    img: "/integrante2.jpg",
    location: "Magdalena del Mar",
    rating: 4.8,
    reviews: 80,
    bio: "Experto en hacer cortes clasicos con tijeras",
    portfolio: [
      "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2000&auto=format&fit=crop"
    ]
  },
  {
    name: "Piero",
    role: "Cortes con degradados",
    img: "/integrante3.jpg",
    location: "Magdalena del Mar",
    rating: 4.8,
    reviews: 80,
    bio: "Experto en hacer cortes con degradados",
    portfolio: [
      "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2000&auto=format&fit=crop"
    ]
  },



];

export default function CrewSection({ sedesDB, isLoadingSedes, onOpenReservations }: {
  sedesDB: any[];
  isLoadingSedes: boolean;
  onOpenReservations: (data?: { sede?: any; barbero?: any }) => void;
}) {
  const [activeLocation, setActiveLocation] = useState("Pueblo Libre");
  // 👇 Estado para controlar el Modal del Perfil del Barbero
  const [selectedBarber, setSelectedBarber] = useState<any | null>(null);

  const filteredBarbers = barbersData.filter(
    (barber) => barber.location === activeLocation || barber.location === "Ambas"
  );

  const gridColsClass = filteredBarbers.length === 3 ? "md:grid-cols-3" : "md:grid-cols-4";
  const maxWidthClass = filteredBarbers.length === 3 ? "max-w-4xl" : "max-w-6xl";

  const handleLocationButtonClick = () => {
    if (!sedesDB) {
      onOpenReservations();
      return;
    }
    const sedeDestino = sedesDB.find(s => s.nombre === activeLocation);
    if (sedeDestino) {
      onOpenReservations({ sede: sedeDestino });
    } else {
      onOpenReservations();
    }
  };

  // Función para reservar desde el perfil del barbero
  const handleBookFromProfile = (barber: any) => {
    setSelectedBarber(null); // Cerramos el perfil
    
    if (!sedesDB) {
      onOpenReservations();
      return;
    }
    
    // Le asignamos la sede actual si trabaja en "Ambas", o su sede fija
    const locationName = barber.location === "Ambas" ? activeLocation : barber.location;
    const sedeDestino = sedesDB.find(s => s.nombre === locationName);
    
    if (sedeDestino) {
      onOpenReservations({ sede: sedeDestino, barbero: { nombre: barber.name } });
    } else {
      onOpenReservations();
    }
  };

  return (
    <section id="crew" className="py-16 md:py-20 px-8 bg-[#161616] border-t border-stone-800 relative">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="font-serif text-5xl md:text-7xl font-bold text-[#e0e0e0] mb-4 tracking-tighter uppercase">
            TEAM MARKUS
          </h2>
          <p className="text-stone-400 font-light text-sm md:text-base max-w-2xl mx-auto">
            No es solo un corte, es quién te lo hace. Haz clic en nuestros expertos para conocer su trabajo.
          </p>
        </div>

        <div className="flex justify-center gap-6 mb-20" data-aos="fade-up" data-aos-delay="100">
          {["Pueblo Libre", "Cercado de Lima", "Magdalena del Mar"].map((sede) => (
            <button
              key={sede}
              onClick={() => setActiveLocation(sede)}
              className={`text-xs md:text-sm uppercase tracking-widest pb-2 border-b-2 transition-colors duration-300 ${
                activeLocation === sede
                  ? "border-[#B07D54] text-[#B07D54] font-bold"
                  : "border-transparent text-stone-500 hover:text-stone-300"
              }`}
            >
              {sede}
            </button>
          ))}
        </div>

        {isLoadingSedes ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#B07D54]"></div>
          </div>
        ) : (
          <div className={`grid grid-cols-2 ${gridColsClass} gap-x-8 gap-y-16 items-start mx-auto ${maxWidthClass}`}>
            {filteredBarbers.map((barber, index) => (
              <div 
                key={barber.name} 
                onClick={() => setSelectedBarber(barber)} // Abre el perfil en lugar de reservar directo
                className={`group flex flex-col cursor-pointer ${index % 2 !== 0 ? 'md:mt-16' : ''}`}
                data-aos="fade-up"
                data-aos-delay={index * 150}
              >
                <div className="w-full aspect-[4/5] overflow-hidden rounded-2xl mb-6 bg-transparent relative">
                  <img 
                    src={barber.img} 
                    alt={barber.name}
                    className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition duration-700 ease-in-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="border border-white text-white text-xs tracking-widest uppercase px-6 py-2 rounded-full backdrop-blur-sm">Ver Perfil</span>
                  </div>
                </div>
                
                <div className="text-left w-full pl-2">
                  <h3 className="text-[#e0e0e0] font-sans font-medium text-xl md:text-2xl uppercase tracking-widest group-hover:text-white transition-colors flex items-center gap-2">
                    {barber.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-[#B07D54] text-xs md:text-sm capitalize font-normal opacity-90">
                      {barber.role}
                    </p>
                    <span className="text-stone-600 text-xs">•</span>
                    <div className="flex items-center text-amber-400 text-xs">
                       ★ {barber.rating}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 text-center" data-aos="fade-up" data-aos-delay="200">
           <button 
             onClick={handleLocationButtonClick} 
             className="px-8 py-3 rounded-full border border-[#B07D54] text-[#B07D54] hover:bg-[#B07D54] hover:text-[#161616] transition-colors duration-300 text-sm tracking-widest uppercase font-medium"
           >
             Reserva general en {activeLocation}
           </button>
        </div>
      </div>

      {/* 👇 MODAL DEL PERFIL DEL BARBERO */}
      {selectedBarber && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 font-sans">
          <div onClick={() => setSelectedBarber(null)} className="absolute inset-0 bg-black/90 backdrop-blur-sm transition-opacity cursor-pointer"></div>
          
          <div className="relative bg-[#101010] w-full max-w-2xl rounded-2xl border border-stone-800 shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
            <button aria-label="Cerrar perfil" onClick={() => setSelectedBarber(null)} className="absolute top-4 right-4 z-10 bg-black/50. text-stone-300 hover:text-white p-2 rounded-full backdrop-blur-md transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>

            <div className="overflow-y-auto custom-scrollbar flex-1">
              {/* Cabecera del Perfil */}
              <div className="flex flex-col md:flex-row gap-6 p-8 border-b border-stone-800">
                <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-2xl overflow-hidden relative">
                  <img src={selectedBarber.img} alt={selectedBarber.name} className="object-cover w-full h-full" />
                </div>
                <div className="flex flex-col justify-center">
                  <h2 className="font-serif text-3xl md:text-4xl text-white uppercase tracking-wider mb-1">{selectedBarber.name}</h2>
                  <p className="text-[#B07D54] tracking-widest text-xs uppercase mb-4">{selectedBarber.role}</p>
                  <div className="flex items-center gap-4 mb-4 text-sm text-stone-300">
                    <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20">
                      <span>★</span> {selectedBarber.rating}
                    </div>
                    <span className="text-stone-500">({selectedBarber.reviews} reseñas)</span>
                  </div>
                  <p className="text-stone-400 font-light text-sm leading-relaxed max-w-md">
                    {selectedBarber.bio}
                  </p>
                </div>
              </div>

              {/* Mini Portafolio */}
              <div className="p-8 bg-[#161616]">
                <h3 className="text-[10px] uppercase tracking-widest text-stone-500 mb-6 font-bold">Trabajos Recientes</h3>
                <div className="grid grid-cols-3 gap-3 md:gap-4">
                  {selectedBarber.portfolio.map((imgUrl: string, idx: number) => (
                    <div key={idx} className="aspect-square rounded-xl overflow-hidden bg-stone-900 relative">
                      <img src={imgUrl} className="object-cover w-full h-full hover:scale-110 transition-transform duration-500" alt={`Trabajo de ${selectedBarber.name}`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer con Botón de Reserva */}
            <div className="p-6 border-t border-stone-800 bg-[#101010] flex justify-end shrink-0">
              <button 
                onClick={() => handleBookFromProfile(selectedBarber)}
                className="w-full md:w-auto bg-[#B07D54] text-[#161616] px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-[#c48e62] transition-colors shadow-lg"
              >
                Reservar con {selectedBarber.name}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}