"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase"; 

interface PreSelection {
  sede?: any;
  barbero?: any;
}

interface SlotHorario {
  horaTexto: string;
  disponible: boolean;
}

export default function BookingModal({ isOpen, preSelection, onClose }: { 
  isOpen: boolean; 
  preSelection?: PreSelection; 
  onClose: () => void 
}) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const [paymentMethod, setPaymentMethod] = useState<'local' | 'yape' | null>(null);
  const [categoriaActiva, setCategoriaActiva] = useState('SERVICIOS');

  const [sedesDB, setSedesDB] = useState<any[]>([]);
  const [barberosDB, setBarberosDB] = useState<any[]>([]);
  const [serviciosDB, setServiciosDB] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  const [slotsDelDia, setSlotsDelDia] = useState<SlotHorario[]>([]);
  
  const [selection, setSelection] = useState({
    sede: null as any,
    barbero: null as any,
    servicios: [] as any[], 
    fecha: "",
    hora: "",
    nombre: "",
    apellido: "",
    celular: "",
    correo: "",
    aceptaPromociones: false
  });

  const [currentDate, setCurrentDate] = useState(new Date());
  
  // 👇 MOTOR DE AUTO-SCROLL AL TOPE 👇
  const modalScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (modalScrollRef.current) {
      modalScrollRef.current.scrollTop = 0;
    }
  }, [step]);

  const today = new Date();
  today.setHours(0, 0, 0, 0); 

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const isCurrentMonth = currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();

  const totalMinutos = selection.servicios.reduce((sum, s) => sum + (s.duracion_minutos || 0), 0);
  const montoTotal = selection.servicios.reduce((sum, s) => sum + Number(s.precio), 0).toFixed(2);

  const formatDuracion = (mins: number) => {
    if (mins >= 60) {
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      return m > 0 ? `${h}h ${m}m` : `${h}h`;
    }
    return `${mins}m`;
  };

  const formatearFechaLegible = (fechaStr: string) => {
    if (!fechaStr) return "";
    const [year, month, day] = fechaStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    return `${dias[date.getDay()]} ${day} de ${meses[date.getMonth()]}`;
  };

  const minutosAHoraTexto = (minutosTotal: number): string => {
    const horas = Math.floor(minutosTotal / 60);
    const minutos = minutosTotal % 60;
    const ampm = horas >= 12 ? 'PM' : 'AM';
    const horas12 = horas % 12 || 12;
    const minutosStr = String(minutos).padStart(2, '0');
    return `${horas12}:${minutosStr} ${ampm}`;
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoadingData(true);
      const [resSedes, resBarberos, resServicios] = await Promise.all([
        supabase.from('sedes').select('*').order('id', { ascending: true }),
        supabase.from('barberos').select('*').order('nombre', { ascending: true }),
        supabase.from('servicios').select('*').order('id', { ascending: true }) 
      ]);

      if (resSedes.data) setSedesDB(resSedes.data);
      if (resBarberos.data) setBarberosDB(resBarberos.data);
      if (resServicios.data) setServiciosDB(resServicios.data);
      setIsLoadingData(false);
    };

    if (isOpen) {
      loadData();
    } else {
      setStep(1);
      setPaymentMethod(null);
      setCategoriaActiva('SERVICIOS'); 
      setSelection({ sede: null, barbero: null, servicios: [], fecha: "", hora: "", nombre: "", apellido: "", celular: "", correo: "", aceptaPromociones: false });
      setErrorMessage(null); 
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && !isLoadingData && preSelection) {
      if (preSelection.sede && preSelection.barbero) {
        const barberoCompleto = barberosDB.find(b => b.nombre === preSelection.barbero.nombre) || preSelection.barbero;
        setSelection(prev => ({ ...prev, sede: preSelection.sede, barbero: barberoCompleto }));
        setStep(3);
      } else if (preSelection.sede) {
        setSelection(prev => ({ ...prev, sede: preSelection.sede }));
        setStep(2);
      }
    }
  }, [isOpen, isLoadingData, preSelection, barberosDB]);

  useEffect(() => {
    const cargarHorasOcupadas = async () => {
      if (!selection.barbero || !selection.fecha) {
        setSlotsDelDia([]);
        return;
      }

      const cacheBuster = `bypass-${Date.now()}`;

      const { data, error } = await supabase
        .from('citas')
        .select('fecha_hora, duracion_total_minutos')
        .eq('barbero_id', selection.barbero.id)
        .neq('cliente_nombre', cacheBuster);

      if (data) {
        const rangosOcupados = data.map(cita => {
          const dateObj = new Date(cita.fecha_hora);
          const localYear = dateObj.getFullYear();
          const localMonth = String(dateObj.getMonth() + 1).padStart(2, '0');
          const localDay = String(dateObj.getDate()).padStart(2, '0');
          const localDateStr = `${localYear}-${localMonth}-${localDay}`;
          
          if (localDateStr === selection.fecha) {
            const inicioMin = dateObj.getHours() * 60 + dateObj.getMinutes();
            const finMin = inicioMin + (cita.duracion_total_minutos || 30);
            return { inicio: inicioMin, fin: finMin };
          }
          return null;
        }).filter(Boolean) as { inicio: number, fin: number }[];

        const APERTURA = 10 * 60; // 10:00 AM
        const CIERRE = 21 * 60; // 9:00 PM  
        const INTERVALO = 30;     
        const duracionRequerida = totalMinutos > 0 ? totalMinutos : 30;

        const nuevosSlots: SlotHorario[] = [];
        
        const now = new Date();
        const currentDateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        const isToday = selection.fecha === currentDateStr;
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        for (let t = APERTURA; t < CIERRE; t += INTERVALO) {
          const tiempoFinEstimado = t + duracionRequerida;

          if (isToday && t <= currentMinutes) {
             nuevosSlots.push({ horaTexto: minutosAHoraTexto(t), disponible: false });
             continue;
          }

          if (tiempoFinEstimado > CIERRE) {
            nuevosSlots.push({ horaTexto: minutosAHoraTexto(t), disponible: false });
            continue;
          }

          const choca = rangosOcupados.some(rango => {
            return (t < rango.fin) && (tiempoFinEstimado > rango.inicio);
          });

          nuevosSlots.push({ horaTexto: minutosAHoraTexto(t), disponible: !choca });
        }

        setSlotsDelDia(nuevosSlots);
      }
    };

    cargarHorasOcupadas();
  }, [selection.barbero, selection.fecha, totalMinutos]);

  if (!isOpen) return null;

  const stepsList = ["Ubicación", "Especialista", "Servicio", "Horario", "Datos", "Pago"];

  const barberosFiltrados = selection.sede 
    ? barberosDB.filter(b => b.sede_id === selection.sede.id)
    : [];

  const toggleServicio = (servicio: any) => {
    const existe = selection.servicios.find(s => s.id === servicio.id);
    if (existe) {
      setSelection({ ...selection, servicios: selection.servicios.filter(s => s.id !== servicio.id) });
    } else {
      setSelection({ ...selection, servicios: [...selection.servicios, servicio] });
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const prefixDays = Array(firstDay).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    return [...prefixDays, ...days];
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  const handleNext = () => { if (step < 7) setStep(step + 1); };
  
  const handleBack = () => { 
    if (step === 6 && paymentMethod) {
      setPaymentMethod(null); 
    } else if (step > 1) {
      setStep(step - 1); 
    }
  };

  const telefonosSedes: Record<string, string> = {
    "Pueblo Libre": "51917876813",       
    "Cercado de Lima": "51960378805",
    "Magdalena del Mar": "51991589891"    
  };

  const qrsSedes: Record<string, string> = {
    "Pueblo Libre": "/qr-pueblo.png",       
    "Cercado de Lima": "/qr-cercado.png",
    "Magdalena del Mar": "/qr-magdalena.png"    
  };

  const sendToWhatsApp = (isYape: boolean = false) => {
    const serviciosNombres = selection.servicios.map(s => s.nombre).join(', ');
    
    let mensajeLimpio = `¡Hola Markus! Mi reserva está confirmada en la web. Aquí están mis datos:\n\n` +
    `• *Nombre:* ${selection.nombre} ${selection.apellido}\n` +
    `• *Sede:* ${selection.sede.nombre}\n` +
    `• *Barbero:* ${selection.barbero.nombre}\n` +
    `• *Servicios:* ${serviciosNombres}\n` +
    `• *Total a pagar:* S/ ${montoTotal}\n` +
    `• *Fecha:* ${selection.fecha} a las ${selection.hora}`;

    if (isYape) {
      mensajeLimpio += `\n\n✅ *Adjunto mi captura de pago por Yape.*`;
    }

    const textoCodificado = encodeURIComponent(mensajeLimpio);
    const numeroSede = telefonosSedes[selection.sede.nombre] || "51917876813";
    window.open(`https://api.whatsapp.com/send?phone=${numeroSede}&text=${textoCodificado}`, '_blank');
  };

  const handleSubmit = async (isYape: boolean = false) => {
    setIsSubmitting(true);
    try {
      const [year, month, day] = selection.fecha.split('-');
      const timeMatch = selection.hora.match(/(\d+):(\d+) (AM|PM)/);
      let hours = parseInt(timeMatch![1]);
      if (timeMatch![3] === 'PM' && hours !== 12) hours += 12;
      if (timeMatch![3] === 'AM' && hours === 12) hours = 0;
      const mins = parseInt(timeMatch![2]);
      
      const isoDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), hours, mins).toISOString();

      const inicioMinNuevo = hours * 60 + mins;
      const finMinNuevo = inicioMinNuevo + (totalMinutos > 0 ? totalMinutos : 30);
      const cacheBuster = `bypass-${Date.now()}`;

      const { data: citasExistentes } = await supabase
        .from('citas')
        .select('fecha_hora, duracion_total_minutos')
        .eq('barbero_id', selection.barbero.id)
        .neq('cliente_nombre', cacheBuster);

      if (citasExistentes) {
        const hayChoque = citasExistentes.some(cita => {
          const citaDate = new Date(cita.fecha_hora);
          const localYear = citaDate.getFullYear();
          const localMonth = String(citaDate.getMonth() + 1).padStart(2, '0');
          const localDay = String(citaDate.getDate()).padStart(2, '0');
          const localDateStr = `${localYear}-${localMonth}-${localDay}`;
          
          if (localDateStr === selection.fecha) {
            const inicioMinCita = citaDate.getHours() * 60 + citaDate.getMinutes();
            const finMinCita = inicioMinCita + (cita.duracion_total_minutos || 30);
            
            return (inicioMinNuevo < finMinCita) && (finMinNuevo > inicioMinCita);
          }
          return false;
        });

        if (hayChoque) {
          setErrorMessage("¡Ups! Alguien más acaba de reservar este horario hace unos segundos. Por favor, elige otro horario disponible.");
          setStep(4);
          setIsSubmitting(false);
          return;
        }
      }

      const { data: nuevaCita, error: errorCita } = await supabase
        .from('citas')
        .insert({
          sede_id: selection.sede.id,
          barbero_id: selection.barbero.id,
          fecha_hora: isoDate,
          cliente_nombre: selection.nombre,
          cliente_apellido: selection.apellido,
          cliente_celular: selection.celular,
          cliente_correo: selection.correo,
          acepta_promociones: selection.aceptaPromociones,
          duracion_total_minutos: totalMinutos,
          monto_total: Number(montoTotal), 
          metodo_pago: isYape ? 'Yape Anticipado' : 'En Local'
        })
        .select()
        .single();

      if (errorCita) throw errorCita;

      const relacionesServicios = selection.servicios.map(srv => ({
        cita_id: nuevaCita.id,
        servicio_id: srv.id
      }));

      const { error: errorServicios } = await supabase
        .from('cita_servicios')
        .insert(relacionesServicios);

      if (errorServicios) throw errorServicios;

      setStep(7);
      
      if (isYape) {
        sendToWhatsApp(true);
      }

    } catch (error) {
      console.error("Error al guardar:", error);
      setErrorMessage("Hubo un problema al procesar tu reserva. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercentage = ((Math.min(step, 6) - 1) / (stepsList.length - 1)) * 100;
  
  const categoriasDB = ['SERVICIOS', 'COMBOS', 'COLORIMETRIA', 'PERMANENTE', 'EXTRA'];
  const nombreVisual: Record<string, string> = {
    'SERVICIOS': 'SERVICIOS',
    'COMBOS': 'COMBOS',
    'COLORIMETRIA': 'COLORIMETRÍA',
    'PERMANENTE': 'PERMANENTES',
    'EXTRA': 'EXTRAS'
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 font-sans">
      <div onClick={step === 7 ? onClose : undefined} className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"></div>

      <div className={`relative flex flex-col w-full transition-all duration-500 ease-in-out rounded-2xl shadow-2xl overflow-hidden bg-[#161616] border border-stone-800 ${step === 7 ? 'max-w-md h-auto' : 'max-w-4xl h-[700px] max-h-[90vh]'}`}>
        
        {/* MODAL DE ERROR */}
        {errorMessage && (
          <div className="absolute inset-0 z-[200] flex items-center justify-center bg-[#101010]/80 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-[#161616] border border-stone-800 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              </div>
              <h3 className="font-serif text-2xl text-white mb-2 tracking-wide">¡Lo sentimos!</h3>
              <p className="text-stone-400 text-sm font-light leading-relaxed mb-8 px-2">
                {errorMessage}
              </p>
              <button 
                onClick={() => setErrorMessage(null)} 
                className="w-full py-4 rounded-full border border-stone-700 text-white font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        )}

        {/* CABECERA */}
        {step < 7 && (
          <div className="w-full bg-[#101010] p-6 border-b border-stone-800 flex flex-col gap-4 relative shrink-0">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-2xl font-bold tracking-widest text-white uppercase">RESERVAR</h3>
              <button type="button" aria-label="Cerrar modal" onClick={onClose} className="text-stone-500 hover:text-white transition-colors p-2 rounded-full hover:bg-stone-800">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            <div className="w-full h-1 bg-stone-800 rounded-full overflow-hidden mt-2">
              <div 
                className="h-full bg-[#B07D54] transition-all duration-500 ease-out" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between text-[10px] uppercase tracking-widest text-stone-500 mt-1 hidden sm:flex">
               {stepsList.map((label, idx) => (
                 <span key={idx} className={`${step >= idx + 1 ? 'text-[#B07D54] font-bold' : ''}`}>
                   {label}
                 </span>
               ))}
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col overflow-hidden relative">
          
          {/* 👇 AQUÍ ENGANCHAMOS EL MOTOR DE AUTO-SCROLL AL DIV PRINCIPAL 👇 */}
          <div ref={modalScrollRef} className={`flex-1 overflow-y-auto overscroll-contain p-6 md:p-10 custom-scrollbar ${step === 7 ? 'flex items-center justify-center py-16' : ''}`}>
            {isLoadingData ? (
              <div className="flex-1 flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#B07D54]"></div>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto w-full flex flex-col">
                
                {step === 1 && (
                  <div className="animate-fade-in pb-8">
                    <h2 className="text-3xl font-serif text-white mb-2">Selecciona tu Sede</h2>
                    <p className="text-stone-500 mb-8 font-light text-sm">Elige dónde quieres vivir la experiencia Markus.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {sedesDB.map((sede) => (
                        <button type="button" key={sede.id} onClick={() => setSelection({ ...selection, sede, barbero: null })} 
                          className={`p-6 rounded-2xl border text-left transition-all duration-300 group
                          ${selection.sede?.id === sede.id ? 'border-[#B07D54] bg-[#B07D54]/10 shadow-[0_0_15px_rgba(176,125,84,0.15)] ring-1 ring-[#B07D54]' : 'border-stone-800 bg-[#1A1A1A] hover:border-stone-600'}`}>
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors ${selection.sede?.id === sede.id ? 'bg-[#B07D54] text-white' : 'bg-stone-800 text-stone-400 group-hover:text-white'}`}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                          </div>
                          <span className="block font-serif text-xl text-white tracking-wide">{sede.nombre}</span>
                          <span className="text-xs text-stone-500 font-light mt-1 block uppercase tracking-widest">Lima, Perú</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="animate-fade-in pb-8">
                    <h2 className="text-3xl font-serif text-white mb-2">Tu Especialista</h2>
                    <p className="text-stone-500 mb-8 font-light text-sm">Maestros disponibles en {selection.sede?.nombre}.</p>
                    {barberosFiltrados.length === 0 ? (
                       <p className="text-[#B07D54] text-sm bg-[#B07D54]/10 p-4 rounded-lg border border-[#B07D54]/20">Aún no hay especialistas asignados a esta sede.</p>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                        {barberosFiltrados.map((barbero) => {
                          const isSelected = selection.barbero?.id === barbero.id;
                          return (
                            <button type="button" key={barbero.id} onClick={() => setSelection({ ...selection, barbero })} 
                              className={`p-6 rounded-2xl border flex flex-col items-center justify-center gap-4 transition-all duration-300 relative
                              ${isSelected ? 'border-[#B07D54] bg-[#B07D54]/10 shadow-[0_0_15px_rgba(176,125,84,0.15)] ring-1 ring-[#B07D54]' : 'border-stone-800 bg-[#1A1A1A] hover:border-stone-600'}`}>
                              <div className={`w-20 h-20 rounded-full overflow-hidden flex items-center justify-center text-3xl font-serif transition-all
                                ${isSelected ? 'ring-2 ring-[#B07D54] bg-[#B07D54] text-white' : 'bg-stone-800 text-stone-500 grayscale'}`}>
                                {barbero.nombre.charAt(0)}
                              </div>
                              <div className="text-center">
                                <span className="font-serif text-lg text-white block tracking-wide">{barbero.nombre}</span>
                                <span className="text-[10px] text-[#B07D54] uppercase tracking-widest mt-1 block">Barbero</span>
                              </div>
                              {isSelected && (
                                <div className="absolute top-4 right-4 w-6 h-6 bg-[#B07D54] rounded-full flex items-center justify-center">
                                  <span className="text-white text-[12px]">✓</span>
                                </div>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}

                {step === 3 && (
                  <div className="animate-fade-in pb-8">
                    <h2 className="text-3xl font-serif text-white mb-2">Servicios</h2>
                    <p className="text-stone-500 mb-6 font-light text-sm">Diseña tu experiencia seleccionando los servicios.</p>
                    
                    <div className="flex flex-row overflow-x-auto gap-3 pb-4 mb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] border-b border-stone-800">
                      {categoriasDB.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setCategoriaActiva(cat)}
                          className={`rounded-full px-5 py-2 text-xs font-bold tracking-widest whitespace-nowrap transition-colors ${
                            categoriaActiva === cat
                              ? 'bg-[#B07D54] text-[#161616]'
                              : 'bg-transparent border border-zinc-700 text-zinc-400 hover:text-white hover:border-stone-500'
                          }`}
                        >
                          {nombreVisual[cat]}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-3 mt-4">
                      {serviciosDB
                        .filter(servicio => (servicio.categoria || 'SERVICIOS') === categoriaActiva)
                        .map((servicio) => {
                        const isSelected = selection.servicios.some(s => s.id === servicio.id);
                        return (
                          <button type="button" key={servicio.id} onClick={() => toggleServicio(servicio)} 
                            className={`w-full p-4 sm:p-5 rounded-2xl border text-left flex justify-between items-center transition-all duration-300 group gap-2
                            ${isSelected ? 'border-[#B07D54] bg-[#B07D54]/5 shadow-[0_0_10px_rgba(176,125,84,0.1)]' : 'border-stone-800 bg-[#1A1A1A] hover:border-stone-600'}`}>
                            
                            <div className="flex flex-col min-w-0 pr-3">
                              <span className={`font-serif text-lg leading-tight tracking-wide transition-colors ${isSelected ? 'text-[#B07D54]' : 'text-white group-hover:text-stone-200'}`}>
                                {servicio.nombre}
                              </span>
                              <span className="text-stone-500 text-sm mt-1.5 font-light">
                                {formatDuracion(servicio.duracion_minutos)}
                              </span>
                            </div>

                            <div className="flex items-center gap-3 sm:gap-5 shrink-0">
                              <span className="font-sans text-lg sm:text-xl text-white tracking-widest whitespace-nowrap">
                                S/ {servicio.precio}
                              </span>
                              <div className={`shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-colors
                                ${isSelected ? 'border-[#B07D54] bg-[#B07D54]' : 'border-stone-600'}`}>
                                 {isSelected && <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M1 7L5 11L13 2" stroke="#161616" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                              </div>
                            </div>
                          </button>
                        )
                      })}

                      {serviciosDB.filter(servicio => (servicio.categoria || 'SERVICIOS') === categoriaActiva).length === 0 && (
                        <div className="w-full p-8 border border-dashed border-stone-800 rounded-2xl flex flex-col items-center justify-center text-center mt-4">
                           <span className="text-stone-600 text-3xl mb-3">✂️</span>
                           <p className="text-stone-400 font-light text-sm">
                             Aún no hay servicios disponibles en la categoría {nombreVisual[categoriaActiva]}.
                           </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="animate-fade-in pb-8">
                    <h2 className="text-3xl font-serif text-white mb-6">Agenda tu Cita</h2>
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                      <div className="flex-1 w-full bg-[#1A1A1A] p-6 rounded-2xl border border-stone-800">
                        
                        {/* 👇 AQUI ESTÁN LOS BOTONES CORREGIDOS CON ARIA-LABEL Y TITLE 👇 */}
                        <div className="flex items-center justify-between mb-6 border-b border-stone-800 pb-4">
                          
                          {/* BOTÓN MES ANTERIOR */}
                          <button 
                            type="button" 
                            aria-label="Mes anterior"
                            title="Mes anterior"
                            onClick={handlePrevMonth} 
                            disabled={isCurrentMonth}
                            className={`p-2 rounded-full transition-colors ${isCurrentMonth ? 'text-stone-700 cursor-not-allowed' : 'text-[#B07D54] hover:bg-[#B07D54]/10'}`}
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                          </button>

                          <span className="font-sans text-sm uppercase tracking-widest text-[#e0e0e0] font-bold">
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                          </span>

                          {/* BOTÓN MES SIGUIENTE */}
                          <button 
                            type="button" 
                            aria-label="Mes siguiente"
                            title="Mes siguiente"
                            onClick={handleNextMonth} 
                            className="p-2 rounded-full text-[#B07D54] hover:bg-[#B07D54]/10 transition-colors"
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                          </button>
                        </div>

                        <div className="grid grid-cols-7 text-center mb-4 text-[10px] text-[#B07D54] font-bold tracking-widest">
                          <div>D</div><div>L</div><div>M</div><div>M</div><div>J</div><div>V</div><div>S</div>
                        </div>
                        <div className="grid grid-cols-7 gap-y-4 gap-x-2">
                          {days.map((day, i) => {
                            if (!day) return <div key={i}></div>;
                            
                            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                            const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                            const isPast = dateObj < today;
                            const isSelected = selection.fecha === dateStr;

                            return (
                              <button 
                                type="button" 
                                key={i} 
                                onClick={() => !isPast && setSelection({ ...selection, fecha: dateStr, hora: "" })}
                                disabled={isPast}
                                className={`aspect-square w-10 mx-auto rounded-full flex items-center justify-center text-sm transition-all
                                  ${isPast 
                                    ? 'text-stone-700 opacity-50 cursor-not-allowed' 
                                    : isSelected 
                                      ? 'bg-[#B07D54] text-[#161616] font-bold shadow-lg' 
                                      : 'text-stone-400 hover:text-white hover:bg-stone-800 font-light'}
                                `}>
                                {day}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      
                      {/* 🔥 MAGIA UX: LA FLECHITA REBOTANDO Y TEXTO MEJORADO 🔥 */}
                      <div className="md:hidden flex flex-col items-center justify-center pt-2 pb-6 animate-bounce text-[#B07D54] w-full border-t border-stone-800/50 mt-4">
                        <span className="text-[10px] uppercase tracking-widest font-bold mb-2">Desliza para ver horarios</span>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <polyline points="19 12 12 19 5 12"></polyline>
                        </svg>
                      </div>

                      <div className="flex-1 w-full flex flex-col">
                         <div className="mb-4">
                           <div className="text-[10px] text-stone-500 uppercase tracking-widest">Disponibilidad</div>
                           {totalMinutos > 0 && (
                             <div className="text-xs text-[#B07D54] mt-1">
                               Duración calculada: {formatDuracion(totalMinutos > 0 ? totalMinutos : 30)}
                             </div>
                           )}
                         </div>
                         
                         <div className="grid grid-cols-2 gap-3">
                           {slotsDelDia.length > 0 ? slotsDelDia.map((slot) => {
                              const isSelected = selection.hora === slot.horaTexto;
                              return (
                                <button 
                                  type="button"
                                  key={slot.horaTexto} 
                                  onClick={() => slot.disponible && setSelection({ ...selection, hora: slot.horaTexto })}
                                  disabled={!slot.disponible}
                                  className={`py-3 px-4 rounded-xl text-sm border font-medium transition-all tracking-wider
                                  ${!slot.disponible 
                                     ? 'bg-stone-900/50 text-stone-700 border-transparent cursor-not-allowed line-through' 
                                     : isSelected 
                                       ? 'border-[#B07D54] bg-[#B07D54]/20 text-[#B07D54] shadow-md' 
                                       : 'border-stone-800 text-stone-300 hover:border-[#B07D54] hover:text-[#B07D54] bg-[#1A1A1A]'}`}
                                >
                                  {slot.horaTexto}
                                </button>
                              );
                           }) : (
                             <div className="col-span-2 text-stone-500 text-sm text-center mt-10">
                               Selecciona una fecha para ver horarios disponibles.
                             </div>
                           )}
                         </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div className="animate-fade-in pb-8">
                    <div className="flex flex-col md:flex-row gap-8">
                      
                      <div className="flex-1">
                        <h2 className="text-3xl font-serif text-white mb-2">Tus Datos</h2>
                        <p className="text-stone-500 mb-6 font-light text-sm">Para continuar, ingresa tu información.</p>

                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <input type="text" value={selection.nombre} onChange={e => setSelection({...selection, nombre: e.target.value})} className="w-full bg-[#1A1A1A] border border-stone-800 rounded-xl p-3.5 text-sm text-white outline-none focus:border-[#B07D54] focus:ring-1 focus:ring-[#B07D54] transition-all placeholder:text-stone-600" placeholder="Nombre" />
                            </div>
                            <div>
                              <input type="text" value={selection.apellido} onChange={e => setSelection({...selection, apellido: e.target.value})} className="w-full bg-[#1A1A1A] border border-stone-800 rounded-xl p-3.5 text-sm text-white outline-none focus:border-[#B07D54] focus:ring-1 focus:ring-[#B07D54] transition-all placeholder:text-stone-600" placeholder="Apellido" />
                            </div>
                          </div>
                          <div>
                            <input type="tel" value={selection.celular} onChange={e => setSelection({...selection, celular: e.target.value})} className="w-full bg-[#1A1A1A] border border-stone-800 rounded-xl p-3.5 text-sm text-white outline-none focus:border-[#B07D54] focus:ring-1 focus:ring-[#B07D54] transition-all placeholder:text-stone-600" placeholder="WhatsApp (Obligatorio)" />
                          </div>
                          <div>
                            <input type="email" value={selection.correo} onChange={e => setSelection({...selection, correo: e.target.value})} className="w-full bg-[#1A1A1A] border border-stone-800 rounded-xl p-3.5 text-sm text-white outline-none focus:border-[#B07D54] focus:ring-1 focus:ring-[#B07D54] transition-all placeholder:text-stone-600" placeholder="Correo Electrónico (Opcional)" />
                          </div>
                          
                          <label className="flex items-start gap-3 mt-4 cursor-pointer group pb-2">
                            <div className="relative flex items-start">
                              <input type="checkbox" checked={selection.aceptaPromociones} onChange={e => setSelection({...selection, aceptaPromociones: e.target.checked})} className="peer mt-1 w-5 h-5 appearance-none border border-stone-600 bg-[#1A1A1A] rounded checked:bg-[#B07D54] checked:border-[#B07D54] transition-colors cursor-pointer" />
                              <svg className="absolute top-[6px] left-[3px] w-3.5 h-3.5 pointer-events-none stroke-[#161616] opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 14 14" fill="none"><path d="M2 7L5.5 10.5L12 3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </div>
                            <span className="text-xs text-stone-500 leading-relaxed font-light group-hover:text-stone-300 transition-colors mt-1">
                              Autorizo el uso de mis datos para recibir confirmaciones, recordatorios de mi cita y promociones exclusivas.
                            </span>
                          </label>
                        </div>
                      </div>

                      <div className="w-full md:w-[280px] shrink-0">
                        <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-stone-800 sticky top-0">
                          <h4 className="font-serif text-[#B07D54] text-lg mb-4 border-b border-stone-800 pb-2">Resumen</h4>
                          
                          <div className="space-y-4 mb-6">
                            <div>
                              <p className="text-[10px] uppercase tracking-widest text-stone-500 mb-1">Fecha y Hora</p>
                              <p className="text-sm text-white font-medium">{formatearFechaLegible(selection.fecha)}</p>
                              <p className="text-sm text-white font-medium">{selection.hora}</p>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase tracking-widest text-stone-500 mb-1">Especialista & Ubicación</p>
                              <p className="text-sm text-white">{selection.barbero?.nombre}</p>
                              <p className="text-xs text-stone-400">{selection.sede?.nombre}</p>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase tracking-widest text-stone-500 mb-1">Servicios ({selection.servicios.length})</p>
                              <ul className="text-sm text-white space-y-1">
                                {selection.servicios.map(s => (
                                  <li key={s.id} className="flex justify-between">
                                    <span className="truncate pr-2">{s.nombre}</span>
                                    <span className="text-stone-400">S/{s.precio}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="border-t border-stone-800 pt-4 flex justify-between items-end">
                            <span className="text-[10px] uppercase tracking-widest text-stone-500">Total a Pagar</span>
                            <span className="text-[#B07D54] text-2xl font-serif tracking-wide">
                              S/ {montoTotal}
                            </span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {step === 6 && (
                  <div className="animate-fade-in pb-8">
                    <h2 className="text-3xl font-serif text-white mb-2 text-center md:text-left">Confirma tu Reserva</h2>
                    <p className="text-stone-500 mb-8 font-light text-sm text-center md:text-left">Asegura tu cita con un pago anticipado o paga en el local.</p>

                    {!paymentMethod ? (
                      <div className="flex flex-col gap-4 max-w-md mx-auto mt-6">
                        
                        <button
                          disabled
                          className="w-full bg-[#1a1a1a] text-stone-600 p-6 rounded-2xl border border-stone-800 cursor-not-allowed flex flex-col items-center gap-2"
                        >
                          <div className="flex items-center gap-2 opacity-50">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.64-2.25 1.64-1.74 0-2.26-.95-2.32-1.81H7.84c.09 1.74 1.25 2.91 3.06 3.28V20h2.34v-1.66c1.63-.3 2.98-1.46 2.98-3.08 0-2.19-1.83-2.99-3.91-3.46z"/>
                            </svg>
                            <span className="text-lg font-bold uppercase tracking-widest">Pago con Yape</span>
                          </div>
                          <span className="text-xs font-medium bg-black/40 px-3 py-1 rounded-full">(Próximamente)</span>
                        </button>

                        <button
                          onClick={() => handleSubmit(false)}
                          disabled={isSubmitting}
                          className="w-full bg-[#1A1A1A] border border-stone-800 text-white p-6 rounded-2xl hover:border-stone-600 transition-colors flex flex-col items-center gap-2"
                        >
                          {isSubmitting ? (
                            <span className="text-sm font-bold uppercase tracking-widest">Procesando...</span>
                          ) : (
                            <>
                              <span className="text-sm font-bold uppercase tracking-widest text-[#B07D54]">Finalizar Reserva</span>
                              <span className="text-xs font-light text-stone-500">Pagaré todo en el local</span>
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center max-w-md mx-auto bg-[#1A1A1A] border border-stone-800 rounded-3xl p-8 text-center shadow-xl">
                        <div className="w-16 h-16 bg-[#742284]/20 text-[#742284] rounded-full flex items-center justify-center mb-4 border border-[#742284]/30">
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M19 5H5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3zm-9 9a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"></path></svg>
                        </div>
                        <h3 className="text-2xl font-serif text-white mb-2">Yapea a tu Sede</h3>
                        <p className="text-stone-400 text-sm mb-6">Escanea el código QR o envía directamente al número.</p>

                        <div className="bg-white p-4 rounded-2xl mb-6 shadow-inner">
                          <img 
                            src={qrsSedes[selection.sede.nombre] || "/qr-default.png"} 
                            alt={`QR Yape ${selection.sede.nombre}`} 
                            className="w-48 h-48 object-contain rounded-lg" 
                          />
                        </div>

                        <div className="text-stone-400 text-xs uppercase tracking-widest mb-1">Monto a Yapear</div>
                        <div className="text-3xl text-[#B07D54] font-bold tracking-widest mb-4">
                          S/ {montoTotal}
                        </div>
                        
                        <div className="bg-[#161616] border border-stone-800 px-6 py-3 rounded-xl mb-8 flex flex-col items-center">
                          <span className="text-stone-500 text-[10px] uppercase tracking-widest">Número de Sede</span>
                          <span className="text-white font-medium text-lg tracking-widest">{telefonosSedes[selection.sede.nombre]}</span>
                        </div>

                        <button
                           onClick={() => handleSubmit(true)}
                           disabled={isSubmitting}
                           className="w-full py-4 px-4 rounded-full font-bold text-xs uppercase tracking-widest bg-[#25D366] text-white hover:bg-[#1EBE5D] transition-colors shadow-[0_0_20px_rgba(37,211,102,0.2)] flex items-center justify-center gap-2 md:gap-3 disabled:opacity-50"
                           >
                         {isSubmitting ? 'Procesando...' : (
                           <>
                         <span className="text-center leading-tight">Enviar Captura por WhatsApp</span>
                           <svg className="shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.463 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                           </>
                         )}
                     </button>
                      </div>
                    )}
                  </div>
                )}

                {step === 7 && (
                  <div className="animate-fade-in text-center flex flex-col items-center justify-center w-full">
                    <div className="w-24 h-24 bg-transparent border-2 border-[#B07D54] text-[#B07D54] rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(176,125,84,0.2)]">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    
                    <h2 className="text-4xl font-serif text-white mb-4 uppercase tracking-widest">Confirmado</h2>
                    
                    <p className="text-stone-400 mb-6 max-w-sm text-sm font-light leading-relaxed">
                      Tu cita en <span className="text-white font-medium">{selection.sede.nombre}</span> con <span className="text-[#B07D54] font-medium">{selection.barbero.nombre}</span> está agendada para el <span className="text-white font-medium">{selection.fecha}</span> a las <span className="text-white font-medium">{selection.hora}</span>.
                    </p>

                    <div className="bg-emerald-950/20 border border-emerald-900/30 p-4 rounded-xl mb-8 w-full max-w-sm">
                      <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
                        ✅ Reserva registrada
                      </p>
                      <p className="text-stone-400 text-xs leading-relaxed">
                        Ya estás en nuestro sistema. Usa el botón inferior <strong className="text-white font-medium">solo si deseas</strong> enviarnos un mensaje extra.
                      </p>
                    </div>
                    
                    <div className="flex flex-col w-full max-w-sm gap-4">
                      {paymentMethod !== 'yape' && (
                        <button type="button" onClick={() => sendToWhatsApp(false)} className="w-full py-4 rounded-full font-bold text-xs uppercase tracking-widest bg-[#25D366] text-white hover:bg-[#1EBE5D] transition-colors shadow-lg flex items-center justify-center gap-3">
                          <span>Notificar por WhatsApp</span>
                          <svg className="shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.463 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                        </button>
                      )}
                      
                      <button type="button" onClick={onClose} className="w-full py-4 rounded-full font-bold text-xs uppercase tracking-widest border border-stone-800 text-stone-400 hover:text-white hover:border-stone-600 transition-colors">
                        Volver al inicio
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {step < 7 && (
            <div className="p-6 md:px-10 md:py-6 border-t border-stone-800 bg-[#121212] flex justify-between items-center shrink-0">
              {step > 1 ? (
                <button type="button" onClick={handleBack} disabled={isSubmitting} className="text-stone-500 hover:text-white font-sans text-[10px] uppercase tracking-[0.2em] transition-colors pb-1 border-b border-transparent hover:border-white">
                  ← Regresar
                </button>
              ) : <div></div>}

              {step < 5 && (
                <button 
                  type="button"
                  onClick={handleNext}
                  disabled={(step === 1 && !selection.sede) || (step === 2 && !selection.barbero) || (step === 3 && selection.servicios.length === 0) || (step === 4 && (!selection.fecha || !selection.hora))}
                  className="bg-transparent border border-[#B07D54] text-[#B07D54] px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-[#B07D54] hover:text-[#161616] transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#B07D54]"
                >
                  Continuar
                </button>
              )}

              {step === 5 && (
                 <button 
                  type="button"
                  onClick={handleNext}
                  disabled={!selection.nombre || !selection.apellido || !selection.celular}
                  className="bg-[#B07D54] text-[#161616] px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-[#c48e62] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(176,125,84,0.3)]"
                 >
                   Continuar
                 </button>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}