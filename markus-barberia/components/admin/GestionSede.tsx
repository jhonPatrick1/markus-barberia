"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

export default function GestionSede({ citasRaw = [], barberos = [], userProfile, cargarDatos }: any) {
  const [localBarberos, setLocalBarberos] = useState<any[]>([]);
  
  // Estados Bloqueo
  const [bloqueoBarbero, setBloqueoBarbero] = useState("");
  const [bloqueoFecha, setBloqueoFecha] = useState("");
  const [bloqueoHora, setBloqueoHora] = useState("");
  const [bloqueoDuracion, setBloqueoDuracion] = useState("60");
  const [isBlocking, setIsBlocking] = useState(false);
  const [notificacion, setNotificacion] = useState(""); 

  useEffect(() => {
    if (userProfile.tipo === "sede") {
      setLocalBarberos(barberos.filter((b: any) => b.sede_id?.toString() === userProfile.refId.toString()));
    } else {
      setLocalBarberos(barberos);
    }
  }, [barberos, userProfile]);

  const generarOpcionesHora = () => {
    const opciones = [];
    for (let i = 8; i <= 22; i++) {
      for (let j = 0; j < 60; j += 30) {
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
  const opcionesHora = generarOpcionesHora();

  // Filtrar los bloqueos existentes (Solo los que NO están cancelados)
  const bloqueosActivos = citasRaw.filter((c: any) => c.cliente_nombre === "BLOQUEO" && c.estado !== "cancelada");

  const toggleBarbero = async (id: number, estadoActual: boolean) => {
    setLocalBarberos(prev => prev.map(b => b.id === id ? { ...b, activo: !estadoActual } : b));
    try {
      const { error } = await supabase.from('barberos').update({ activo: !estadoActual }).eq('id', id);
      if (error) throw error;
      cargarDatos();
    } catch (error) {
      console.error("Error al actualizar:", error);
      cargarDatos();
    }
  };

  const handleBloquearHorario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bloqueoBarbero || !bloqueoFecha || !bloqueoHora) return;
    setIsBlocking(true);
    try {
      const isoDate = new Date(`${bloqueoFecha}T${bloqueoHora}:00`).toISOString();
      const barberoSeleccionado = localBarberos.find(b => b.id.toString() === bloqueoBarbero);

      const { error } = await supabase.from('citas').insert({
        barbero_id: Number(bloqueoBarbero),
        sede_id: barberoSeleccionado.sede_id,
        fecha_hora: isoDate,
        cliente_nombre: "BLOQUEO",
        cliente_apellido: "INTERNO",
        cliente_celular: "000000000",
        cliente_correo: "admin@markus.com",
        acepta_promociones: false,
        estado: "Confirmada",
        duracion_total_minutos: Number(bloqueoDuracion),
        monto_cobrado: 0, monto_total: 0, monto_adelantado: 0,
        metodo_pago: "En Local", estado_pago: "pagado"
      });

      if (error) throw error;

      setNotificacion("Horario bloqueado correctamente.");
      setTimeout(() => setNotificacion(""), 4000);
      setBloqueoFecha(""); setBloqueoHora("");
      cargarDatos();
    } catch (error: any) {
      alert("Error al bloquear: " + error.message);
    } finally {
      setIsBlocking(false);
    }
  };

  // Lógica de Desbloqueo usando tu método de Soft-Delete
  const handleDesbloquear = async (id: number) => {
    try {
      const { error } = await supabase
        .from('citas')
        .update({ 
          estado: 'cancelada',
          fecha_hora: '1999-01-01T00:00:00.000Z' 
        })
        .eq('id', id);

      if (error) throw error;
      cargarDatos();
    } catch (error: any) {
      alert("Error al desbloquear.");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 relative">
      {notificacion && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-sm md:w-auto md:bottom-auto md:top-10 bg-[#161616] border border-emerald-900/50 shadow-[0_10px_40px_rgba(0,0,0,0.5)] text-emerald-400 px-6 py-4 rounded-2xl font-bold text-[11px] md:text-xs tracking-widest uppercase z-[200] flex items-center justify-center gap-3 animate-fade-in transition-all">
          <svg className="shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span className="text-center">{notificacion}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden flex flex-col h-[500px]">
          <div className="p-5 border-b border-stone-100 bg-stone-50">
            <h3 className="font-serif text-lg font-bold text-stone-800 uppercase tracking-wide">Control de Especialistas</h3>
            <p className="text-xs text-stone-500 font-medium">Habilita o inhabilita a tu personal en la web.</p>
          </div>
          <div className="p-5 flex-1 overflow-y-auto custom-scrollbar">
            <ul className="space-y-3">
              {localBarberos.map((barbero) => {
                const isActivo = barbero.activo !== false; 
                return (
                  <li key={barbero.id} className="flex justify-between items-center p-3 rounded-lg border border-stone-100 hover:bg-stone-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${isActivo ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-200 text-stone-500 grayscale'}`}>✂️</div>
                      <span className={`font-bold text-sm ${isActivo ? 'text-stone-800' : 'text-stone-400 line-through'}`}>{barbero.nombre}</span>
                    </div>
                    <button 
                      type="button"
                      onClick={() => toggleBarbero(barbero.id, isActivo)}
                      title={isActivo ? "Desactivar especialista" : "Activar especialista"}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isActivo ? 'bg-emerald-500' : 'bg-stone-300'}`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isActivo ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden flex flex-col h-[500px]">
          <div className="p-5 border-b border-stone-100 bg-stone-50">
            <h3 className="font-serif text-lg font-bold text-stone-800 uppercase tracking-wide">Bloqueo de Horarios</h3>
            <p className="text-xs text-stone-500 font-medium">Oculta almuerzos o permisos en la web.</p>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            <form onSubmit={handleBloquearHorario} className="space-y-5 mb-8">
              <div>
                <label htmlFor="id-barbero" className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5">Especialista</label>
                <select id="id-barbero" required value={bloqueoBarbero} onChange={(e) => setBloqueoBarbero(e.target.value)} className="w-full border-2 border-stone-200 rounded-lg p-3 outline-none focus:border-[#B07D54] transition-colors text-sm font-medium bg-white">
                  <option value="" disabled>Seleccione un barbero...</option>
                  {localBarberos.map(b => <option key={b.id} value={b.id}>{b.nombre}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="id-fecha" className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5">Fecha</label>
                  <input id="id-fecha" type="date" required value={bloqueoFecha} onChange={(e) => setBloqueoFecha(e.target.value)} className="w-full border-2 border-stone-200 rounded-lg p-3 outline-none focus:border-[#B07D54] transition-colors text-sm" />
                </div>
                <div>
                  <label htmlFor="id-hora" className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5">Hora Inicio (AM/PM)</label>
                  <select id="id-hora" required value={bloqueoHora} onChange={(e) => setBloqueoHora(e.target.value)} className="w-full border-2 border-stone-200 rounded-lg p-3 outline-none focus:border-[#B07D54] transition-colors text-sm font-medium bg-white">
                    <option value="" disabled>--:--</option>
                    {opcionesHora.map(op => <option key={op.value} value={op.value}>{op.label}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="id-duracion" className="block text-xs font-bold text-stone-500 uppercase tracking-widest mb-1.5">Duración</label>
                <select id="id-duracion" value={bloqueoDuracion} onChange={(e) => setBloqueoDuracion(e.target.value)} className="w-full border-2 border-stone-200 rounded-lg p-3 outline-none focus:border-[#B07D54] transition-colors text-sm font-medium bg-white">
                  <option value="30">30 Minutos (Break rápido)</option>
                  <option value="60">1 Hora (Almuerzo)</option>
                  <option value="90">1 Hora y media</option>
                  <option value="120">2 Horas</option>
                  <option value="180">3 Horas</option>
                  <option value="240">4 Horas (Medio Turno)</option>
                  <option value="300">5 Horas</option>
                  <option value="360">6 Horas</option>
                  <option value="420">7 Horas</option>
                  <option value="480">8 Horas (Día Completo)</option>
                </select>
              </div>

              <button type="submit" disabled={isBlocking || !bloqueoBarbero} className="w-full mt-2 py-3.5 rounded-lg font-bold text-xs uppercase tracking-widest bg-black text-white hover:bg-stone-800 disabled:bg-stone-300 disabled:cursor-not-allowed transition-colors shadow-md">
                {isBlocking ? "Bloqueando..." : "🔒 Generar Bloqueo"}
              </button>
            </form>

            <div className="border-t border-stone-200 pt-6">
              <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">Bloqueos Registrados</h4>
              {bloqueosActivos.length === 0 ? (
                <p className="text-stone-400 text-xs italic">No hay bloqueos activos.</p>
              ) : (
                <ul className="space-y-3">
                  {bloqueosActivos.map((bloq: any) => {
                    const fechaObj = new Date(bloq.fecha_hora ? bloq.fecha_hora.replace(' ', 'T') : '');
                    const barberoName = Array.isArray(bloq.barbero) ? bloq.barbero[0]?.nombre : bloq.barbero?.nombre;
                    return (
                      <li key={bloq.id} className="bg-stone-50 border border-stone-200 p-3 rounded-lg flex justify-between items-center">
                        <div>
                          <p className="text-xs font-bold text-stone-700">✂️ {barberoName}</p>
                          <p className="text-[10px] text-stone-500 mt-0.5">{fechaObj.toLocaleDateString()} - {fechaObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        </div>
                        <button onClick={() => handleDesbloquear(bloq.id)} className="text-[10px] uppercase font-bold tracking-widest bg-red-100 text-red-600 px-3 py-1.5 rounded hover:bg-red-500 hover:text-white transition-colors">
                          Desbloquear
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}