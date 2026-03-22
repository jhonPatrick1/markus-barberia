"use client";

export default function Gallery() {
  const images = [
    // Foto 1: Primer plano corte (La que te fallaba)
    "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=800&auto=format&fit=crop",
    
    // Foto 2: Barbero trabajando
    "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=800&auto=format&fit=crop",
    
    // Foto 3: Silla clásica
    "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=800&auto=format&fit=crop",
    
    // Foto 4: Herramientas
    "https://images.unsplash.com/photo-1622296089863-eb7fc530daa8?q=80&w=800&auto=format&fit=crop",
    
    // Foto 5: Ambiente oscuro
    ,
    
  ];

  return (
    <section className="py-24 bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="flex justify-between items-end mb-12" data-aos="fade-up">
          <div>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-white uppercase tracking-tighter">
              Nuestro Arte
            </h2>
            <div className="h-1 w-20 bg-white mt-4"></div>
          </div>
          <a 
            href="https://instagram.com/markusbarberia" 
            target="_blank"
            rel="noopener noreferrer" // <--- AGREGA ESTA LÍNEA AQUÍ
            className="hidden md:flex items-center gap-2 text-gray-400 hover:text-white transition uppercase text-sm font-bold tracking-widest"
          >
            Ver más en Instagram ↗
          </a>
        </div>

        {/* Grid Estilo Mosaico */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((src, index) => (
            <div 
              key={index}
              className={`relative overflow-hidden group rounded-xl ${index === 0 || index === 3 ? 'md:col-span-2 md:row-span-2' : ''}`}
              data-aos="fade-up"
              data-aos-delay={index * 50}
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition z-10"></div>
              <img 
                src={src} 
                alt="Corte Markus" 
                className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700 ease-in-out grayscale group-hover:grayscale-0"
              />
            </div>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
            <a href="#" className="text-white border-b border-white pb-1 uppercase text-xs font-bold tracking-widest">Ir al Instagram</a>
        </div>

      </div>
    </section>
  );
}