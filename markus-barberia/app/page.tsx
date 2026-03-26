"use client";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar"; 
import Footer from "../components/Footer";
import ServicesSection from "../components/ServicesSection";
import Hero from "../components/Hero"; 
import GoogleReviews from "../components/GoogleReviews";
import Gallery from "@/components/Gallery";
import CrewSection from "../components/CrewSection";
import BookingModal from "../components/BookingModal";
import { supabase } from "../lib/supabase"; // 👇 IMPORTAMOS SUPABASE AQUÍ

// Definimos la estructura de la pre-selección para Typescript
interface PreSelection {
  sede?: any;
  barbero?: any;
}

export default function Home() {
  // 👇 1. AJUSTE: Estado "inteligente" para el Modal
  // Ahora es un objeto que controla la visibilidad y los datos pre-seleccionados.
  const [bookingModalState, setBookingModalState] = useState<{
    isOpen: boolean;
    preSelection?: PreSelection;
  }>({
    isOpen: false,
    preSelection: undefined
  });

  // 👇 2. AJUSTE: Cargamos las sedes en la página principal
  // Esto es vital para poder "mapear" el texto "Pueblo Libre" de la sección Crew
  // con el objeto Sede real que viene de Supabase.
  const [sedesDB, setSedesDB] = useState<any[]>([]);
  const [isLoadingSedes, setIsLoadingSedes] = useState(true);

  useEffect(() => {
    const fetchSedes = async () => {
      setIsLoadingSedes(true);
      const { data, error } = await supabase.from('sedes').select('*');
      if (data) setSedesDB(data);
      setIsLoadingSedes(false);
    };
    fetchSedes();
  }, []);

  // Funciones para abrir y cerrar el modal con facilidad
  const openBookingModal = (data?: PreSelection) => {
    setBookingModalState({ isOpen: true, preSelection: data });
  };

  const closeBookingModal = () => {
    setBookingModalState({ isOpen: false, preSelection: undefined });
  };

  return (
    <main className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans selection:bg-[#B07D54] selection:text-white relative">
      
      {/*👇 Pasamos la función de abrir reservas al Navbar */}
      <Navbar onOpenReservations={openBookingModal} />

      {/*👇 Pasamos la función de abrir reservas al Hero */}
      <Hero onOpenReservations={openBookingModal} />

      {/*👇 Pasamos la función de abrir reservas a Servicios */}
      <ServicesSection onOpenReservations={openBookingModal} />
      
      {/*👇 IMPORTANTE: Pasamos las sedes y la función de abrir a CrewSection */}
      <CrewSection 
        sedesDB={sedesDB} 
        isLoadingSedes={isLoadingSedes} 
        onOpenReservations={openBookingModal} 
      /> 
      
      <Gallery />
      <GoogleReviews />
      <Footer />

      {/*👇 Botón WhatsApp Flotante */}
      <a 
        href="https://wa.me/51917876813?text=Hola%20Markus%2C%20quisiera%20reservar%20una%20cita."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-40 bg-[#25D366] hover:bg-[#1EBE5D] text-white p-4 rounded-full shadow-lg shadow-stone-900/50 transition transform hover:scale-110 flex items-center justify-center animate-bounce"
        aria-label="Contactar por WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.463 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
      </a>

      {/*👇 3. AJUSTE: El Modal inteligente al final */}
      <BookingModal 
        isOpen={bookingModalState.isOpen} 
        preSelection={bookingModalState.preSelection} 
        onClose={closeBookingModal} 
      />
      
    </main>
  );
}