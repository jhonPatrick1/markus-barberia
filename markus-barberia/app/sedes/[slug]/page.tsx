"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; 
import Image from "next/image";
import { supabase } from "@/lib/supabase"; 
import BookingModal from "@/components/BookingModal"; 

export default function SedeDetalle() {
  const params = useParams();
  const router = useRouter(); 
  const slug = params.slug as string;

  const [sedeDB, setSedeDB] = useState<any>(null);
  const [barberosFiltrados, setBarberosFiltrados] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [preSelection, setPreSelection] = useState<{ sede?: any; barbero?: any }>();

  const getNombreRealSede = (slugStr: string) => {
    if (!slugStr) return ""; 

    const mapa: Record<string, string> = {
      'cercado-de-lima': 'Cercado de Lima',
      'pueblo-libre': 'Pueblo Libre',
      'magdalena-del-mar': 'Magdalena del Mar'
    };
    return mapa[slugStr] || slugStr.replace(/-/g, ' ');
  };

  const getMapEmbedUrl = (slugStr: string) => {
    if (!slugStr) return "";

    const mapas: Record<string, string> = {
      'cercado-de-lima': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d487.75491025011354!2d-77.06209411258742!3d-12.04081669107053!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105ced4a29ecc35%3A0xba540d59418bcda0!2sMarkus%20Barberia!5e0!3m2!1ses!2spe!4v1775602896420!5m2!1ses!2spe', 
      'pueblo-libre': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62423.082271615574!2d-77.13862417832028!3d-12.081820300000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c9060b32e637%3A0xad23714cf285fa72!2sMARKUS%20Barberia!5e0!3m2!1ses!2spe!4v1775607248253!5m2!1ses!2spe',
      'magdalena-del-mar': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1950.6649019541483!2d-77.0707168!3d-12.0895596!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c9a7a869102d%3A0x690abd839a231d1b!2sJr.%20Tacna%20940%2C%20Magdalena%20del%20Mar%2015086!5e0!3m2!1ses!2spe!4v1775607303720!5m2!1ses!2spe'
    };
    return mapas[slugStr] || '';
  };

  const getWhatsAppNumber = (slugStr: string) => {
    if (!slugStr) return "";
    const numeros: Record<string, string> = {
      'cercado-de-lima': '51960378805',
      'pueblo-libre': '51917876813',
      'magdalena-del-mar': '51991589891'
    };
    return numeros[slugStr] || '51917876813'; 
  };

  useEffect(() => {
    const cargarDatos = async () => {
      if (!slug) return; 

      setIsLoading(true);
      const nombreSede = getNombreRealSede(slug);

      const { data: sedeData } = await supabase
        .from('sedes')
        .select('*')
        .eq('nombre', nombreSede)
        .single();

      if (sedeData) {
        setSedeDB(sedeData);

        const { data: barberosData } = await supabase
          .from('barberos')
          .select('*')
          .eq('sede_id', sedeData.id)
          .eq('activo', true);

        if (barberosData) {
          const barberosHibridos = barberosData.map((b: any, i: number) => ({
            ...b,
            img: `/integrante${(i % 3) + 1}.jpg`,
            rating: "5.0",
            role: "Especialista Markus"
          }));
          setBarberosFiltrados(barberosHibridos);
        }
      }
      setIsLoading(false);
    };

    cargarDatos();
  }, [slug]);

  const handleReservarConBarbero = (barbero: any) => {
    setPreSelection({ sede: sedeDB, barbero: barbero });
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#101010] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B07D54]"></div>
      </div>
    );
  }

  if (!sedeDB) {
    return (
      <div className="min-h-screen bg-[#101010] flex flex-col items-center justify-center text-white">
        <h1 className="text-3xl font-serif mb-4">Sede no encontrada</h1>
        <button onClick={() => router.push('/')} className="text-[#B07D54] underline">Volver al inicio</button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#101010] pb-24 pt-16 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-stone-800 pb-4 mb-6 gap-3">
          <div>
            <button 
              onClick={() => router.back()} 
              className="text-stone-500 hover:text-white text-[10px] uppercase tracking-widest mb-2 inline-flex items-center gap-2 transition-colors"
            >
              <span>←</span> Volver a Sedes
            </button>
            <h1 className="font-serif text-5xl md:text-7xl text-white uppercase tracking-wide leading-none">
              {sedeDB.nombre}
            </h1>
          </div>
          <div className="flex items-center gap-3 text-stone-400 mb-2 md:mb-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B07D54" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <span className="text-[10px] md:text-xs tracking-widest uppercase">Sede Oficial Markus</span>
          </div>
        </div>

        <h2 className="text-[#B07D54] text-xs font-bold uppercase tracking-[0.2em] mb-6 text-center md:text-left">
          Especialistas Disponibles
        </h2>

        {barberosFiltrados.length === 0 ? (
          <div className="bg-[#161616] border border-stone-800 p-12 rounded-2xl text-center">
            <p className="text-stone-400">Aún no hay especialistas asignados a esta sede.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {barberosFiltrados.map((barbero) => (
              <div key={barbero.id} className="bg-[#161616] border border-stone-800 p-6 rounded-3xl flex flex-col items-center hover:border-stone-600 transition-colors shadow-lg">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden mb-6 border-2 border-stone-800 flex items-center justify-center bg-[#101010] shadow-inner">
                 {barbero.foto_url ? (
                 <img 
                 src={barbero.foto_url} 
                 alt={barbero.nombre} 
                 className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-500"
                 />
                 ) : (
               <span className="text-6xl md:text-7xl font-serif text-[#B07D54]">
               {barbero.nombre.charAt(0).toUpperCase()}
                 </span>
                 )}
                 </div>
                <div className="text-center w-full mb-8">
                  <h3 className="font-serif text-2xl text-white uppercase tracking-widest mb-1">{barbero.nombre}</h3>
                  <p className="text-stone-500 text-[10px] uppercase tracking-widest mb-3">{barbero.role}</p>
                  <div className="flex justify-center items-center gap-1 text-amber-500 text-xs">
                    ★ <span className="font-bold">{barbero.rating}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleReservarConBarbero(barbero)}
                  className="w-full bg-transparent border border-[#B07D54] text-[#B07D54] py-3.5 rounded-full font-bold text-[11px] uppercase tracking-widest hover:bg-[#B07D54] hover:text-[#161616] transition-colors"
                >
                  Reservar con {barbero.nombre}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* MAPA MOVIDO ARRIBA DEL WHATSAPP */}
        <div className="mt-16 border-t border-stone-800 pt-16">
          <h2 className="text-[#B07D54] text-xs font-bold uppercase tracking-[0.2em] mb-8 text-center md:text-left">
            Ubicación de la Sede
          </h2>
          <div className="w-full h-[300px] md:h-[450px] rounded-3xl overflow-hidden border border-stone-800 relative">
            {getMapEmbedUrl(slug) ? (
              <iframe 
                src={getMapEmbedUrl(slug)} 
                className="w-full h-full border-0"
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            ) : (
              <div className="w-full h-full bg-[#161616] flex items-center justify-center text-stone-500">
                Mapa no disponible
              </div>
            )}
          </div>
        </div>

        {/* TARJETA DE WHATSAPP COMO CIERRE PERFECTO */}
        <div className="mt-12 bg-[#161616] border border-stone-800 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
          <div className="text-center md:text-left">
            <h3 className="font-serif text-2xl text-white mb-2">¿Problemas para llegar?</h3>
            <p className="text-stone-400 text-sm font-light max-w-md">
              Escríbenos directamente al WhatsApp de la sede <span className="text-white font-medium">{sedeDB.nombre}</span> y te guiaremos o resolveremos tus dudas.
            </p>
          </div>
          <a 
            href={`https://wa.me/${getWhatsAppNumber(slug)}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="shrink-0 bg-[#25D366] text-white px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-[#1EBE5D] transition-colors flex items-center gap-3"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.463 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            Contactar por WhatsApp
          </a>
        </div>

      </div>

      <BookingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        preSelection={preSelection}
      />
    </main>
  );
}