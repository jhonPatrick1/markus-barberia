import Navbar from "../components/Navbar"; 
import Footer from "../components/Footer";
import ServicesSection from "../components/ServicesSection";
import Hero from "../components/Hero"; // <--- AQUÍ IMPORTAMOS TU NUEVO COMPONENTE
import GoogleReviews from "../components/GoogleReviews";
import Gallery from "@/components/Gallery";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      
      {/* 1. Navbar */}
      <Navbar />

      <Hero />

      {/* 3. Servicios */}
      <ServicesSection />

      {/* 4. Staff  */}
      <section id="crew" className="py-24 bg-black px-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4 uppercase">
              Team Markus
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              No es solo un corte, es quién te lo hace. Conoce a los expertos detrás de la silla.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Marcos", role: "Master Barber", img: "/Marcos.jpg" },
              { name: "Sebastián", role: "Fade Specialist", img: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=1976&auto=format&fit=crop" },
              { name: "Yeampier", role: "Urban Style", img: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=1974&auto=format&fit=crop" },
              { name: "Jesús", role: "Classic Cuts", img: "https://images.unsplash.com/photo-1512864084360-7c0c4d0a0845?q=80&w=2070&auto=format&fit=crop" }
            ].map((barber, index) => (
              <div 
                key={index} 
                className="group relative overflow-hidden rounded-xl cursor-pointer"
                data-aos="fade-up"
                data-aos-delay={index * 150}
              >
                <div className="aspect-[3/4] bg-neutral-800 relative">
                    <img 
                      src={barber.img} 
                      alt={barber.name}
                      className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition duration-500 group-hover:scale-110"
                    />
                </div>
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-black/80 to-transparent p-4 translate-y-2 group-hover:translate-y-0 transition duration-300">
                  <h3 className="text-white font-bold text-lg font-heading">{barber.name}</h3>
                  <p className="text-amber-500 text-xs font-bold uppercase">{barber.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Gallery />
      
      <GoogleReviews />

      {/* 5. Footer */}
      <Footer />

      {/* 6. Botón WhatsApp Flotante */}
      <a 
        href="https://wa.me/51917876813?text=Hola%20Markus%2C%20quisiera%20reservar%20una%20cita."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-40 bg-green-600 hover:bg-green-500 text-white p-4 rounded-full shadow-lg shadow-green-900/20 transition transform hover:scale-110 flex items-center justify-center animate-bounce"
        aria-label="Contactar por WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.463 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
      </a>

    </main>
  );
}