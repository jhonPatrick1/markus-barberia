import Image from "next/image";

// 👇 1. Le decimos que acepte onOpenReservations
export default function Hero({ onOpenReservations }: { onOpenReservations: () => void }) {
  return (
    <section className="relative h-screen flex flex-col items-center justify-center bg-[#101010] overflow-hidden">
      
      <div className="absolute inset-0 pointer-events-none">
        <Image 
          src="/fondo.png" 
          alt="Fondo Markus Barbería"
          fill 
          priority 
          quality={100}
          className="object-cover object-center" 
        />
        <div className="absolute inset-0 bg-black/30 z-10"></div>
      </div>

      <div className="relative z-20 flex flex-col items-center text-center px-4 w-full max-w-5xl">
        
        <div className="mb-10 md:mb-12 w-full max-w-[280px] md:max-w-3xl lg:max-w-5xl" data-aos="fade-up" data-aos-duration="1000">
          <img 
            src="/markus.png" 
            alt="MARKUS Barbería" 
            className="w-full h-auto drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]" 
          />
        </div>
        
        <p className="text-stone-300 text-xs md:text-sm tracking-[0.4em] uppercase mb-12 font-light flex items-center gap-3" data-aos="fade-up" data-aos-duration="1000">
          Pueblo Libre <span className="text-[#B07D54]">·</span> Cercado de Lima
        </p>

        {/* 👇 2. Conectamos el botón a la función */}
        <button 
          onClick={onOpenReservations}
          className="group relative px-10 py-4 bg-transparent border-2 border-stone-500 text-stone-100 rounded-full transition-all duration-500 hover:border-[#B07D54] hover:text-[#B07D54] hover:shadow-[0_0_20px_rgba(176,125,84,0.4)]"
          data-aos="fade-up" 
          data-aos-duration="1000"
        >
          <span className="relative z-10 uppercase tracking-widest text-xs font-bold">
            Reservar Experiencia
          </span>
          <div className="absolute inset-0 bg-[#B07D54] opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
        </button>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center z-20" data-aos="fade-up" data-aos-duration="1000">
        <span className="text-[10px] text-stone-400 uppercase tracking-[0.3em] mb-4 font-medium">Descubre más</span>
        <div className="animate-bounce">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-stone-500">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}