"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

export default function ReservaManualModal({ isOpen, onClose, sedes, barberos, cargarDatos, userProfile }: any) {
  const [serviciosDB, setServiciosDB] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estados de Interfaz Premium
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState(""); 

  // Estados del Formulario
  const [sedeId, setSedeId] = useState("");
  const [barberoId, setBarberoId] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [clienteNombre, setClienteNombre] = useState("");
  const [clienteCelular, setClienteCelular] = useState("");
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState<number[]>([]);

  const [citasDelBarbero, setCitasDelBarbero] = useState<any[]>([]);

  const getTodayString = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  };

  useEffect(() => {
    if (isOpen) {
      setShowSuccess(false); 
      setErrorMsg("");
      setFecha(getTodayString()); 
      
      if (userProfile?.tipo === "sede") {
        setSedeId(userProfile.refId.toString());
      }

      const fetchServicios = async () => {
        const { data } = await supabase.from('servicios').select('*').order('id', { ascending: true });
        if (data) setServiciosDB(data);
      };
      fetchServicios();
    } else {
      setSedeId(""); setBarberoId(""); setFecha(""); setHora(""); 
      setClienteNombre(""); setClienteCelular(""); setServiciosSeleccionados([]);
      setCitasDelBarbero([]);
      setShowSuccess(false);
      setErrorMsg("");
    }
  }, [isOpen, userProfile]);

  useEffect(() => {
    const fetchCitasBarbero = async () => {
      if (barberoId && fecha) {
        const { data } = await supabase
          .from('citas')
          .select('fecha_hora, duracion_total_minutos')
          .eq('barbero_id', barberoId)
          .neq('estado', 'cancelada');
        
        if (data) {
          const citasDelDia = data.filter(c => c.fecha_hora.startsWith(fecha));
          setCitasDelBarbero(citasDelDia);
        }
      } else {
        setCitasDelBarbero([]);
      }
    };
    fetchCitasBarbero();
  }, [barberoId, fecha]);

  const generarOpcionesHora = () => {
    const opciones = [];
    const now = new Date();
    const isToday = fecha === getTodayString();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    for (let i = 8; i <= 22; i++) {
      for (let j = 0; j < 60; j += 30) {
        const optionMinutes = i * 60 + j;

        if (isToday && optionMinutes <= currentMinutes) continue;

        let estaOcupado = false;
        citasDelBarbero.forEach(cita => {
          const citaDate = new Date(cita.fecha_hora);
          const inicioCitaMin = citaDate.getHours() * 60 + citaDate.getMinutes();
          const finCitaMin = inicioCitaMin + (cita.duracion_total_minutos || 30);
          
          if (optionMinutes >= inicioCitaMin && optionMinutes < finCitaMin) {
            estaOcupado = true;
          }
        });

        if (estaOcupado) continue; 

        const hora24 = i.toString().padStart(2, '0');
        const min = j.toString().padStart(2, '0');
        const ampm = i >= 12 ? 'PM' : 'AM';
        const hora12 = i > 12 ? i - 12 : (i === 0 ? 12 : i);
        const hora12Str = hora12.toString().padStart(2, '0');
        opciones.push({ value: `${hora24}:${min}`, label: `${hora12Str}:${min} ${ampm}` });
      }
    }
    return opciones;
  };

  const toggleServicio = (id: number) => {
    setServiciosSeleccionados(prev => 
      prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]
    );
  };

  const barberosDeSede = barberos.filter((b: any) => b.sede_id?.toString() === sedeId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sedeId || !barberoId || !fecha || !hora || !clienteNombre || serviciosSeleccionados.length === 0) {
      setErrorMsg("Por favor completa todos los campos y selecciona al menos un servicio.");
      return;
    }

    setIsSubmitting(true);
    try {
      let montoTotal = 0;
      let duracionTotal = 0;
      serviciosSeleccionados.forEach(id => {
        const srv = serviciosDB.find(s => s.id === id);
        if (srv) {
          montoTotal += Number(srv.precio);
          duracionTotal += Number(srv.duracion_minutos);
        }
      });

      const isoDate = new Date(`${fecha}T${hora}:00`);
      const isoDateString = isoDate.toISOString();

      const inicioMinNuevo = isoDate.getHours() * 60 + isoDate.getMinutes();
      const finMinNuevo = inicioMinNuevo + duracionTotal;

      const hayChoque = citasDelBarbero.some(cita => {
        const citaDate = new Date(cita.fecha_hora);
        const inicioExistente = citaDate.getHours() * 60 + citaDate.getMinutes();
        const finExistente = inicioExistente + (cita.duracion_total_minutos || 30);
        return (inicioMinNuevo < finExistente) && (finMinNuevo > inicioExistente);
      });

      if (hayChoque) {
        setErrorMsg("El especialista acaba de recibir una reserva en este mismo horario. Por favor elige otra hora.");
        setIsSubmitting(false);
        return;
      }

      // Guardar cita
      const { data: nuevaCita, error: errorCita } = await supabase.from('citas').insert({
        sede_id: Number(sedeId),
        barbero_id: Number(barberoId),
        fecha_hora: isoDateString,
        cliente_nombre: clienteNombre,
        cliente_apellido: "", 
        cliente_celular: clienteCelular || "000000000",
        cliente_correo: "whatsapp@manual.com",
        acepta_promociones: false,
        estado: "Confirmada",
        duracion_total_minutos: duracionTotal,
        monto_total: montoTotal,
        monto_cobrado: 0,
        monto_adelantado: 0,
        metodo_pago: "WhatsApp",
        estado_pago: "pendiente"
      }).select().single();

      if (errorCita) throw errorCita;

      const relaciones = serviciosSeleccionados.map(srvId => ({
        cita_id: nuevaCita.id,
        servicio_id: srvId
      }));

      const { error: errorSrv } = await supabase.from('cita_servicios').insert(relaciones);
      if (errorSrv) throw errorSrv;

      // =========================================================
      // 🔥 NUEVO: DISPARAR EL CORREO A TRAVÉS DE RESEND 🔥
      // =========================================================
      try {
        // 1. Extraemos los nombres legibles de barbero y servicios para la plantilla
        const barberoSeleccionado = barberosDeSede.find((b: any) => b.id.toString() === barberoId);
        const nombresServicios = serviciosSeleccionados
          .map(id => serviciosDB.find(s => s.id === id)?.nombre)
          .filter(Boolean)
          .join(', ');

        // 2. Hacemos el llamado a tu API (Asegúrate de que la ruta sea correcta, asumo que es '/api/send')
        await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            barberoId: barberoId,
            barberoNombre: barberoSeleccionado?.nombre || 'Especialista',
            clienteNombre: `${clienteNombre} (Vía WhatsApp)`, // Agregamos "(Vía WhatsApp)" para que el barbero lo identifique
            fecha: fecha,
            hora: hora,
            servicios: nombresServicios,
            montoTotal: montoTotal
          })
        });
      } catch (emailError) {
        // Fallo silencioso: Si el correo falla, la cita igual está guardada. No rompemos la UI.
        console.error("Error silencioso: La cita se guardó pero el correo falló.", emailError);
      }
      // =========================================================

      cargarDatos(); 
      setShowSuccess(true); 
      setTimeout(() => {
        onClose(); 
      }, 2000);

    } catch (error: any) {
      console.error(error);
      setErrorMsg("Error del sistema: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  if (errorMsg) {
    return (
      <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
        <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 flex flex-col items-center text-center border-2 border-red-500/20">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          </div>
          <h3 className="font-serif text-2xl font-bold text-stone-800 mb-2 uppercase tracking-widest">Atención</h3>
          <p className="text-stone-500 text-sm font-medium mb-8 leading-relaxed">{errorMsg}</p>
          <button type="button" onClick={() => setErrorMsg("")} className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors">
            Entendido
          </button>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
        <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 flex flex-col items-center text-center border-2 border-[#25D366]/20">
          <div className="w-20 h-20 bg-[#25D366]/10 text-[#25D366] rounded-full flex items-center justify-center mb-6 shadow-inner animate-bounce">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <h3 className="font-serif text-2xl font-bold text-stone-800 mb-2 uppercase tracking-widest">¡Reserva Exitosa!</h3>
          <p className="text-stone-500 text-sm font-medium">El espacio ha sido bloqueado en la agenda.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        
        <div className="bg-[#25D366] p-5 md:p-6 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3 text-white">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.463 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
            <h2 className="font-serif text-xl md:text-2xl font-bold uppercase tracking-widest leading-none">Reserva WhatsApp</h2>
          </div>
          <button type="button" aria-label="Cerrar Modal" title="Cerrar" onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 overflow-y-auto flex-1 space-y-6 custom-scrollbar">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5">Sede</label>
              <select aria-label="Seleccionar Sede" disabled={userProfile?.tipo === "sede"} required value={sedeId} onChange={e => { setSedeId(e.target.value); setBarberoId(""); setHora(""); }} className="w-full border-2 border-stone-200 rounded-lg p-3 outline-none focus:border-[#25D366] text-sm font-medium bg-white disabled:bg-stone-100 disabled:text-stone-500">
                <option value="" disabled>Seleccione sede...</option>
                {sedes.map((s: any) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5">Especialista</label>
              <select aria-label="Seleccionar Barbero" required value={barberoId} onChange={e => { setBarberoId(e.target.value); setHora(""); }} disabled={!sedeId} className="w-full border-2 border-stone-200 rounded-lg p-3 outline-none focus:border-[#25D366] text-sm font-medium bg-white disabled:bg-stone-50 disabled:text-stone-400">
                <option value="" disabled>Seleccione barbero...</option>
                {barberosDeSede.map((b: any) => <option key={b.id} value={b.id}>{b.nombre}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5">Fecha</label>
              <input aria-label="Fecha de Reserva" type="date" required value={fecha} onChange={e => { setFecha(e.target.value); setHora(""); }} className="w-full border-2 border-stone-200 rounded-lg p-3 outline-none focus:border-[#25D366] text-sm" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5">Hora (Libres)</label>
              <select aria-label="Hora de Reserva" required value={hora} onChange={e => setHora(e.target.value)} disabled={!barberoId || !fecha} className="w-full border-2 border-stone-200 rounded-lg p-3 outline-none focus:border-[#25D366] text-sm font-medium bg-white disabled:bg-stone-50 disabled:text-stone-400">
                <option value="" disabled>{barberoId ? "Seleccione hora..." : "Seleccione barbero primero..."}</option>
                {generarOpcionesHora().map(op => <option key={op.value} value={op.value}>{op.label}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5">Nombre del Cliente</label>
              <input aria-label="Nombre del Cliente" type="text" required value={clienteNombre} onChange={e => setClienteNombre(e.target.value)} placeholder="Ej. Juan Pérez" className="w-full border-2 border-stone-200 rounded-lg p-3 outline-none focus:border-[#25D366] text-sm" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5">WhatsApp / Celular</label>
              <input aria-label="Celular del Cliente" type="tel" required value={clienteCelular} onChange={e => setClienteCelular(e.target.value)} placeholder="Ej. 987654321" className="w-full border-2 border-stone-200 rounded-lg p-3 outline-none focus:border-[#25D366] text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-3 border-t border-stone-200 pt-6">Servicios a realizar</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {serviciosDB.map(srv => (
                <label key={srv.id} className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${serviciosSeleccionados.includes(srv.id) ? 'border-[#25D366] bg-[#25D366]/5' : 'border-stone-200 hover:border-stone-300'}`}>
                  <input aria-label={`Seleccionar ${srv.nombre}`} type="checkbox" checked={serviciosSeleccionados.includes(srv.id)} onChange={() => toggleServicio(srv.id)} className="w-4 h-4 accent-[#25D366]" />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-stone-800">{srv.nombre}</span>
                    <span className="text-[10px] text-stone-500">S/ {srv.precio} • {srv.duracion_minutos} min</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </form>

        <div className="p-6 border-t border-stone-200 bg-stone-50 flex gap-4 shrink-0">
          <button type="button" onClick={onClose} disabled={isSubmitting} className="flex-1 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest text-stone-500 hover:bg-stone-200 transition-colors">Cancelar</button>
          <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="flex-1 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest bg-[#25D366] text-white hover:bg-[#1EBE5D] transition-colors shadow-lg disabled:opacity-50">
            {isSubmitting ? "Registrando..." : "Guardar Reserva"}
          </button>
        </div>

      </div>
    </div>
  );
}