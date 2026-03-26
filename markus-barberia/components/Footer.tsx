export default function Footer() {
  return (
    <footer className="bg-[#101010] text-stone-300 border-t border-stone-900 pt-20 pb-8">
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-16">
        
        {/* Columna 1: Marca */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h2 className="font-serif text-5xl font-bold tracking-tighter text-white mb-4">MARKUS</h2>
          <p className="text-stone-500 text-sm leading-relaxed mb-8 max-w-xs font-light">
            Redefiniendo el estilo masculino en Lima. Más que un corte, una experiencia de confianza y calidad.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full border border-stone-700 flex items-center justify-center hover:border-[#B07D54] hover:text-[#B07D54] transition-colors duration-300 text-xs tracking-widest">IG</a>
            <a href="#" className="w-10 h-10 rounded-full border border-stone-700 flex items-center justify-center hover:border-[#B07D54] hover:text-[#B07D54] transition-colors duration-300 text-xs tracking-widest">FB</a>
            <a href="#" className="w-10 h-10 rounded-full border border-stone-700 flex items-center justify-center hover:border-[#B07D54] hover:text-[#B07D54] transition-colors duration-300 text-xs tracking-widest">TK</a>
          </div>
        </div>

        {/* Columna 2: Enlaces Rápidos */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h3 className="font-sans font-bold text-xs mb-6 uppercase tracking-[0.2em] text-[#e0e0e0]">Explora</h3>
          <ul className="space-y-4 text-stone-400 text-sm font-light">
            <li><a href="/" className="hover:text-[#B07D54] transition-colors duration-300">Inicio</a></li>
            <li><a href="/#servicios" className="hover:text-[#B07D54] transition-colors duration-300">Nuestros Servicios</a></li>
            <li><a href="/tienda" className="hover:text-[#B07D54] transition-colors duration-300">Tienda</a></li> 
            <li><a href="/#crew" className="hover:text-[#B07D54] transition-colors duration-300">Nosotros</a></li>
          </ul>
        </div>

        {/* Columna 3: Horarios y Ubicación */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h3 className="font-sans font-bold text-xs mb-6 uppercase tracking-[0.2em] text-[#e0e0e0]">Visítanos</h3>
          <ul className="space-y-3 text-sm text-stone-400 font-light w-full max-w-[250px]">
            <li className="flex justify-between border-b border-stone-800 pb-2">
              <span>Lunes - Sábado</span>
              <span className="text-white">10:00 - 21:00</span>
            </li>
            <li className="flex justify-between border-b border-stone-800 pb-2">
              <span>Domingos</span>
              <span className="text-[#B07D54]">Previa Cita</span>
            </li>
          </ul>
          
          <div className="mt-8 text-sm text-stone-400 flex flex-col gap-4 font-light">
            <a 
              href="https://maps.app.goo.gl/EW9zHwGZfX778KpT6"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 hover:text-[#B07D54] transition-colors duration-300 group"
            >
              <span className="text-[#B07D54]">📍</span>
              <span className="group-hover:underline">Av. Sucre 1073, Pueblo Libre</span>
            </a>
            <a 
              href="https://maps.app.goo.gl/Mj8G2Uxb1vxwKnpm8"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 hover:text-[#B07D54] transition-colors duration-300 group"
            >
              <span className="text-[#B07D54]">📍</span>
              <span className="group-hover:underline">Jr. De la Unión, Cercado de Lima</span>
            </a>
          </div>
        </div>

      </div>

      {/* Copyright */}
      <div className="text-center text-stone-600 text-[11px] uppercase tracking-widest pt-8 border-t border-stone-900 font-light">
        © {new Date().getFullYear()} Markus Barbería. Desarrollado por Jhon Patrick Dev.
      </div>
    </footer>
  );
}