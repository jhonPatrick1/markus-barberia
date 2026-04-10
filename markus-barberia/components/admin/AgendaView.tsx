"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import ChargeModal from "./ChargeModal";

export default function AgendaView({ citasRaw, sedes, userProfile, cargarDatos, onLogout }: any) {
  // === ESTADOS PARA MODALES ===
  const [citaACobrar, setCitaACobrar] = useState<any | null>(null);
  const [citaACancelar, setCitaACancelar] = useState<number | null>(null);
  const [citaAVerificarPago, setCitaAVerificarPago] = useState<any | null>(null); 
  const [isCanceling, setIsCanceling] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // === ESTADOS PARA FINANZAS ===
  const [nuevoEstadoPago, setNuevoEstadoPago] = useState("adelantado");
  const [montoAdelantado, setMontoAdelantado] = useState("");

  const [filtroSedeMaster, setFiltroSedeMaster] = useState<string>("todas");
  
  const getLocalYYYYMMDD = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>(getLocalYYYYMMDD(new Date()));

  // === LÓGICA DE BASE DE DATOS ===
  const procesarCobro = async (citaId: number, montoEntregadoHoy: number, metodo: string) => {
    try {
      const citaActual = citasRaw.find((c: any) => c.id === citaId);
      const adelantoPrevio = Number(citaActual?.monto_adelantado || 0);
      const montoTotalReal = adelantoPrevio + montoEntregadoHoy;

      const { error } = await supabase.from('citas').update({ 
        estado: 'completada', 
        monto_cobrado: montoTotalReal, 
        metodo_pago: metodo,
        estado_pago: 'pagado'
      }).eq('id', citaId);
      
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

  const procesarVerificacionPago = async () => {
    if (!citaAVerificarPago) return;
    setIsVerifying(true);
    try {
      const { error } = await supabase.from('citas').update({ 
        estado_pago: nuevoEstadoPago, 
        monto_adelantado: Number(montoAdelantado) || 0 
      }).eq('id', citaAVerificarPago.id);
      
      if (error) throw error;
      setCitaAVerificarPago(null);
      cargarDatos();
    } catch (error) {
      alert("Error al verificar el pago.");
    } finally {
      setIsVerifying(false);
    }
  };

  const abrirModalVerificacion = (cita: any) => {
    setNuevoEstadoPago(cita.estado_pago === 'pendiente' ? 'adelantado' : cita.estado_pago);
    setMontoAdelantado(cita.monto_adelantado > 0 ? cita.monto_adelantado.toString() : "");
    setCitaAVerificarPago(cita);
  };

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
  
  const citasDelDia = citasFiltradas.filter((cita: any) => {
    if (!cita.fecha_hora) return false;
    const safeDateStr = cita.fecha_hora.replace(' ', 'T');
    return getLocalYYYYMMDD(new Date(safeDateStr)) === fechaSeleccionada;
  });
  
  const isBarbero = userProfile.tipo === "barbero";

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* MODALES EXISTENTES */}
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

      {/* NUEVO MODAL: VERIFICAR PAGO */}
      {citaAVerificarPago && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl max-w-sm w-full text-left">
            <h3 className="text-xl font-bold text-gray-900 mb-2 border-b pb-2">Verificar Pago</h3>
            <p className="text-gray-500 text-xs mb-4 uppercase tracking-widest font-bold">Cliente: {citaAVerificarPago.cliente_nombre}</p>
            
            <div className="space-y-4 mb-6">
              <div>
                <label htmlFor="estado-pago" className="block text-xs font-bold text-gray-500 uppercase mb-1">Estado del Pago</label>
                <select id="estado-pago" aria-label="Estado del Pago" value={nuevoEstadoPago} onChange={e => setNuevoEstadoPago(e.target.value)} className="w-full border-2 border-gray-200 rounded-lg p-2.5 outline-none font-medium text-sm">
                  <option value="pendiente">Pendiente</option>
                  <option value="adelantado">Adelanto Verificado (Yape/Plin)</option>
                  <option value="pagado">Pagado 100%</option>
                </select>
              </div>
              <div>
                <label htmlFor="monto-adelantado" className="block text-xs font-bold text-gray-500 uppercase mb-1">Monto Pagado (S/)</label>
                <input id="monto-adelantado" aria-label="Monto Adelantado" type="number" step="0.10" value={montoAdelantado} onChange={e => setMontoAdelantado(e.target.value)} placeholder="Ej. 20.00" className="w-full border-2 border-gray-200 rounded-lg p-2.5 outline-none font-medium text-sm" />
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setCitaAVerificarPago(null)} disabled={isVerifying} className="flex-1 py-3 rounded-lg font-bold text-sm bg-gray-100 text-gray-700">Cancelar</button>
              <button onClick={procesarVerificacionPago} disabled={isVerifying} className="flex-1 py-3 rounded-lg font-bold text-sm bg-emerald-500 text-white shadow-lg">{isVerifying ? "Guardando..." : "Guardar Pago"}</button>
            </div>
          </div>
        </div>
      )}

      {/* CABECERA EXCLUSIVA PARA BARBEROS */}
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
                <th className="p-4 font-bold">Detalle y Servicios</th>
                <th className="p-4 text-center font-bold">Estado / Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {citasDelDia.map((cita: any) => {
                const safeDateStr = cita.fecha_hora ? cita.fecha_hora.replace(' ', 'T') : '';
                const fechaLocal = new Date(safeDateStr);
                const isAdelantado = cita.estado_pago === 'adelantado';
                const isPagado = cita.estado_pago === 'pagado';
                const isYapePorVerificar = cita.metodo_pago === 'Yape Anticipado' && cita.estado_pago === 'pendiente';
                
                // 👇 EXTRACCIÓN DEFENSIVA: Leemos bien aunque Supabase devuelva Objeto o Arreglo 👇
                const nombreBarbero = Array.isArray(cita.barbero) ? cita.barbero[0]?.nombre : cita.barbero?.nombre;
                const nombreSede = Array.isArray(cita.sede) ? cita.sede[0]?.nombre : cita.sede?.nombre;
                
                // Mapeamos los servicios de forma segura
                const listaServiciosRaw = Array.isArray(cita.cita_servicios) ? cita.cita_servicios : [];
                let sumaServicios = 0;
                
                const listaServiciosFormateada = listaServiciosRaw.map((relacion: any) => {
                   const infoSrv = Array.isArray(relacion.servicios) ? relacion.servicios[0] : relacion.servicios;
                   const nombre = infoSrv?.nombre || 'Servicio sin nombre';
                   const precio = Number(infoSrv?.precio || 0);
                   sumaServicios += precio;
                   return { nombre, precio };
                });

                const totalACobrarFinal = Number(cita.monto_total || sumaServicios);

                return (
                  <tr key={cita.id} className={`transition-colors ${cita.estado === 'completada' ? 'bg-emerald-50/30' : 'hover:bg-stone-50'}`}>
                    <td className="p-4 align-top"><div className="font-bold text-black mt-1">{fechaLocal.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div></td>
                    <td className="p-4 align-top">
                      <div className="font-bold text-sm text-stone-900 mt-1">{cita.cliente_nombre} {cita.cliente_apellido}</div>
                      <div className="text-xs text-stone-500 mt-0.5">{cita.cliente_celular}</div>
                    </td>
                    <td className="p-4 align-top">
                      <div className="flex flex-col gap-2 items-start w-full max-w-xs">
                        
                        {/* Etiquetas de Barbero y Sede */}
                        <div className="flex gap-2 flex-wrap">
                          <span className="bg-stone-100 px-2 py-1 rounded border border-stone-200 text-[11px] font-bold text-stone-700">✂️ {nombreBarbero || 'Sin asignar'}</span>
                          {userProfile.tipo === "master" && (
                            <span className="bg-blue-50 px-2 py-1 rounded border border-blue-100 text-[11px] font-bold text-blue-700">📍 {nombreSede || 'Sede'}</span>
                          )}
                        </div>

                        {/* TICKET DE SERVICIOS Y TOTAL */}
                        <div className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 mt-1">
                          <p className="text-[10px] uppercase tracking-widest text-stone-500 font-bold mb-2">Servicios Solicitados:</p>
                          <ul className="text-xs text-stone-700 space-y-1 mb-3">
                            {listaServiciosFormateada.length > 0 ? (
                              listaServiciosFormateada.map((srv: any, idx: number) => (
                                <li key={idx} className="flex justify-between items-center">
                                  <span className="truncate pr-2">• {srv.nombre}</span>
                                  <span className="text-stone-500 font-medium whitespace-nowrap">S/ {srv.precio.toFixed(2)}</span>
                                </li>
                              ))
                            ) : (
                              <li className="text-stone-400 italic font-light">- No especificados -</li>
                            )}
                          </ul>
                          
                          <div className="border-t border-stone-200 pt-2 flex justify-between items-center">
                            <span className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">Total a Cobrar</span>
                            <span className="text-sm font-bold text-[#B07D54]">S/ {totalACobrarFinal.toFixed(2)}</span>
                          </div>
                        </div>

                        {/* BADGES FINANCIEROS */}
                        {isAdelantado && (
                          <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest border border-emerald-200 w-full text-center">
                            Adelanto Pagado: S/ {Number(cita.monto_adelantado).toFixed(2)}
                          </span>
                        )}
                        {isPagado && (
                          <span className="bg-emerald-500 text-white px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest w-full text-center">
                            Pago Completo 100%
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-center align-top pt-5">
                      {cita.estado === 'completada' ? (
                        <span className="text-emerald-600 font-bold text-xs uppercase tracking-widest bg-emerald-100 px-3 py-1.5 rounded-full inline-block">Cobrado (S/{cita.monto_cobrado})</span>
                      ) : (
                        <div className="flex justify-center gap-2 items-center">
                          {userProfile.tipo === "barbero" ? (
                            <button onClick={() => setCitaACobrar(cita)} className="text-white bg-black hover:bg-stone-800 px-6 py-2 rounded-lg text-xs font-bold transition-all shadow-sm">COBRAR</button>
                          ) : (
                            <div className="flex flex-col gap-2 items-center w-full">
                              {isYapePorVerificar && (
                                <span className="text-[10px] bg-amber-100 text-amber-700 font-bold px-3 py-1.5 rounded border border-amber-300 animate-pulse w-full">
                                  🔔 ¡Revisar Yape! S/ {totalACobrarFinal.toFixed(2)}
                                </span>
                              )}
                              <div className="flex gap-2 justify-center w-full">
                                <button onClick={() => abrirModalVerificacion(cita)} className="flex-1 text-emerald-700 hover:text-white border border-emerald-300 hover:border-emerald-500 hover:bg-emerald-500 px-2 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all shadow-sm">
                                  Verificar ✓
                                </button>
                                <button onClick={() => setCitaACancelar(cita.id)} className="flex-1 text-red-500 hover:text-white border border-red-200 hover:border-red-500 hover:bg-red-500 px-2 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all shadow-sm">
                                  Cancelar ✕
                                </button>
                              </div>
                            </div>
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