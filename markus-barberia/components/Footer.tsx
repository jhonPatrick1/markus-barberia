export default function Footer() {
  return (
    // pt-16 a pt-10 y pb-8 a pb-5
    <footer className="bg-neutral-900 text-white border-t border-white/10 pt-10 pb-5">
      
      {/* gap-12 a gap-8 y mb-12 a mb-8 */}
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        
        {/* Columna 1: Marca */}
        <div>
          {/* mb-6 a mb-3 */}
          <h2 className="font-heading text-2xl font-bold tracking-tighter mb-3">MARKUS</h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-4 text-xs">
            Redefiniendo el estilo masculino en Lima. Más que un corte, una experiencia de confianza y calidad.
          </p>
          <div className="flex gap-3">
            <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white hover:text-black transition text-xs">IG</a>
            <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white hover:text-black transition text-xs">FB</a>
            <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white hover:text-black transition text-xs">TK</a>
          </div>
        </div>

        {/* Columna 2: Enlaces Rápidos */}
        <div>
          <h3 className="font-bold text-sm mb-4 uppercase tracking-wider">Explora</h3>
          {/* space-y-4 a space-y-2 */}
          <ul className="space-y-2 text-gray-400 text-xs">
            <li><a href="/" className="hover:text-white transition">Inicio</a></li>
            <li><a href="/#servicios" className="hover:text-white transition">Nuestros Servicios</a></li>
            {/* Ubicación apuntando a /tienda */}
            <li><a href="/tienda" className="hover:text-white transition">Tienda</a></li> 
            <li><a href="/#crew" className="hover:text-white transition">Nosotros</a></li>
          </ul>
        </div>

        {/* Columna 3: (Horarios) */}
        <div>
          <h3 className="font-bold text-sm mb-4 uppercase tracking-wider">Visítanos</h3>
          <ul className="space-y-2 text-xs text-gray-400">
            <li className="flex justify-between border-b border-white/10 pb-1">
              <span>Lunes - Sábado</span>
              <span className="text-white">10:00 AM - 9:00 PM</span>
            </li>
            <li className="flex justify-between border-b border-white/10 pb-1">
              <span>Domingos</span>
              <span className="text-white">Previa Cita</span>
            </li>
          </ul>
          <div className="mt-4 text-xs text-gray-500 flex flex-col gap-2">
            
            <a 
              href="https://maps.app.goo.gl/EW9zHwGZfX778KpT6"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 hover:text-amber-500 transition group"
            >
              <span>📍</span>
              <span className="group-hover:underline">Av. Sucre 1073, Pueblo Libre</span>
            </a>

            <a 
              href="https://maps.app.goo.gl/Mj8G2Uxb1vxwKnpm8"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 hover:text-amber-500 transition group"
            >
              <span>📍</span>
              <span className="group-hover:underline">Jr. De la Unión, Cercado de Lima</span>
            </a>

          </div>
        </div>

      </div>

      <div className="text-center text-gray-600 text-[10px] pt-6 border-t border-white/5">
        &copy; {new Date().getFullYear()} Markus Barbería. Desarrollado por Jhon Patrick Dev.
      </div>
    </footer>
  );
}