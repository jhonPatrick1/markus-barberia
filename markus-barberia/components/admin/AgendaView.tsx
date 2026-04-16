"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import ChargeModal from "./ChargeModal";
import ReservaManualModal from "./ReservaManualModal";

export default function AgendaView({ citasRaw, sedes, barberos = [], userProfile, cargarDatos, onLogout }: any) {
  const [citaACobrar, setCitaACobrar] = useState<any | null>(null);
  const [citaACancelar, setCitaACancelar] = useState<number | null>(null);
  const [citaAVerificarPago, setCitaAVerificarPago] = useState<any | null>(null); 
  const [citaAFinalizar, setCitaAFinalizar] = useState<any | null>(null);
  
  // 🔥 ESTADO NUEVO MODAL RESERVA MANUAL 🔥
  const [isReservaManualOpen, setIsReservaManualOpen] = useState(false);

  const [isCanceling, setIsCanceling] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const [nuevoEstadoPago, setNuevoEstadoPago] = useState("adelantado");
  const [montoAdelantado, setMontoAdelantado] = useState("");
  const [filtroSedeMaster, setFiltroSedeMaster] = useState<string>("todas");
  const [filtroBarberoId, setFiltroBarberoId] = useState<string>("todos");
  
  const getLocalYYYYMMDD = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>(getLocalYYYYMMDD(new Date()));

  // 🔥 MOTOR SUPABASE REALTIME 🔥
  useEffect(() => {
    const canalCitas = supabase
      .channel('escuchando-citas')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'citas' },
        (payload) => {
          console.log('¡Cambio detectado!', payload);
          cargarDatos(); 
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(canalCitas);
    };
  }, [cargarDatos]);

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
      const { error } = await supabase.from('citas').update({ 
        estado: 'cancelada',
        fecha_hora: '1999-01-01T00:00:00.000Z' 
      }).eq('id', citaACancelar);

      if (error) throw error;
      
      setCitaACancelar(null);
      cargarDatos();
    } catch (error: any) {
      setCitaACancelar(null);
      alert("Error al cancelar: " + error.message);
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

  const ejecutarFinalizacion = () => {
    if(!citaAFinalizar) return;
    procesarCobro(citaAFinalizar.id, 0, citaAFinalizar.metodo_pago || 'Pago Anticipado');
    setCitaAFinalizar(null);
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

  const formatDuracionTexto = (mins: number) => {
    if (mins >= 60) {
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      return m > 0 ? `${h}h ${m}m` : `${h}h`;
    }
    return `${mins}m`;
  };

  // === FILTROS EN CASCADA ===
  const safeCitasRaw = citasRaw || [];
  
  const citasFiltradas = safeCitasRaw.filter((c: any) => {
    if (userProfile.tipo === "barbero") return c.barbero_id?.toString() === userProfile.refId.toString();
    if (userProfile.tipo === "sede") return c.sede_id?.toString() === userProfile.refId.toString();
    if (userProfile.tipo === "master" && filtroSedeMaster !== "todas") return c.sede_id?.toString() === filtroSedeMaster;
    return true;
  });
  
  const citasDelDia = citasFiltradas.filter((cita: any) => {
    if (!cita.fecha_hora) return false;
    const safeDateStr = cita.fecha_hora.replace(' ', 'T');
    const cumpleFecha = getLocalYYYYMMDD(new Date(safeDateStr)) === fechaSeleccionada;
    const cumpleBarbero = filtroBarberoId === "todos" || cita.barbero_id?.toString() === filtroBarberoId;
    return cumpleFecha && cumpleBarbero;
  });
  
  const isBarbero = userProfile.tipo === "barbero";

  const barberosFiltrados = userProfile.tipo === "sede" 
    ? barberos.filter((b: any) => b.sede_id?.toString() === userProfile.refId.toString())
    : barberos;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* === ZONA DE MODALES === */}
      <ReservaManualModal isOpen={isReservaManualOpen} onClose={() => setIsReservaManualOpen(false)} sedes={sedes} barberos={barberos} cargarDatos={cargarDatos} />
      {citaACobrar && <ChargeModal cita={citaACobrar} onClose={() => setCitaACobrar(null)} onConfirmarCobro={procesarCobro} />}
      
      {citaACancelar && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">¿Cancelar reserva?</h3>
            <p className="text-gray-500 text-sm mb-6">El horario volverá a estar disponible.</p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setCitaACancelar(null)} disabled={isCanceling} className="flex-1 py-3 rounded-lg font-bold text-sm bg-gray-100 text-gray-700">No, mantener</button>
              <button type="button" onClick={ejecutarCancelacion} disabled={isCanceling} className="flex-1 py-3 rounded-lg font-bold text-sm bg-red-500 text-white">{isCanceling ? "Borrando..." : "Sí, cancelar"}</button>
            </div>
          </div>
        </div>
      )}

      {citaAFinalizar && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center border border-emerald-100">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
              <span className="text-3xl">✅</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 font-serif uppercase tracking-widest">¿Terminaste el corte?</h3>
            <p className="text-gray-500 text-sm mb-6">Confirma que finalizaste el servicio. Esto sumará la producción a tu ranking personal de manera automática.</p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setCitaAFinalizar(null)} className="flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-widest bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">Cancelar</button>
              <button type="button" onClick={ejecutarFinalizacion} className="flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-widest bg-emerald-500 text-white hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/30">Sí, Finalizar</button>
            </div>
          </div>
        </div>
      )}

      {citaAVerificarPago && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl max-w-sm w-full text-left">
            <h3 className="text-xl font-bold text-gray-900 mb-2 border-b pb-2">Verificar Pago</h3>
            <p className="text-gray-500 text-xs mb-4 uppercase tracking-widest font-bold">Cliente: {citaAVerificarPago.cliente_nombre}</p>
            
            <div className="space-y-4 mb-6">
              <div>
                <label htmlFor="estado-pago" className="block text-xs font-bold text-gray-500 uppercase mb-1">Estado del Pago</label>
                <select 
                  id="estado-pago" 
                  aria-label="Estado del Pago" 
                  value={nuevoEstadoPago} 
                  onChange={(e) => {
                    const estadoSeleccionado = e.target.value;
                    setNuevoEstadoPago(estadoSeleccionado);
                    
                    if (estadoSeleccionado === 'pagado') {
                      let suma = 0;
                      const serviciosRaw = Array.isArray(citaAVerificarPago.cita_servicios) ? citaAVerificarPago.cita_servicios : [];
                      serviciosRaw.forEach((rel: any) => {
                        const infoSrv = Array.isArray(rel.servicios) ? rel.servicios[0] : rel.servicios;
                        suma += Number(infoSrv?.precio || 0);
                      });
                      const totalFinal = Number(citaAVerificarPago.monto_total || suma);
                      setMontoAdelantado(totalFinal.toString());
                    } else if (estadoSeleccionado === 'pendiente') {
                      setMontoAdelantado(""); 
                    }
                  }} 
                  className="w-full border-2 border-gray-200 rounded-lg p-2.5 outline-none font-medium text-sm"
                >
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
              <button type="button" onClick={() => setCitaAVerificarPago(null)} disabled={isVerifying} className="flex-1 py-3 rounded-lg font-bold text-sm bg-gray-100 text-gray-700">Cancelar</button>
              <button type="button" onClick={procesarVerificacionPago} disabled={isVerifying} className="flex-1 py-3 rounded-lg font-bold text-sm bg-emerald-500 text-white shadow-lg">{isVerifying ? "Guardando..." : "Guardar Pago"}</button>
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
           <div className="flex gap-3 flex-wrap">
             <button type="button" onClick={cargarDatos} className="text-stone-500 hover:text-black font-medium text-sm px-4 py-2 border border-stone-200 rounded-lg whitespace-nowrap">🔄 Refrescar</button>
             <button type="button" onClick={onLogout} className="text-stone-500 hover:text-red-600 font-medium text-sm px-4 py-2 border border-stone-200 rounded-lg whitespace-nowrap">Cerrar Sesión</button>
           </div>
         </div>
      )}

      {/* CONTROLES SUPERIORES (Fecha, Sede y NUEVA RESERVA) */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button type="button" onClick={() => cambiarDia(-1)} className="flex-1 md:flex-none px-4 py-2 border border-stone-200 rounded-lg text-sm font-medium hover:bg-stone-50 whitespace-nowrap">◀ Ant</button>
          <button type="button" onClick={irAHoy} className="flex-1 md:flex-none px-4 py-2 bg-black text-white rounded-lg text-sm font-bold whitespace-nowrap">Hoy</button>
          <button type="button" onClick={() => cambiarDia(1)} className="flex-1 md:flex-none px-4 py-2 border border-stone-200 rounded-lg text-sm font-medium hover:bg-stone-50 whitespace-nowrap">Sig ▶</button>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {userProfile.tipo === "master" && (
            <select aria-label="Filtro Sede" value={filtroSedeMaster} onChange={(e) => setFiltroSedeMaster(e.target.value)} className="border-2 border-stone-200 rounded-lg p-2 text-sm outline-none cursor-pointer bg-white w-full sm:w-auto">
              <option value="todas">Todas las sedes</option>
              {sedes.map((sede: any) => <option key={sede.id} value={sede.id.toString()}>{sede.nombre}</option>)}
            </select>
          )}
          <input aria-label="Fecha" type="date" value={fechaSeleccionada} onChange={(e) => setFechaSeleccionada(e.target.value)} className="border-2 border-stone-200 rounded-lg p-2 text-sm outline-none cursor-pointer w-full sm:w-auto"/>
          
          {/* 🔥 BOTÓN NUEVA RESERVA 🔥 */}
          <button 
            type="button"
            onClick={() => setIsReservaManualOpen(true)} 
            className="w-full sm:w-auto bg-[#25D366] text-white hover:bg-[#1EBE5D] shadow-sm font-bold text-[11px] uppercase tracking-widest px-5 py-2.5 rounded-lg whitespace-nowrap flex items-center justify-center gap-2 transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.463 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
            + Nueva Reserva
          </button>
        </div>
      </div>

      {/* CARRUSEL HORIZONTAL DE BARBEROS */}
      {!isBarbero && barberosFiltrados.length > 0 && (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200">
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3 pl-1">Filtrar por Especialista</p>
          
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-2 pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            <button
              onClick={() => setFiltroBarberoId("todos")}
              className={`snap-start shrink-0 px-5 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
                filtroBarberoId === "todos" ? 'bg-black text-white shadow-md' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
              }`}
            >
              Todos los Especialistas
            </button>
            
            {barberosFiltrados.map((barbero: any) => {
              const isSelected = filtroBarberoId === barbero.id?.toString();
              return (
                <button
                  key={barbero.id}
                  onClick={() => setFiltroBarberoId(barbero.id.toString())}
                  className={`snap-start shrink-0 px-5 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 flex items-center gap-2 ${
                    isSelected ? 'bg-[#B07D54] text-[#161616] shadow-md' : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-400'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${isSelected ? 'bg-[#161616] text-[#B07D54]' : 'bg-stone-100 text-stone-400'}`}>
                    ✂️
                  </span>
                  {barbero.nombre}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* TABLA DE CITAS */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-x-auto w-full custom-scrollbar">
        <table className="w-full min-w-[800px] text-left border-collapse">
          <thead>
            <tr className="bg-stone-100 text-stone-500 text-xs uppercase tracking-wider border-b border-stone-200">
              <th className="p-4 font-bold w-36">Horario</th>
              <th className="p-4 font-bold">Cliente</th>
              <th className="p-4 font-bold">Detalle y Servicios</th>
              <th className="p-4 text-center font-bold">Estado / Acción</th>
            </tr>
          </thead>
            <tbody className="divide-y divide-stone-100">
              {citasDelDia.map((cita: any) => {
                const safeDateStr = cita.fecha_hora ? cita.fecha_hora.replace(' ', 'T') : '';
                const fechaLocal = new Date(safeDateStr);
                const horaInicioStr = fechaLocal.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                
                const nombreBarbero = Array.isArray(cita.barbero) ? cita.barbero[0]?.nombre : cita.barbero?.nombre;
                const nombreSede = Array.isArray(cita.sede) ? cita.sede[0]?.nombre : cita.sede?.nombre;
                
                const isBloqueo = cita.cliente_nombre === "BLOQUEO";

                // LÓGICA MATEMÁTICA PARA LA HORA DE FIN Y DURACIÓN
                let sumaDuracionServicios = 0;
                let sumaServicios = 0;
                const listaServiciosRaw = Array.isArray(cita.cita_servicios) ? cita.cita_servicios : [];
                
                const listaServiciosFormateada = listaServiciosRaw.map((relacion: any) => {
                   const infoSrv = Array.isArray(relacion.servicios) ? relacion.servicios[0] : relacion.servicios;
                   const nombre = infoSrv?.nombre || 'Servicio sin nombre';
                   const precio = Number(infoSrv?.precio || 0);
                   const durSrv = Number(infoSrv?.duracion_minutos || 0);
                   sumaServicios += precio;
                   sumaDuracionServicios += durSrv;
                   return { nombre, precio };
                });

                const duracionFinalMinutos = Number(cita.duracion_total_minutos) || Math.max(sumaDuracionServicios, 30);
                const fechaFin = new Date(fechaLocal.getTime() + duracionFinalMinutos * 60000); 
                const horaFinStr = fechaFin.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                const duracionLegible = formatDuracionTexto(duracionFinalMinutos);

                // VISUAL EXCLUSIVA PARA EL BLOQUEO (FANTASMA)
                if (isBloqueo) {
                  return (
                    <tr key={cita.id} className="bg-[#B07D54]/5 hover:bg-[#B07D54]/10 transition-colors">
                      <td className="p-4 align-top border-l-4 border-[#B07D54]">
                        <div className="font-bold text-stone-700 mt-1 whitespace-nowrap">{horaInicioStr}</div>
                        <div className="text-xs text-stone-500 mt-0.5 whitespace-nowrap">hasta {horaFinStr}</div>
                        <div className="text-[10px] bg-white border border-[#B07D54]/30 text-[#B07D54] px-2 py-0.5 rounded-md inline-block mt-2 font-bold tracking-widest">
                          ⏱ {duracionLegible}
                        </div>
                      </td>
                      <td colSpan={3} className="p-4 align-middle">
                        <div className="bg-[#B07D54]/10 border border-[#B07D54]/30 border-dashed rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">☕</div>
                            <div>
                              <h4 className="font-bold text-[#B07D54] uppercase tracking-widest text-sm">Almuerzo / Break Especialista</h4>
                              <p className="text-xs text-stone-500 font-bold mt-1 tracking-wider">✂️ BARBERO: {nombreBarbero || 'Desconocido'}</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-[#161616] uppercase tracking-widest bg-[#B07D54]/20 px-3 py-1.5 rounded-md whitespace-nowrap">
                            🔒 Oculto en Web
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                }

                // === VISUAL NORMAL PARA CITAS REALES ===
                const isAdelantado = cita.estado_pago === 'adelantado';
                const isPagado = cita.estado_pago === 'pagado';
                const isYapePorVerificar = cita.metodo_pago === 'Yape Anticipado' && cita.estado_pago === 'pendiente';
                const isWhatsApp = cita.metodo_pago === 'WhatsApp'; // 🔥 Identificador
                const totalACobrarFinal = Number(cita.monto_total || sumaServicios);

                return (
                  <tr key={cita.id} className={`transition-colors ${cita.estado === 'completada' ? 'bg-emerald-50/30' : 'hover:bg-stone-50'}`}>
                    
                    <td className="p-4 align-top">
                      <div className={`font-bold mt-1 whitespace-nowrap ${cita.estado === 'completada' ? 'text-emerald-900' : 'text-black'}`}>
                        {horaInicioStr}
                      </div>
                      <div className="text-xs text-stone-500 mt-0.5 whitespace-nowrap">
                        hasta {horaFinStr}
                      </div>
                      <div className="text-[10px] bg-stone-100 border border-stone-200 text-stone-600 px-2 py-0.5 rounded-md inline-block mt-2 font-bold tracking-widest">
                        ⏱ {duracionLegible}
                      </div>
                    </td>

                    <td className="p-4 align-top">
                      <div className="font-bold text-sm text-stone-900 mt-1 flex flex-col md:flex-row md:items-center gap-2 whitespace-nowrap">
                        {cita.cliente_nombre} {cita.cliente_apellido}
                        {/* 🔥 PLACA WHATSAPP 🔥 */}
                        {isWhatsApp && (
                          <span title="Reserva Manual por WhatsApp" className="bg-[#25D366]/10 text-[#1EBE5D] border border-[#25D366]/30 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest flex items-center gap-1 w-fit">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.463 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                            WhatsApp
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-stone-500 mt-0.5 whitespace-nowrap">{cita.cliente_celular}</div>
                    </td>
                    <td className="p-4 align-top">
                      <div className="flex flex-col gap-2 items-start w-full max-w-xs">
                        
                        <div className="flex gap-2 flex-wrap">
                          <span className="bg-stone-100 px-2 py-1 rounded border border-stone-200 text-[11px] font-bold text-stone-700 whitespace-nowrap">✂️ {nombreBarbero || 'Sin asignar'}</span>
                          {userProfile.tipo === "master" && (
                            <span className="bg-blue-50 px-2 py-1 rounded border border-blue-100 text-[11px] font-bold text-blue-700 whitespace-nowrap">📍 {nombreSede || 'Sede'}</span>
                          )}
                        </div>

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
                            <span className="text-[10px] uppercase tracking-widest text-stone-500 font-bold whitespace-nowrap">Total a Cobrar</span>
                            <span className="text-sm font-bold text-[#B07D54] whitespace-nowrap">S/ {totalACobrarFinal.toFixed(2)}</span>
                          </div>
                        </div>

                        {isAdelantado && (
                          <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest border border-emerald-200 w-full text-center whitespace-nowrap">
                            Adelanto Pagado: S/ {Number(cita.monto_adelantado).toFixed(2)}
                          </span>
                        )}
                        {isPagado && (
                          <span className="bg-emerald-500 text-white px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest w-full text-center whitespace-nowrap">
                            Pago Completo 100%
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-center align-top pt-5">
                      {cita.estado === 'completada' ? (
                        <span className="text-emerald-600 font-bold text-xs uppercase tracking-widest bg-emerald-100 px-3 py-1.5 rounded-full inline-block whitespace-nowrap">Cobrado (S/{cita.monto_cobrado})</span>
                      ) : (
                        <div className="flex justify-center gap-2 items-center">
                          {userProfile.tipo === "barbero" ? (
                            
                            (() => {
                              const faltaCobrar = totalACobrarFinal - (Number(cita.monto_adelantado) || 0);

                              if (faltaCobrar <= 0) {
                                return (
                                  <button type="button" 
                                    onClick={() => setCitaAFinalizar(cita)}
                                    className="text-emerald-700 bg-emerald-100 border border-emerald-400 hover:bg-emerald-500 hover:text-white w-full py-2 rounded-lg text-[11px] font-bold transition-all shadow-sm uppercase tracking-widest whitespace-nowrap"
                                  >
                                    ✅ Finalizar Corte
                                  </button>
                                );
                              } else {
                                return (
                                  <button type="button" 
                                    onClick={() => setCitaACobrar(cita)} 
                                    className="text-white bg-black hover:bg-stone-800 whitespace-nowrap w-full py-2 rounded-lg text-[10px] font-bold transition-all shadow-sm uppercase tracking-widest"
                                  >
                                    💰 Cobrar Restante (S/ {faltaCobrar.toFixed(2)})
                                  </button>
                                );
                              }
                            })()

                          ) : (
                            <div className="flex flex-col gap-2 items-center w-full">
                              {isYapePorVerificar && (
                                <span className="text-[10px] bg-amber-100 text-amber-700 font-bold px-3 py-1.5 rounded border border-amber-300 animate-pulse w-full whitespace-nowrap">
                                  🔔 ¡Revisar Yape! S/ {totalACobrarFinal.toFixed(2)}
                                </span>
                              )}

                            {(() => {
                                const faltaCobrar = totalACobrarFinal - (Number(cita.monto_adelantado) || 0);

                                if (faltaCobrar <= 0) {
                                  return (
                                    <button type="button" 
                                      onClick={() => setCitaAFinalizar(cita)}
                                      className="w-full text-emerald-700 hover:text-white border border-emerald-400 hover:bg-emerald-500 px-2 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all shadow-sm whitespace-nowrap"
                                    >
                                      ✅ Forzar Cierre (Pagado)
                                    </button>
                                  );
                                } else {
                                  return (
                                    <button type="button" 
                                      onClick={() => setCitaACobrar(cita)} 
                                      className="w-full text-stone-700 hover:text-white border border-stone-400 hover:bg-stone-800 px-2 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all shadow-sm whitespace-nowrap"
                                    >
                                      💰 Cobrar en Caja (S/ {faltaCobrar.toFixed(2)})
                                    </button>
                                  );
                                }
                              })()}

                              <div className="flex gap-2 justify-center w-full">
                                <button type="button" onClick={() => abrirModalVerificacion(cita)} className="flex-1 text-emerald-700 hover:text-white border border-emerald-300 hover:border-emerald-500 hover:bg-emerald-500 px-2 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all shadow-sm whitespace-nowrap">
                                  Verificar ✓
                                </button>
                                <button type="button" onClick={() => setCitaACancelar(cita.id)} className="flex-1 text-red-500 hover:text-white border border-red-200 hover:border-red-500 hover:bg-red-500 px-2 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all shadow-sm whitespace-nowrap">
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
  );
}