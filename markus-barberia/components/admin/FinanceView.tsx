"use client";

import { useState } from "react";
import { Download, Calendar, CalendarDays, MapPin, Target, Users } from "lucide-react";

export default function FinanceView({ citasRaw, sedes, userProfile }: any) {
  // === ESTADOS ===
  const [filtroSedeMaster, setFiltroSedeMaster] = useState<string>("todas");
  const [rangoTiempo, setRangoTiempo] = useState<'dia' | 'mes'>('dia'); 

  const getLocalYYYYMMDD = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>(getLocalYYYYMMDD(new Date()));

  const cambiarDia = (dias: number) => {
    const [year, month, day] = fechaSeleccionada.split('-').map(Number);
    setFechaSeleccionada(getLocalYYYYMMDD(new Date(year, month - 1, day + dias)));
  };
  const irAHoy = () => setFechaSeleccionada(getLocalYYYYMMDD(new Date()));

  // === LÓGICA DE FILTRADO (SEDE + RANGO DE TIEMPO) ===
  const citasFiltradasSede = citasRaw.filter((c: any) => {
    if (userProfile.tipo === "sede") return c.sede_id?.toString() === userProfile.refId.toString();
    if (userProfile.tipo === "master" && filtroSedeMaster !== "todas") return c.sede_id?.toString() === filtroSedeMaster;
    return true;
  });

  const citasDelPeriodo = citasFiltradasSede.filter((cita: any) => {
    const fechaCita = getLocalYYYYMMDD(new Date(cita.fecha_hora));
    if (rangoTiempo === 'dia') {
      return fechaCita === fechaSeleccionada;
    } else {
      return fechaCita.substring(0, 7) === fechaSeleccionada.substring(0, 7);
    }
  });

  // === MATEMÁTICAS FINANCIERAS ===
  const citasCompletadas = citasDelPeriodo.filter((c: any) => c.estado === 'completada');
  const ingresosTotales = citasCompletadas.reduce((sum: number, cita: any) => sum + Number(cita.monto_cobrado || 0), 0);
  const totalServicios = citasCompletadas.length;
  const pendientes = citasDelPeriodo.filter((c: any) => c.estado !== 'completada').length;

  const ingresosPorMetodoObj = citasCompletadas.reduce((acc: Record<string, number>, cita: any) => {
    const metodo = cita.metodo_pago || 'No especificado';
    acc[metodo] = (acc[metodo] || 0) + Number(cita.monto_cobrado || 0);
    return acc;
  }, {});

  const rankingBarberosObj = citasCompletadas.reduce((acc: Record<string, number>, cita: any) => {
    const barbero = cita.barbero?.nombre || 'Desconocido';
    acc[barbero] = (acc[barbero] || 0) + Number(cita.monto_cobrado || 0);
    return acc;
  }, {});
  
  // 👇 NUEVA FUNCIÓN: Agrupar ingresos por Sede 👇
  const ingresosPorSedeObj = citasCompletadas.reduce((acc: Record<string, number>, cita: any) => {
    const sede = cita.sede?.nombre || 'Sede Desconocida';
    acc[sede] = (acc[sede] || 0) + Number(cita.monto_cobrado || 0);
    return acc;
  }, {});

  const ingresosArray = Object.entries(ingresosPorMetodoObj) as [string, number][];
  const rankingArray = Object.entries(rankingBarberosObj) as [string, number][];
  const barberosOrdenados = rankingArray.sort((a, b) => b[1] - a[1]);
  
  // Convertimos a array y ordenamos las sedes de mayor a menor ingreso
  const sedesArray = Object.entries(ingresosPorSedeObj) as [string, number][];
  const sedesOrdenadas = sedesArray.sort((a, b) => b[1] - a[1]);

  // === FUNCIÓN PARA EXPORTAR A EXCEL (CSV) ===
  const descargarCSV = () => {
    if (citasCompletadas.length === 0) {
      alert("No hay datos completados para exportar en este periodo.");
      return;
    }

    const encabezados = ["Fecha", "Hora", "Cliente", "Sede", "Barbero", "Monto Cobrado (S/)", "Metodo de Pago"];
    
    const filas = citasCompletadas.map((cita: any) => {
      const fechaObj = new Date(cita.fecha_hora);
      const fecha = fechaObj.toLocaleDateString();
      const hora = fechaObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const cliente = `"${cita.cliente_nombre} ${cita.cliente_apellido}"`;
      const sede = `"${cita.sede?.nombre || 'N/A'}"`;
      const barbero = `"${cita.barbero?.nombre || 'N/A'}"`;
      const monto = cita.monto_cobrado || 0;
      const metodo = cita.metodo_pago || 'N/A';
      
      return [fecha, hora, cliente, sede, barbero, monto, metodo].join(",");
    });

    const contenidoCSV = "\uFEFF" + [encabezados.join(","), ...filas].join("\n");
    const blob = new Blob([contenidoCSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Reporte_Markus_${rangoTiempo}_${fechaSeleccionada}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Lógica para mostrar la tarjeta de sedes (Solo Master y si el filtro es "todas")
  const mostrarIngresosSede = userProfile.tipo === "master" && filtroSedeMaster === "todas";

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* BARRA SUPERIOR: RANGO DE TIEMPO Y EXPORTAR */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-stone-200">
        
        {/* Toggle Día / Mes */}
        <div className="flex bg-stone-100 p-1 rounded-lg">
          <button 
            onClick={() => setRangoTiempo('dia')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${rangoTiempo === 'dia' ? 'bg-white text-black shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
          >
            <Calendar size={16} /> Por Día
          </button>
          <button 
            onClick={() => setRangoTiempo('mes')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${rangoTiempo === 'mes' ? 'bg-white text-black shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
          >
            <CalendarDays size={16} /> Por Mes
          </button>
        </div>

        {/* Botón Descargar Excel */}
        <button 
          onClick={descargarCSV}
          className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold transition-colors shadow-sm w-full sm:w-auto justify-center"
        >
          <Download size={18} />
          Descargar Reporte
        </button>
      </div>

      {/* CONTROLES DE FECHA Y SEDE */}
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

      {/* KPIS PRINCIPALES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex flex-col">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">Ingresos del {rangoTiempo === 'mes' ? 'Mes' : 'Día'}</span>
          <span className="text-3xl font-serif text-emerald-600">S/ {ingresosTotales.toFixed(2)}</span>
        </div>
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex flex-col">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">Citas Completadas</span>
          <span className="text-3xl font-serif text-stone-900">{totalServicios}</span>
        </div>
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex flex-col">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-1">Por Atender</span>
          <span className="text-3xl font-serif text-amber-500">{pendientes}</span>
        </div>
      </div>

      {/* TABLAS FINANCIERAS Y RANKINGS */}
      {/* 👇 NUEVO GRID: Acomodado para 2 o 3 columnas 👇 */}
      <div className={`grid grid-cols-1 ${mostrarIngresosSede ? 'lg:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
        
        {/* Recaudación por Método */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4 border-b border-stone-100 pb-2">
             <Target className="text-stone-400" size={18} />
             <h3 className="text-sm font-bold text-stone-500 uppercase tracking-widest">Recaudación por Método</h3>
          </div>
          {ingresosArray.length === 0 ? (
            <p className="text-stone-400 text-sm italic">No hay cobros registrados.</p>
          ) : (
            <ul className="space-y-3">
              {ingresosArray.map(([metodo, monto]) => (
                <li key={metodo} className="flex justify-between items-center text-sm font-medium">
                  <span className="text-stone-700 bg-stone-50 px-3 py-1 rounded-md border border-stone-100">{metodo}</span>
                  <span className="text-emerald-600 font-bold">S/ {monto.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Ranking de Barberos */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4 border-b border-stone-100 pb-2">
             <Users className="text-stone-400" size={18} />
             <h3 className="text-sm font-bold text-stone-500 uppercase tracking-widest">Ranking de Producción</h3>
          </div>
          {barberosOrdenados.length === 0 ? (
            <p className="text-stone-400 text-sm italic">No hay producción registrada.</p>
          ) : (
            <ul className="space-y-3">
              {barberosOrdenados.map(([barbero, monto], index) => (
                <li key={barbero} className="flex justify-between items-center text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index === 0 ? 'bg-amber-100 text-amber-600' : index === 1 ? 'bg-stone-200 text-stone-600' : index === 2 ? 'bg-orange-100 text-orange-700' : 'bg-stone-100 text-stone-500'}`}>{index + 1}</span>
                    <span className="text-stone-700">{barbero}</span>
                  </div>
                  <span className="text-emerald-600 font-bold">S/ {monto.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 👇 NUEVA TARJETA: Ingresos por Sede (Renderizado condicional) 👇 */}
        {mostrarIngresosSede && (
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm animate-fade-in">
            <div className="flex items-center gap-3 mb-4 border-b border-stone-100 pb-2">
               <MapPin className="text-stone-400" size={18} />
               <h3 className="text-sm font-bold text-stone-500 uppercase tracking-widest">Ingresos por Sede</h3>
            </div>
            {sedesOrdenadas.length === 0 ? (
              <p className="text-stone-400 text-sm italic">No hay ingresos registrados en ninguna sede.</p>
            ) : (
              <ul className="space-y-3">
                {sedesOrdenadas.map(([sede, monto]) => (
                  <li key={sede} className="flex justify-between items-center text-sm font-medium hover:bg-stone-50 p-2 rounded-lg transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      <span className="text-stone-700 font-semibold">{sede}</span>
                    </div>
                    <span className="text-emerald-600 font-bold">S/ {monto.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

      </div>
    </div>
  );
}