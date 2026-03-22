"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase"; // Configuración del cliente BD

export default function BookingModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  // Control de flujo de la UI
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Catálogos recuperados de Supabase
  const [sedesDB, setSedesDB] = useState<any[]>([]);
  const [barberosDB, setBarberosDB] = useState<any[]>([]);
  const [serviciosDB, setServiciosDB] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [horasOcupadas, setHorasOcupadas] = useState<string[]>([]);
  
  // Objeto de la reserva activa
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

  // Utilidades de formato y cálculo de tiempo
  const totalMinutos = selection.servicios.reduce((sum, s) => sum + (s.duracion_minutos || 0), 0);

  const formatDuracion = (mins: number) => {
    if (mins >= 60) {
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      return m > 0 ? `${h}h ${m}m` : `${h}h`;
    }
    return `${mins}m`;
  };

  // Inicialización: Cargar catálogos al montar el modal
  useEffect(() => {
    const loadData = async () => {
      setIsLoadingData(true);
      const [resSedes, resBarberos, resServicios] = await Promise.all([
        supabase.from('sedes').select('*'),
        supabase.from('barberos').select('*'),
        supabase.from('servicios').select('*')
      ]);

      if (resSedes.data) setSedesDB(resSedes.data);
      if (resBarberos.data) setBarberosDB(resBarberos.data);
      if (resServicios.data) setServiciosDB(resServicios.data);
      setIsLoadingData(false);
    };

    if (isOpen) {
      loadData();
    } else {
      // Limpieza de estados on unmount
      setStep(1);
      setSelection({ sede: null, barbero: null, servicios: [], fecha: "", hora: "", nombre: "", apellido: "", celular: "", correo: "", aceptaPromociones: false });
    }
  }, [isOpen]);

  // Consulta de disponibilidad por barbero y fecha
  useEffect(() => {
    const cargarHorasOcupadas = async () => {
      if (!selection.barbero || !selection.fecha) {
        setHorasOcupadas([]);
        return;
      }

      const { data, error } = await supabase
        .from('citas')
        .select('fecha_hora')
        .eq('barbero_id', selection.barbero.id);

      if (data) {
        const ocupadas = data.map(cita => {
          const dateStr = cita.fecha_hora.split('T')[0]; 
          
          if (dateStr === selection.fecha) {
            // Conversión UTC a local y formato 12h
            const dateObj = new Date(cita.fecha_hora);
            let hours = dateObj.getUTCHours() - 5; 
            if (hours < 0) hours += 24;
            
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12;
            return `${hours}:00 ${ampm}`;
          }
          return null;
        }).filter(Boolean);

        setHorasOcupadas(ocupadas as string[]);
      }
    };

    cargarHorasOcupadas();
  }, [selection.barbero, selection.fecha]);

  if (!isOpen) return null;

  const horarios = ["10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"];
  const stepsList = ["Ubicación", "Personal", "Servicios", "Fecha y Hora", "Tus Datos"];

  // Filtro relacional
  const barberosFiltrados = selection.sede 
    ? barberosDB.filter(b => b.sede_id === selection.sede.id)
    : [];

  // Handler múltiple para array de servicios
  const toggleServicio = (servicio: any) => {
    const existe = selection.servicios.find(s => s.id === servicio.id);
    if (existe) {
      setSelection({ ...selection, servicios: selection.servicios.filter(s => s.id !== servicio.id) });
    } else {
      setSelection({ ...selection, servicios: [...selection.servicios, servicio] });
    }
  };

  // Generación de matriz del calendario
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

  const handleNext = () => { if (step < 5) setStep(step + 1); };
  const handleBack = () => { if (step > 1) setStep(step - 1); };

  // Submit principal
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Parseo de fecha a ISO String
      const [year, month, day] = selection.fecha.split('-');
      const timeMatch = selection.hora.match(/(\d+):(\d+) (AM|PM)/);
      let hours = parseInt(timeMatch![1]);
      if (timeMatch![3] === 'PM' && hours !== 12) hours += 12;
      if (timeMatch![3] === 'AM' && hours === 12) hours = 0;
      const isoDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), hours, parseInt(timeMatch![2])).toISOString();

      // Insert de cabecera
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
          acepta_promociones: selection.aceptaPromociones
        })
        .select()
        .single();

      if (errorCita) throw errorCita;

      // Insert de detalle (N a M)
      const relacionesServicios = selection.servicios.map(srv => ({
        cita_id: nuevaCita.id,
        servicio_id: srv.id
      }));

      const { error: errorServicios } = await supabase
        .from('cita_servicios')
        .insert(relacionesServicios);

      if (errorServicios) throw errorServicios;

      setStep(6);

    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Hubo un problema al procesar tu reserva. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fallback API externa
  const sendToWhatsApp = () => {
    const serviciosNombres = selection.servicios.map(s => s.nombre).join(', ');
    const total = selection.servicios.reduce((sum, s) => sum + Number(s.precio), 0);
    const text = `Hola Markus, mi reserva está confirmada en la web:%0A👤 Nombre: ${selection.nombre} ${selection.apellido}%0A📍 Sede: ${selection.sede.nombre}%0A✂️ Barbero: ${selection.barbero.nombre}%0A💈 Servicios: ${serviciosNombres} (Total: S/${total})%0A📅 Fecha: ${selection.fecha} a las ${selection.hora}`;
    window.open(`https://wa.me/51917876813?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div onClick={step === 6 ? onClose : undefined} className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"></div>

      <div className={`relative flex w-full transition-all duration-500 ease-in-out rounded-xl shadow-2xl overflow-hidden bg-white ${step === 6 ? 'max-w-md h-auto min-h-[450px]' : 'max-w-5xl h-[600px] max-h-[90vh]'}`}>
        
        {step < 6 && (
          <div className="w-1/3 md:w-1/4 bg-neutral-900 text-white p-8 hidden md:block relative">
            <div className="mb-10">
              <h3 className="font-heading text-2xl font-bold tracking-tighter">MARKUS</h3>
            </div>
            
            <ul className="space-y-8">
              {stepsList.map((label, idx) => (
                <li key={idx} className={`flex items-center gap-4 text-sm font-medium transition-all ${step === idx + 1 ? 'text-white' : 'text-neutral-500'}`}>
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${step === idx + 1 ? 'bg-white text-black border-white' : 'border-neutral-700 bg-transparent text-neutral-500'}`}>
                    {idx + 1}
                  </span>
                  <span>{label}</span>
                </li>
              ))}
            </ul>
            
            <div className="absolute bottom-8 left-8 text-neutral-600 text-xs">
              © 2026 Markus Barber
            </div>
          </div>
        )}

        <div className={`flex-1 bg-white text-black p-8 md:p-10 flex flex-col overflow-y-auto relative ${step === 6 ? 'items-center justify-center' : ''}`}>
          
          {step < 6 && <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors font-bold text-xl">✕</button>}

          {isLoadingData ? (
            <div className="flex-1 flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
          ) : (
            <div className="flex-1 max-w-2xl mx-auto w-full pt-4 flex flex-col h-full">
              
              {step === 1 && (
                <div className="animate-fade-in">
                  <h2 className="text-3xl font-bold mb-2 text-black">Selecciona una sede</h2>
                  <p className="text-gray-500 mb-8">Elige dónde quieres vivir la experiencia.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sedesDB.map((sede) => (
                      <button key={sede.id} onClick={() => setSelection({ ...selection, sede, barbero: null })} 
                        className={`p-6 rounded-xl border-2 text-left transition-all hover:shadow-lg group
                        ${selection.sede?.id === sede.id ? 'border-black bg-neutral-50 shadow-md' : 'border-gray-100 bg-white hover:border-gray-300'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 ${selection.sede?.id === sede.id ? 'bg-black text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'}`}>📍</div>
                        <span className="block font-bold text-lg">{sede.nombre}</span>
                        <span className="text-sm text-gray-400">Lima, Perú</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="animate-fade-in">
                  <h2 className="text-3xl font-bold mb-2 text-black">Elige a tu barbero</h2>
                  <p className="text-gray-500 mb-8">Profesionales expertos en {selection.sede?.nombre}.</p>
                  
                  {barberosFiltrados.length === 0 ? (
                     <p className="text-red-500">No hay barberos asignados a esta sede todavía.</p>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {barberosFiltrados.map((barbero) => (
                        <button key={barbero.id} onClick={() => setSelection({ ...selection, barbero })} 
                          className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-3 transition-all hover:shadow-md
                          ${selection.barbero?.id === barbero.id ? 'border-black bg-neutral-50' : 'border-gray-100 bg-white hover:border-gray-300'}`}>
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold ${selection.barbero?.id === barbero.id ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>
                            {barbero.nombre.charAt(0)}
                          </div>
                          <span className="font-bold text-sm">{barbero.nombre}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="animate-fade-in">
                  <h2 className="text-3xl font-bold mb-2 text-black">Servicios</h2>
                  <p className="text-gray-500 mb-8">Puedes seleccionar más de uno.</p>
                  <div className="space-y-3 h-[350px] overflow-y-auto pr-2">
                    {serviciosDB.map((servicio) => {
                      const isSelected = selection.servicios.some(s => s.id === servicio.id);
                      return (
                        <button key={servicio.id} onClick={() => toggleServicio(servicio)} 
                          className={`w-full p-5 rounded-xl border-2 text-left flex justify-between items-center transition-all hover:shadow-md
                          ${isSelected ? 'border-black bg-neutral-50' : 'border-gray-100 bg-white hover:border-gray-300'}`}>
                          <div className="flex flex-col">
                            <span className="font-bold text-lg">{servicio.nombre}</span>
                            <span className="text-gray-500 text-sm mt-1 font-medium">S/ {servicio.precio}</span>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${isSelected ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'}`}>
                              {formatDuracion(servicio.duracion_minutos)}
                            </span>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-black bg-black' : 'border-gray-300'}`}>
                               {isSelected && <span className="text-white text-xs">✓</span>}
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="animate-fade-in h-full flex flex-col">
                  <h2 className="text-3xl font-bold mb-6 text-black">Fecha y Hora</h2>
                  <div className="flex flex-col md:flex-row gap-8 h-full">
                    <div className="flex-1">
                      <div className="text-center mb-4 font-bold text-lg uppercase tracking-wider border-b pb-2">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                      </div>
                      <div className="grid grid-cols-7 text-center mb-2 text-xs text-gray-400 font-bold">
                        <div>D</div><div>L</div><div>M</div><div>M</div><div>J</div><div>V</div><div>S</div>
                      </div>
                      <div className="grid grid-cols-7 gap-2">
                        {days.map((day, i) => {
                          if (!day) return <div key={i}></div>;
                          const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                          const isSelected = selection.fecha === dateStr;
                          return (
                            <button key={i} onClick={() => setSelection({ ...selection, fecha: dateStr, hora: "" })}
                              className={`aspect-square rounded-full flex items-center justify-center text-sm font-medium transition-all
                                ${isSelected ? 'bg-black text-white shadow-lg transform scale-110' : 'text-gray-600 hover:bg-gray-100'}
                              `}>
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div className="flex-1 border-l pl-0 md:pl-8 overflow-y-auto">
                       <div className="mb-4">
                         <div className="text-sm font-bold text-gray-400 uppercase">Horarios con {selection.barbero?.nombre}</div>
                         {totalMinutos > 0 && (
                           <div className="text-xs text-black font-medium mt-1 bg-gray-100 inline-block px-2 py-1 rounded">
                             Tiempo estimado de tu cita: {formatDuracion(totalMinutos)}
                           </div>
                         )}
                       </div>
                       <div className="grid grid-cols-2 gap-3">
                          {horarios.map((hora) => {
                             const estaOcupada = horasOcupadas.includes(hora);
                             return (
                               <button 
                                 key={hora} 
                                 onClick={() => !estaOcupada && setSelection({ ...selection, hora })}
                                 disabled={estaOcupada}
                                 className={`py-2 px-4 rounded-lg text-sm border font-medium transition-all
                                 ${estaOcupada 
                                    ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed line-through' 
                                    : selection.hora === hora 
                                      ? 'border-black bg-black text-white shadow-md' 
                                      : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}
                               >
                                 {hora}
                               </button>
                             );
                          })}
                       </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="animate-fade-in">
                  <h2 className="text-3xl font-bold mb-2 text-black">Tus Datos</h2>
                  <p className="text-gray-500 mb-6">Casi listos para tu cambio de look.</p>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nombre</label>
                        <input type="text" value={selection.nombre} onChange={e => setSelection({...selection, nombre: e.target.value})} className="w-full border-2 border-gray-100 rounded-lg p-3 outline-none focus:border-black transition-colors" placeholder="Tu nombre" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Apellido</label>
                        <input type="text" value={selection.apellido} onChange={e => setSelection({...selection, apellido: e.target.value})} className="w-full border-2 border-gray-100 rounded-lg p-3 outline-none focus:border-black transition-colors" placeholder="Tu apellido" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Celular / WhatsApp</label>
                      <input type="tel" value={selection.celular} onChange={e => setSelection({...selection, celular: e.target.value})} className="w-full border-2 border-gray-100 rounded-lg p-3 outline-none focus:border-black transition-colors" placeholder="987654321" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Correo Electrónico (Opcional)</label>
                      <input type="email" value={selection.correo} onChange={e => setSelection({...selection, correo: e.target.value})} className="w-full border-2 border-gray-100 rounded-lg p-3 outline-none focus:border-black transition-colors" placeholder="ejemplo@correo.com" />
                    </div>
                    
                    <label className="flex items-start gap-3 mt-4 cursor-pointer group">
                      <input type="checkbox" checked={selection.aceptaPromociones} onChange={e => setSelection({...selection, aceptaPromociones: e.target.checked})} className="mt-1 w-5 h-5 accent-black cursor-pointer" />
                      <span className="text-sm text-gray-600 group-hover:text-black transition-colors">
                        Acepto recibir promociones, descuentos exclusivos y recordatorios de Markus Barbería.
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {step === 6 && (
                <div className="animate-fade-in text-center flex flex-col items-center justify-center h-full">
                  <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-5xl mb-6 shadow-lg">
                    ✓
                  </div>
                  <h2 className="text-4xl font-bold mb-4 text-black">¡Reserva Exitosa!</h2>
                  <p className="text-gray-500 mb-8 max-w-md">
                    Tu cita con <span className="font-bold text-black">{selection.barbero.nombre}</span> el <span className="font-bold text-black">{selection.fecha}</span> a las <span className="font-bold text-black">{selection.hora}</span> ha sido guardada en nuestro sistema.
                  </p>
                  
                  <div className="flex gap-4">
                    <button onClick={onClose} className="px-8 py-3 rounded-full font-bold text-sm bg-gray-100 text-black hover:bg-gray-200 transition-all">
                      Volver al inicio
                    </button>
                    <button onClick={sendToWhatsApp} className="px-8 py-3 rounded-full font-bold text-sm bg-green-500 text-white hover:bg-green-600 transition-all shadow-lg flex items-center gap-2">
                      Enviar a WhatsApp 📱
                    </button>
                  </div>
                </div>
              )}

              {step < 6 && (
                <div className="mt-auto pt-6 border-t border-gray-100 flex justify-between items-center">
                  {step > 1 ? (
                    <button onClick={handleBack} disabled={isSubmitting} className="text-gray-500 hover:text-black font-medium text-sm px-4">Atrás</button>
                  ) : <div></div>}

                  {step < 5 ? (
                    <button 
                      onClick={handleNext}
                      disabled={(step === 1 && !selection.sede) || (step === 2 && !selection.barbero) || (step === 3 && selection.servicios.length === 0) || (step === 4 && (!selection.fecha || !selection.hora))}
                      className="bg-black text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:shadow-none"
                    >
                      Siguiente
                    </button>
                  ) : (
                    <button 
                      onClick={handleSubmit}
                      disabled={!selection.nombre || !selection.apellido || !selection.celular || isSubmitting}
                      className="bg-black text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-gray-800 transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Procesando...' : 'Confirmar Reserva'}
                    </button>
                  )}
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
}