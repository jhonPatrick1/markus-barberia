"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import ChargeModal from "./ChargeModal";

export default function AgendaView({ citasRaw, sedes, userProfile, cargarDatos, onLogout }: any) {
  // === ESTADOS PARA MODALES ===
  const [citaACobrar, setCitaACobrar] = useState<any | null>(null);
  const [citaACancelar, setCitaACancelar] = useState<number | null>(null);
  const [isCanceling, setIsCanceling] = useState(false);

  // === ESTADOS PARA FECHA Y FILTROS ===
  const [filtroSedeMaster, setFiltroSedeMaster] = useState<string>("todas");
  
  const getLocalYYYYMMDD = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>(getLocalYYYYMMDD(new Date()));

  // === LÓGICA DE BASE DE DATOS ===
  const procesarCobro = async (citaId: number, monto: number, metodo: string) => {
    try {
      const { error } = await supabase.from('citas').update({ estado: 'completada', monto_cobrado: monto, metodo_pago: metodo }).eq('id', citaId);
      if (error) throw error;
      setCitaACobrar(null);
      cargarDatos();
    } catch (error) {
      alert("Error al procesar el cobro.");
    }
  };

  const ejecutarCancelacion = async () => {
    if (!citaACancelar) return;
    setIsCanceling(true);
    try {
      await supabase.from('cita_servicios').delete().eq('cita_id', citaACancelar);
      const { error } = await supabase.from('citas').delete().eq('id', citaACancelar);
      if (error) throw error;
      setCitaACancelar(null);
      cargarDatos();
    } catch (error) {
      setCitaACancelar(null);
      alert("Error al cancelar la cita.");
    } finally {
      setIsCanceling(false);
    }
  };

  // === NAVEGACIÓN ===
  const cambiarDia = (dias: number) => {
    const [year, month, day] = fechaSeleccionada.split('-').map(Number);
    setFechaSeleccionada(getLocalYYYYMMDD(new Date(year, month - 1, day + dias)));
  };
  const irAHoy = () => setFechaSeleccionada(getLocalYYYYMMDD(new Date()));

  // === FILTROS ===
  const citasFiltradas = citasRaw.filter((c: any) => {
    if (userProfile.tipo === "barbero") return c.barbero_id?.toString() === userProfile.refId.toString();
    if (userProfile.tipo === "sede") return c.sede_id?.toString() === userProfile.refId.toString();
    if (userProfile.tipo === "master" && filtroSedeMaster !== "todas") return c.sede_id?.toString() === filtroSedeMaster;
    return true;
  });
  const citasDelDia = citasFiltradas.filter((cita: any) => getLocalYYYYMMDD(new Date(cita.fecha_hora)) === fechaSeleccionada);

  const isBarbero = userProfile.tipo === "barbero";

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* MODALES */}
      {citaACobrar && <ChargeModal cita={citaACobrar} onClose={() => setCitaACobrar(null)} onConfirmarCobro={procesarCobro} />}
      {citaACancelar && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">¿Cancelar reserva?</h3>
            <p className="text-gray-500 text-sm mb-6">El horario volverá a estar disponible.</p>
            <div className="flex gap-3">
              <button onClick={() => setCitaACancelar(null)} disabled={isCanceling} className="flex-1 py-3 rounded-lg font-bold text-sm bg-gray-100 text-gray-700">No, mantener</button>
              <button onClick={ejecutarCancelacion} disabled={isCanceling} className="flex-1 py-3 rounded-lg font-bold text-sm bg-red-500 text-white">{isCanceling ? "Borrando..." : "Sí, cancelar"}</button>
            </div>
          </div>
        </div>
      )}

      {/* CABECERA EXCLUSIVA PARA BARBEROS (Ya que ellos no ven el Sidebar) */}
      {isBarbero && (
         <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-stone-200">
            <div>
              <h1 className="text-3xl font-bold font-serif tracking-tighter uppercase">MARKUS</h1>
              <p className="text-stone-500 text-sm mt-1 font-medium">Mi Agenda Personal</p>
            </div>
            <div className="flex gap-3">
              <button onClick={cargarDatos} className="text-stone-500 hover:text-black font-medium text-sm px-4 py-2 border border-stone-200 rounded-lg">🔄 Refrescar</button>
              <button onClick={onLogout} className="text-stone-500 hover:text-red-600 font-medium text-sm px-4 py-2 border border-stone-200 rounded-lg">Cerrar Sesión</button>
            </div>
         </div>
      )}

      {/* CONTROLES DE FECHA */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button onClick={() => cambiarDia(-1)} className="px-4 py-2 border border-stone-200 rounded-lg text-sm font-medium hover:bg-stone-50">◀ Anterior</button>
          <button onClick={irAHoy} className="px-4 py-2 bg-black text-white rounded-lg text-sm font-bold">Hoy</button>
          <button onClick={() => cambiarDia(1)} className="px-4 py-2 border border-stone-200 rounded-lg text-sm font-medium hover:bg-stone-50">Siguiente ▶</button>
        </div>
        <div className="flex items-center gap-4">
          {userProfile.tipo === "master" && (
            <select aria-label="Filtro Sede" value={filtroSedeMaster} onChange={(e) => setFiltroSedeMaster(e.target.value)} className="border-2 border-stone-200 rounded-lg p-2 text-sm outline-none cursor-pointer bg-white">
              <option value="todas">Todas las sedes</option>
              {sedes.map((sede: any) => <option key={sede.id} value={sede.id.toString()}>{sede.nombre}</option>)}
            </select>
          )}
          <input aria-label="Fecha" type="date" value={fechaSeleccionada} onChange={(e) => setFechaSeleccionada(e.target.value)} className="border-2 border-stone-200 rounded-lg p-2 text-sm outline-none cursor-pointer"/>
        </div>
      </div>

      {/* TABLA DE CITAS */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-stone-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-100 text-stone-500 text-xs uppercase tracking-wider border-b border-stone-200">
                <th className="p-4 font-bold">Hora</th>
                <th className="p-4 font-bold">Cliente</th>
                <th className="p-4 font-bold">Detalle</th>
                <th className="p-4 text-center font-bold">Estado / Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {citasDelDia.map((cita: any) => {
                const fechaLocal = new Date(cita.fecha_hora);
                return (
                  <tr key={cita.id} className={`transition-colors ${cita.estado === 'completada' ? 'bg-emerald-50/30' : 'hover:bg-stone-50'}`}>
                    <td className="p-4"><div className="font-bold text-black">{fechaLocal.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div></td>
                    <td className="p-4">
                      <div className="font-bold text-sm text-stone-900">{cita.cliente_nombre} {cita.cliente_apellido}</div>
                      <div className="text-xs text-stone-500">{cita.cliente_celular}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span className="bg-stone-100 px-2.5 py-1 rounded-md text-xs font-bold text-stone-700 border border-stone-200">✂️ {cita.barbero?.nombre}</span>
                        {userProfile.tipo === "master" && (
                          <span className="bg-blue-50 px-2.5 py-1 rounded-md text-xs font-bold text-blue-700 border border-blue-100 mt-1">📍 {cita.sede?.nombre}</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      {cita.estado === 'completada' ? (
                        <span className="text-emerald-600 font-bold text-xs uppercase tracking-widest bg-emerald-100 px-3 py-1.5 rounded-full inline-block">Cobrado (S/{cita.monto_cobrado})</span>
                      ) : (
                        <div className="flex justify-center gap-2 items-center">
                          {userProfile.tipo === "barbero" ? (
                            <button onClick={() => setCitaACobrar(cita)} className="text-white bg-black hover:bg-stone-800 px-6 py-2 rounded-lg text-xs font-bold transition-all shadow-sm">COBRAR</button>
                          ) : (
                            <>
                              <span className="text-amber-600 font-bold text-xs uppercase tracking-widest bg-amber-100 px-3 py-1.5 rounded-full inline-block">Pendiente</span>
                              <button onClick={() => setCitaACancelar(cita.id)} className="text-red-500 hover:text-white border border-red-200 hover:border-red-500 hover:bg-red-500 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm">Cancelar ✕</button>
                            </>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
              {citasDelDia.length === 0 && <tr><td colSpan={4} className="p-10 text-center text-stone-500 font-medium">No hay agenda para este día.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}