"use client";

export default function GoogleReviews() {
  const reviews = [
    {
      name: "Sebastian GUTIERREZ",
      time: "hace 9 meses",
      text: "Una experiencia única que me lleve, me asesoraron antes de cortarme y la atención A1 ✂️💈",
      stars: 5,
      initial: "S"
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
    }
  ];

  return (
    <section className="py-24 bg-[#161616] border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* CABECERA: Resumen de Google */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8" data-aos="fade-up">
          
          {/* Lado Izquierdo: Título y Puntaje General */}
          <div className="text-center md:text-left">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#e0e0e0] mb-4 uppercase tracking-tighter">
              Lo que dicen de nosotros
            </h2>
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <span className="text-5xl font-serif text-white">4.9</span>
              <div className="flex flex-col">
                {/* Estrellas en tono Cobre para mantener el Branding */}
                <div className="flex text-[#B07D54] text-xl tracking-widest">★★★★★</div>
                <p className="text-stone-400 text-xs tracking-widest uppercase mt-1">Basado en 143 reseñas</p>
              </div>
              {/* Logo de Google original para dar confianza */}
              <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center ml-4 shadow-lg">
                <svg viewBox="0 0 24 24" className="w-5 h-5"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              </div>
            </div>
          </div>

          {/* Botón Minimalista Ovalado */}
          <a 
            href="https://maps.app.goo.gl/e28p3qkcmedvzMpG6" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-full border border-stone-600 text-stone-300 hover:border-[#B07D54] hover:text-[#B07D54] transition-colors duration-300 text-xs tracking-widest uppercase font-medium flex items-center gap-2"
          >
            Ver reseñas en Google <span>↗</span>
          </a>
        </div>

        {/* GRID DE TARJETAS (Estilo Luxury Dark) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div 
              key={index}
              className="bg-[#1A1A1A] p-8 rounded-2xl border border-stone-800 hover:border-stone-600 transition-colors duration-500 relative group"
              data-aos="fade-up"
              data-aos-delay={index * 150}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#B07D54] flex items-center justify-center text-white font-serif text-xl shadow-lg">
                  {review.initial}
                </div>
                <div>
                  <h4 className="text-[#e0e0e0] font-sans font-bold text-sm tracking-wide">{review.name}</h4>
                  <p className="text-stone-500 text-xs mt-1">{review.time}</p>
                </div>
              </div>

              <div className="flex text-[#B07D54] text-sm mb-4 tracking-widest">★★★★★</div>

              <p className="text-stone-300 text-sm leading-relaxed font-light">
                "{review.text}"
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}