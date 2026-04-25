"use client";

import { useState } from "react";
import { BarChart3, Calendar, CalendarDays, MapPin, TrendingUp, Users, Wallet } from "lucide-react";

export default function AnalyticsView({ citasRaw, sedes, userProfile }: any) {
  const [rangoTiempo, setRangoTiempo] = useState<'dia' | 'mes'>('dia');
  const [filtroSedeMaster, setFiltroSedeMaster] = useState<string>("todas");

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

  // === 1. FILTROS ===
  const isMaster = userProfile?.tipo === "master";

  const citasFiltradasSede = citasRaw.filter((c: any) => {
    if (!isMaster) return c.sede_id?.toString() === userProfile?.refId?.toString();
    if (filtroSedeMaster !== "todas") return c.sede_id?.toString() === filtroSedeMaster;
    return true;
  });

  const citasDelPeriodo = citasFiltradasSede.filter((cita: any) => {
    if (!cita.fecha_hora) return false;
    const safeDateStr = cita.fecha_hora.replace(' ', 'T');
    const fechaCita = getLocalYYYYMMDD(new Date(safeDateStr));
    return rangoTiempo === 'dia' 
      ? fechaCita === fechaSeleccionada 
      : fechaCita.substring(0, 7) === fechaSeleccionada.substring(0, 7);
  });

  // === 2. CÁLCULOS MATEMÁTICOS ===
  const completadas = citasDelPeriodo.filter((c: any) => c.estado === 'completada');
  const totalIngresos = completadas.reduce((sum: number, c: any) => sum + Number(c.monto_cobrado || 0), 0);
  
  // Por Barbero
  const barberosData = completadas.reduce((acc: any, cita: any) => {
    const nombre = Array.isArray(cita.barbero) ? cita.barbero[0]?.nombre : cita.barbero?.nombre;
    const key = nombre || 'Desconocido';
    acc[key] = (acc[key] || 0) + Number(cita.monto_cobrado || 0);
    return acc;
  }, {});
  const barberosArr = Object.entries(barberosData).sort((a: any, b: any) => b[1] - a[1]);
  const maxBarbero = barberosArr.length > 0 ? Number(barberosArr[0][1]) : 1;

  // Por Método de Pago
  const metodosData = completadas.reduce((acc: any, cita: any) => {
    const total = Number(cita.monto_cobrado || 0);
    const adelanto = Number(cita.monto_adelantado || 0);
    const restante = Math.max(0, total - adelanto);

    if (adelanto > 0) acc['Adelanto (Yape/Plin)'] = (acc['Adelanto (Yape/Plin)'] || 0) + adelanto;
    if (restante > 0) {
      const metodo = cita.metodo_pago || 'Efectivo';
      acc[metodo] = (acc[metodo] || 0) + restante;
    }
    return acc;
  }, {});
  const metodosArr = Object.entries(metodosData).sort((a: any, b: any) => b[1] - a[1]);
  const maxMetodo = metodosArr.length > 0 ? Number(metodosArr[0][1]) : 1;

  // Por Sede (Solo Master)
  const sedesData = completadas.reduce((acc: any, cita: any) => {
    const nombre = Array.isArray(cita.sede) ? cita.sede[0]?.nombre : cita.sede?.nombre;
    const key = nombre || 'Sin Sede';
    acc[key] = (acc[key] || 0) + Number(cita.monto_cobrado || 0);
    return acc;
  }, {});
  const sedesArr = Object.entries(sedesData).sort((a: any, b: any) => b[1] - a[1]);
  const maxSede = sedesArr.length > 0 ? Number(sedesArr[0][1]) : 1;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* CONTROLES SUPERIORES */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Botones de Rango */}
        <div className="flex bg-stone-100 p-1 rounded-lg w-full md:w-auto">
          <button onClick={() => setRangoTiempo('dia')} className={`flex-1 flex justify-center items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${rangoTiempo === 'dia' ? 'bg-white text-black shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}>
            <Calendar size={16} /> Día
          </button>
          <button onClick={() => setRangoTiempo('mes')} className={`flex-1 flex justify-center items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${rangoTiempo === 'mes' ? 'bg-white text-black shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}>
            <CalendarDays size={16} /> Mes
          </button>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-1">
            <button onClick={() => cambiarDia(-1)} className="px-3 py-2 border border-stone-200 rounded-lg text-sm font-medium hover:bg-stone-50">◀</button>
            <button onClick={irAHoy} className="px-4 py-2 bg-black text-white rounded-lg text-sm font-bold">Hoy</button>
            <button onClick={() => cambiarDia(1)} className="px-3 py-2 border border-stone-200 rounded-lg text-sm font-medium hover:bg-stone-50">▶</button>
          </div>
          
          <input
            type="date"
            value={fechaSeleccionada}
            onChange={(e) => setFechaSeleccionada(e.target.value)}
            title="Seleccionar fecha"
            className="border-2 border-stone-200 rounded-lg p-2 text-sm outline-none cursor-pointer"
          />
          
          {/* 🔥 REGLA DE NEGOCIO: SOLO MASTER VE ESTE FILTRO 🔥 */}
          {isMaster && (
            <select
              title="Filtrar sede"
              value={filtroSedeMaster}
              onChange={(e) => setFiltroSedeMaster(e.target.value)}
              className="border-2 border-stone-200 rounded-lg p-2 text-sm outline-none cursor-pointer bg-white font-bold text-[#B07D54]"
            >
              <option value="todas">🌎 Todas las sedes</option>
              {sedes?.map((s: any) => <option key={s.id} value={s.id.toString()}>{s.nombre}</option>)}
            </select>
          )}
        </div>
      </div>

      {/* KPI PRINCIPAL */}
      <div className="bg-gradient-to-br from-neutral-900 to-stone-800 p-8 rounded-2xl shadow-lg border border-stone-700 flex flex-col md:flex-row items-center justify-between text-white relative overflow-hidden">
        <div className="absolute -right-10 -top-10 opacity-10"><BarChart3 size={200} /></div>
        <div className="z-10">
          <p className="text-stone-400 text-sm uppercase tracking-widest font-bold mb-1">
            Ingresos Totales ({rangoTiempo === 'dia' ? 'Diarios' : 'Mensuales'})
          </p>
          <h2 className="text-5xl md:text-6xl font-serif text-[#B07D54]">S/ {totalIngresos.toFixed(2)}</h2>
        </div>
        <div className="z-10 mt-6 md:mt-0 flex gap-6 text-center">
          <div>
            <p className="text-3xl font-bold">{completadas.length}</p>
            <p className="text-xs text-stone-400 uppercase tracking-widest mt-1">Servicios</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{citasDelPeriodo.length - completadas.length}</p>
            <p className="text-xs text-amber-400 uppercase tracking-widest mt-1">Pendientes</p>
          </div>
        </div>
      </div>

      {/* GRÁFICOS VISUALES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* GRÁFICO 1: BARBEROS */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-4 mb-4">
            <Users className="text-[#B07D54]" size={20} />
            <h3 className="font-bold text-stone-700 uppercase tracking-widest text-sm">Top Especialistas</h3>
          </div>
          <div className="space-y-5">
            {barberosArr.length === 0 && <p className="text-stone-400 text-sm italic">Sin datos registrados.</p>}
            {barberosArr.map(([nombre, monto]: any, idx) => {
              const porcentaje = Math.max((monto / maxBarbero) * 100, 5); // Min 5% para que se vea la barra
              return (
                <div key={idx} className="relative">
                  <div className="flex justify-between text-xs font-bold text-stone-600 mb-1">
                    <span>{idx + 1}. {nombre}</span>
                    <span>S/ {Number(monto).toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-2.5">
                    <div 
                      className="bg-gradient-to-r from-[#B07D54] to-amber-600 h-2.5 rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${porcentaje}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* GRÁFICO 2: MÉTODOS DE PAGO */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-4 mb-4">
            <Wallet className="text-emerald-500" size={20} />
            <h3 className="font-bold text-stone-700 uppercase tracking-widest text-sm">Flujo de Caja (Métodos)</h3>
          </div>
          <div className="space-y-5">
            {metodosArr.length === 0 && <p className="text-stone-400 text-sm italic">Sin datos registrados.</p>}
            {metodosArr.map(([metodo, monto]: any, idx) => {
              const porcentaje = Math.max((monto / maxMetodo) * 100, 5);
              return (
                <div key={idx} className="relative">
                  <div className="flex justify-between text-xs font-bold text-stone-600 mb-1">
                    <span>{metodo}</span>
                    <span className="text-emerald-600">S/ {Number(monto).toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-2.5">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-2.5 rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${porcentaje}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* GRÁFICO 3: SEDES (SOLO VISIBLE PARA MASTER) */}
        {isMaster && (
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm lg:col-span-2 animate-fade-in">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-4 mb-4">
              <MapPin className="text-blue-500" size={20} />
              <h3 className="font-bold text-stone-700 uppercase tracking-widest text-sm">Comparativa de Sedes</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
              {sedesArr.length === 0 && <p className="text-stone-400 text-sm italic">Sin datos registrados.</p>}
              {sedesArr.map(([sede, monto]: any, idx) => {
                const porcentaje = Math.max((monto / maxSede) * 100, 5);
                return (
                  <div key={idx} className="relative">
                    <div className="flex justify-between text-xs font-bold text-stone-600 mb-1">
                      <span>📍 {sede}</span>
                      <span className="text-blue-600">S/ {Number(monto).toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-600 to-blue-400 h-3 rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${porcentaje}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}