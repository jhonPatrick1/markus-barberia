"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white w-full px-4 sm:px-6 md:px-8 pb-6 md:pb-12 pt-12 md:pt-16 flex justify-center">
      
      {/* 1. EL CONTENEDOR MONOLÍTICO OSCURO */}
      {/* Redujimos el padding en móvil (px-6 py-12) para que se sienta compacto como una app */}
      <div className="bg-[#101010] w-full max-w-7xl rounded-[2.5rem] md:rounded-[3rem] px-6 py-12 md:p-20 flex flex-col shadow-2xl relative overflow-hidden" data-aos="fade-up">
        
        {/* 🔥 TOQUE PREMIUM: Brillo sutil en el fondo superior 🔥 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] md:w-[50%] h-40 bg-[#B07D54] opacity-10 md:opacity-20 blur-[100px] rounded-full pointer-events-none"></div>

        {/* 2. BLOQUE SUPERIOR: La Frase Protagonista */}
        <div className="text-center w-full relative z-10">
          {/* Tipografía responsiva: text-3xl en móvil, text-7xl en PC */}
          <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-wide uppercase leading-[1.1] md:leading-tight">
            El arte es nuestro, <br className="hidden sm:block" />
            la actitud es tuya.
          </h2>
          <p className="text-stone-400 mt-4 md:mt-6 text-xs sm:text-sm md:text-lg font-light max-w-2xl mx-auto tracking-wide px-4">
            Gracias por confiar tu imagen en nosotros y ser parte de la familia Markus.
          </p>
        </div>

        {/* Divisor superior adaptativo (menos margen en móvil) */}
        <div className="w-full border-t border-stone-800/60 my-10 md:my-16 relative z-10"></div>

        {/* 3. BLOQUE MEDIO: Grid Minimalista */}
        {/* gap-10 en móvil agrupa mejor los elementos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 md:gap-12 text-center md:text-left relative z-10">
          
          {/* Col 1: ¿BUSCAS AYUDA? */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-white font-bold tracking-[0.2em] text-[11px] md:text-xs mb-5 uppercase">
              ¿Buscas Ayuda?
            </h3>
            <ul className="text-stone-400 text-xs md:text-sm font-light space-y-4">
              <li className="flex items-center gap-3 justify-center md:justify-start group">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#B07D54] group-hover:scale-110 transition-transform">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <a href="https://wa.me/51960378805" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors tracking-wide">
                  +51 960 378 805
                </a>
              </li>
              <li className="flex items-center gap-3 justify-center md:justify-start group">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#B07D54] group-hover:scale-110 transition-transform">
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
                <a href="mailto:contacto@markusbarberia.com" className="hover:text-white transition-colors tracking-wide">
                  markusbarberiaperu@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Col 2: SÍGUENOS */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-white font-bold tracking-[0.2em] text-[11px] md:text-xs mb-5 uppercase">
              Síguenos
            </h3>
            <div className="flex items-center gap-5 text-stone-400">
              <a href="https://www.instagram.com/markus_barberia/" target="_blank" rel="noopener noreferrer" className="hover:text-[#B07D54] transition-all hover:-translate-y-1" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="https://www.facebook.com/MarkusBarberia" target="_blank" rel="noopener noreferrer" className="hover:text-[#B07D54] transition-all hover:-translate-y-1" aria-label="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="https://www.tiktok.com/@markusbarberia?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer" className="hover:text-[#B07D54] transition-all hover:-translate-y-1" aria-label="TikTok">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 3: MEDIOS DE PAGO */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-white font-bold tracking-[0.2em] text-[11px] md:text-xs mb-5 uppercase">
              Medios de Pago
            </h3>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-5 text-stone-400 opacity-80">
              <svg viewBox="0 0 48 20" className="h-4 md:h-5 fill-current" aria-label="Yape">
                <text x="0" y="16" fontFamily="sans-serif" fontWeight="900" fontSize="18" letterSpacing="-1">YAPE</text>
              </svg>
              <svg viewBox="0 0 42 20" className="h-4 md:h-5 fill-current" aria-label="Plin">
                <text x="0" y="16" fontFamily="sans-serif" fontWeight="900" fontSize="18" letterSpacing="-1">PLIN</text>
              </svg>
              <svg viewBox="0 0 44 20" className="h-5 md:h-6 fill-current" aria-label="Visa">
                <text x="0" y="16" fontFamily="serif" fontWeight="900" fontSize="20" fontStyle="italic" letterSpacing="-1.5">VISA</text>
              </svg>
              <svg viewBox="0 0 36 24" className="h-6 md:h-7 fill-current" aria-label="Mastercard">
                <circle cx="12" cy="12" r="10" fillOpacity="0.8"></circle>
                <circle cx="24" cy="12" r="10" fillOpacity="0.8"></circle>
              </svg>
            </div>
          </div>

        </div>

        {/* 4. BLOQUE INFERIOR Y COPYRIGHT */}
        <div className="w-full border-t border-stone-800/60 mt-10 md:mt-16 pt-6 md:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
          <p className="text-stone-500 text-[10px] md:text-xs font-medium tracking-[0.2em] uppercase text-center">
            © 2026 Markus Barbería.
          </p>
          <p className="text-stone-500 text-[10px] md:text-xs font-medium tracking-[0.2em] uppercase text-center">
            Todos los derechos reservados.
          </p>
        </div>

      </div>
    </footer>
  );
}