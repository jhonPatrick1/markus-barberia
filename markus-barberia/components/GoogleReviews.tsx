"use client";

export default function GoogleReviews() {
  // Añadí una sexta reseña para que el bucle se vea súper fluido y lleno
  const reviews = [
    {
      name: "Jhon Cali",
      time: "hace 2 días",
      text: "El sistema para agendar es súper rápido y la atención en la barbería es de otro nivel. El mejor corte que me he hecho. Recomendado al 100% 🚀💈",
      stars: 5,
      initial: "J"
    },
    {
      name: "Gian Carlos Rodas",
      time: "hace 10 meses",
      text: "Una experiencia genial la verdad la atención es 10/10 la recomiendo bastante 👌🏼",
      stars: 5,
      initial: "G"
    },
    {
      name: "Carlos R.",
      time: "hace 2 días",
      text: "El mejor degradado de Pueblo Libre. El ambiente es súper relajante y la bebida de cortesía un buen toque.",
      stars: 5,
      initial: "C"
    },
    {
      name: "Miguel Angel T.",
      time: "hace 1 semana",
      text: "Excelente servicio. Los barberos son muy profesionales y el local está impecable. Volveré definitivamente.",
      stars: 5,
      initial: "M"
    },
    {
      name: "Alejandro V.",
      time: "hace 1 mes",
      text: "Atención de primera. Te escuchan, te recomiendan y el resultado final siempre supera las expectativas.",
      stars: 5,
      initial: "A"
    },
    {
      name: "Daniel F.",
      time: "hace 2 meses",
      text: "Fui por primera vez y me encantó. El detalle que le ponen al perfilado de la barba es de otro nivel. Recomendadísimo.",
      stars: 5,
      initial: "D"
    }
  ];

  return (
    <section className="py-24 bg-[#161616] border-t border-stone-800 overflow-hidden relative">
      
      {/* 👇 ESTILOS DE LA ANIMACIÓN INFINITA 👇 */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
          width: max-content;
        }
      `}} />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* CABECERA: Resumen de Google */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8" data-aos="fade-up">
          <div className="text-center md:text-left">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#e0e0e0] mb-4 uppercase tracking-tighter">
              Lo que dicen de nosotros
            </h2>
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <span className="text-5xl font-serif text-white">4.9</span>
              <div className="flex flex-col">
                <div className="flex text-[#B07D54] text-xl tracking-widest">★★★★★</div>
                <p className="text-stone-400 text-xs tracking-widest uppercase mt-1">Basado en 143 reseñas</p>
              </div>
              <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center ml-4 shadow-lg">
                <svg viewBox="0 0 24 24" className="w-5 h-5"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              </div>
            </div>
          </div>

          <a 
            href="https://maps.app.goo.gl/e28p3qkcmedvzMpG6" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-full border border-stone-600 text-stone-300 hover:border-[#B07D54] hover:text-[#B07D54] transition-colors duration-300 text-xs tracking-widest uppercase font-medium flex items-center gap-2 shrink-0 z-10"
          >
            Ver reseñas en Google <span>↗</span>
          </a>
        </div>
      </div>

      {/* CARRUSEL INFINITO ANIMADO */}
      <div 
        className="w-full flex overflow-hidden group"
        // Este estilo crea un difuminado en los bordes para que las tarjetas "desaparezcan" suavemente a los lados
        style={{ maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)' }}
      >
        <div className="flex animate-marquee group-hover:[animation-play-state:paused] hover:[animation-play-state:paused] transition-all">
          
          {/* PRIMER GRUPO DE TARJETAS */}
          <div className="flex gap-6 pr-6">
            {reviews.map((review, index) => (
              <div 
                key={`grupo1-${index}`}
                className="bg-white p-8 rounded-2xl border border-stone-200 relative shrink-0 w-[300px] sm:w-[340px] md:w-[380px] shadow-xl hover:shadow-2xl transition-shadow"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-[#B07D54] flex items-center justify-center text-white font-serif text-xl shadow-md shrink-0">
                    {review.initial}
                  </div>
                  <div>
                    <h4 className="text-gray-900 font-sans font-bold text-sm tracking-wide">{review.name}</h4>
                    <p className="text-gray-500 text-xs mt-1">{review.time}</p>
                  </div>
                </div>
                <div className="flex text-[#B07D54] text-sm mb-4 tracking-widest">★★★★★</div>
                <p className="text-gray-700 text-sm leading-relaxed font-normal">"{review.text}"</p>
              </div>
            ))}
          </div>

          {/* SEGUNDO GRUPO DE TARJETAS (El clon exacto para que el bucle sea infinito) */}
          <div className="flex gap-6 pr-6" aria-hidden="true">
            {reviews.map((review, index) => (
              <div 
                key={`grupo2-${index}`}
                className="bg-white p-8 rounded-2xl border border-stone-200 relative shrink-0 w-[300px] sm:w-[340px] md:w-[380px] shadow-xl hover:shadow-2xl transition-shadow"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-[#B07D54] flex items-center justify-center text-white font-serif text-xl shadow-md shrink-0">
                    {review.initial}
                  </div>
                  <div>
                    <h4 className="text-gray-900 font-sans font-bold text-sm tracking-wide">{review.name}</h4>
                    <p className="text-gray-500 text-xs mt-1">{review.time}</p>
                  </div>
                </div>
                <div className="flex text-[#B07D54] text-sm mb-4 tracking-widest">★★★★★</div>
                <p className="text-gray-700 text-sm leading-relaxed font-normal">"{review.text}"</p>
              </div>
            ))}
          </div>

        </div>
      </div>

    </section>
  );
}