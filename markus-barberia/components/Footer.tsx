"use client"; // Importante para AOS si usas Next.js 13+ App Router

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white w-full px-4 md:px-8 py-12 md:py-16 flex justify-center">
      
      {/* 1. EL CONTENEDOR MONOLÍTICO OSCURO */}
      <div className="bg-zinc-950 w-full max-w-7xl rounded-[2rem] md:rounded-[3rem] px-8 py-16 md:p-24 flex flex-col" data-aos="fade-up">
        
        {/* 2. BLOQUE SUPERIOR: La Frase Protagonista */}
        <div className="text-center w-full">
          <h2 className="font-serif text-5xl md:text-7xl font-bold text-white tracking-tight uppercase leading-tight">
            El arte es nuestro, <br className="hidden md:block" />
            la actitud es tuya.
          </h2>
          <p className="text-zinc-400 mt-6 text-sm md:text-lg font-light max-w-2xl mx-auto">
            Gracias por confiar tu imagen en nosotros y ser parte de la familia Markus.
          </p>
        </div>

        {/* Divisor superior */}
        <div className="w-full border-t border-zinc-800 mt-16 mb-16"></div>

        {/* 3. BLOQUE MEDIO: Grid Minimalista */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          
          {/* Col 1: ¿BUSCAS AYUDA? (Ahora con SVGs minimalistas) */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-white font-bold tracking-widest text-sm mb-6 uppercase">
              ¿Buscas Ayuda?
            </h3>
            <ul className="text-zinc-400 text-sm font-light space-y-5">
              <li className="flex items-center gap-3 justify-center md:justify-start">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <a href="https://wa.me/51960378805" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  +51 960 378 805
                </a>
              </li>
              <li className="flex items-center gap-3 justify-center md:justify-start">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
                <a href="mailto:contacto@markusbarberia.com" className="hover:text-white transition-colors">
                  markusbarberiaperu@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3 justify-center md:justify-start">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Preguntas Frecuentes
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: SÍGUENOS (Solo SVG Minimalistas) */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-white font-bold tracking-widest text-sm mb-6 uppercase">
              Síguenos
            </h3>
            <div className="flex items-center gap-6 text-zinc-400">
              {/* Instagram SVG */}
              <a href="https://www.instagram.com/markus_barberia/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Instagram">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              {/* Facebook SVG */}
              <a href="https://www.facebook.com/MarkusBarberia" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Facebook">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              {/* TikTok SVG */}
              <a href="https://www.tiktok.com/@markusbarberia?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="TikTok">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 3: MEDIOS DE PAGO (Solo SVG Vectoriales) */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-white font-bold tracking-widest text-sm mb-6 uppercase">
              Medios de Pago
            </h3>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-zinc-400">
              
              {/* YAPE Wordmark Vector */}
              <svg viewBox="0 0 48 20" className="h-5 fill-current" aria-label="Yape">
                <text x="0" y="16" fontFamily="sans-serif" fontWeight="900" fontSize="18" letterSpacing="-1">YAPE</text>
              </svg>

              {/* PLIN Wordmark Vector */}
              <svg viewBox="0 0 42 20" className="h-5 fill-current" aria-label="Plin">
                <text x="0" y="16" fontFamily="sans-serif" fontWeight="900" fontSize="18" letterSpacing="-1">PLIN</text>
              </svg>

              {/* VISA Wordmark Vector */}
              <svg viewBox="0 0 44 20" className="h-6 fill-current" aria-label="Visa">
                <text x="0" y="16" fontFamily="serif" fontWeight="900" fontSize="20" fontStyle="italic" letterSpacing="-1.5">VISA</text>
              </svg>

              {/* MASTERCARD Shape Vector */}
              <svg viewBox="0 0 36 24" className="h-7 fill-current" aria-label="Mastercard">
                <circle cx="12" cy="12" r="10" fillOpacity="0.8"></circle>
                <circle cx="24" cy="12" r="10" fillOpacity="0.8"></circle>
              </svg>

            </div>
          </div>

        </div>

        {/* 4. BLOQUE INFERIOR Y COPYRIGHT */}
        <div className="w-full border-t border-zinc-800 mt-16 pt-8">
          <p className="text-center text-zinc-500 text-sm font-light tracking-wide">
            © 2026 Markus Barbería. Todos los derechos reservados.
          </p>
        </div>

      </div>
    </footer>
  );
}