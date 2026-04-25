"use client";

import { useState } from "react";
import { Download, Calendar, CalendarDays, MapPin, Target, Users, BarChart3, Scissors, DollarSign } from "lucide-react";

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

  const isMaster = userProfile?.tipo === "master";

  // === LÓGICA DE FILTRADO (SEDE + RANGO DE TIEMPO) ===
  const citasFiltradasSede = citasRaw.filter((c: any) => {
    if (!isMaster) return c.sede_id?.toString() === userProfile.refId?.toString();
    if (filtroSedeMaster !== "todas") return c.sede_id?.toString() === filtroSedeMaster;
    return true;
  });

  const citasDelPeriodo = citasFiltradasSede.filter((cita: any) => {
    if (!cita.fecha_hora) return false;
    const safeDateStr = cita.fecha_hora.replace(' ', 'T');
    const fechaCita = getLocalYYYYMMDD(new Date(safeDateStr));
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
    const totalCobrado = Number(cita.monto_cobrado || 0);
    const adelanto = Number(cita.monto_adelantado || 0);
    const restanteCobradoHoy = Math.max(0, totalCobrado - adelanto);

    if (adelanto > 0) acc['Adelanto (Yape)'] = (acc['Adelanto (Yape)'] || 0) + adelanto;
    if (restanteCobradoHoy > 0) {
      const metodoReal = cita.metodo_pago || 'Efectivo'; 
      acc[metodoReal] = (acc[metodoReal] || 0) + restanteCobradoHoy;
    }
    return acc;
  }, {});

  const rankingBarberosObj = citasCompletadas.reduce((acc: Record<string, number>, cita: any) => {
    const nombreBarbero = Array.isArray(cita.barbero) ? cita.barbero[0]?.nombre : cita.barbero?.nombre;
    const barbero = nombreBarbero || 'Desconocido';
    acc[barbero] = (acc[barbero] || 0) + Number(cita.monto_cobrado || 0);
    return acc;
  }, {});
  
  const ingresosPorSedeObj = citasCompletadas.reduce((acc: Record<string, number>, cita: any) => {
    const nombreSede = Array.isArray(cita.sede) ? cita.sede[0]?.nombre : cita.sede?.nombre;
    const sede = nombreSede || 'Sede Desconocida';
    acc[sede] = (acc[sede] || 0) + Number(cita.monto_cobrado || 0);
    return acc;
  }, {});

  // 🔥 FIX TYPESCRIPT: Agregamos "as [string, number][]" para que VS Code sepa que son números
  const ingresosArray = (Object.entries(ingresosPorMetodoObj) as [string, number][]).sort((a, b) => b[1] - a[1]);
  const maxMetodo = ingresosArray.length > 0 ? ingresosArray[0][1] : 1;

  const barberosOrdenados = (Object.entries(rankingBarberosObj) as [string, number][]).sort((a, b) => b[1] - a[1]);
  const maxBarbero = barberosOrdenados.length > 0 ? barberosOrdenados[0][1] : 1;
  
  const sedesOrdenadas = (Object.entries(ingresosPorSedeObj) as [string, number][]).sort((a, b) => b[1] - a[1]);
  const maxSede = sedesOrdenadas.length > 0 ? sedesOrdenadas[0][1] : 1;

  // === EXPORTACIÓN EXCEL ===
  const descargarCSV = () => {
    if (citasCompletadas.length === 0) {
      alert("No hay datos completados para exportar en este periodo.");
      return;
    }

    const encabezados = [
      "Fecha", "Hora", "Cliente", "Sede", "Especialista", 
      "Monto Total Cobrado (S/)", "Comision Especialista 50% (S/)", "Ingreso Local 50% (S/)", "Metodo de Pago"
    ];
    
    let sumaTotal = 0;

    const filasDetalle = citasCompletadas.map((cita: any) => {
      const safeDateStr = cita.fecha_hora ? cita.fecha_hora.replace(' ', 'T') : '';
      const fechaObj = new Date(safeDateStr);
      const fecha = fechaObj.toLocaleDateString();
      const hora = fechaObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const cliente = `"${cita.cliente_nombre} ${cita.cliente_apellido}"`;
      
      const nombreSede = Array.isArray(cita.sede) ? cita.sede[0]?.nombre : cita.sede?.nombre;
      const sede = `"${nombreSede || 'N/A'}"`;
      
      const nombreBarbero = Array.isArray(cita.barbero) ? cita.barbero[0]?.nombre : cita.barbero?.nombre;
      const barbero = `"${nombreBarbero || 'N/A'}"`;
      
      const monto = Number(cita.monto_cobrado || 0);
      sumaTotal += monto; 
      
      const mitadEspecialista = (monto / 2).toFixed(2);
      const mitadLocal = (monto / 2).toFixed(2);

      const metodo = cita.metodo_pago || 'N/A';
      
      return [fecha, hora, cliente, sede, barbero, monto.toFixed(2), mitadEspecialista, mitadLocal, metodo].join(",");
    });

    filasDetalle.push("");
    filasDetalle.push([
      "\"\"", "\"\"", "\"\"", "\"\"", 
      "\"TOTAL GENERAL:\"", 
      sumaTotal.toFixed(2), 
      (sumaTotal/2).toFixed(2), 
      (sumaTotal/2).toFixed(2), 
      "\"\""
    ].join(","));

    filasDetalle.push(""); 
    filasDetalle.push(["\"\"", "\"\"", "\"\"", "\"--- RESUMEN DE LIQUIDACION (SPLIT 50/50) ---\""].join(","));
    filasDetalle.push([
      "\"\"", "\"\"", "\"\"", 
      "\"Especialista\"", 
      "\"Produccion Total (S/)\"", 
      "\"Comision a Pagar 50% (S/)\"", 
      "\"Ingreso Local 50% (S/)\""
    ].join(","));

    // 🔥 FIX TYPESCRIPT: Definimos el tipo aquí también
    barberosOrdenados.forEach(([barbero, produccion]: [string, number]) => {
      const comision = (produccion / 2).toFixed(2);
      filasDetalle.push([
        "\"\"", "\"\"", "\"\"", 
        `"${barbero}"`, 
        produccion.toFixed(2), 
        comision, 
        comision
      ].join(","));
    });

    const contenidoCSV = "\uFEFF" + [encabezados.join(","), ...filasDetalle].join("\n");
    const blob = new Blob([contenidoCSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Liquidacion_Markus_${rangoTiempo}_${fechaSeleccionada}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const mostrarIngresosSede = isMaster && filtroSedeMaster === "todas";

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* BARRA SUPERIOR: RANGO DE TIEMPO Y EXPORTAR */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-stone-200">
        
        <div className="flex bg-stone-100 p-1 rounded-lg w-full sm:w-auto">
          <button 
            onClick={() => setRangoTiempo('dia')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-md text-sm font-bold transition-all ${rangoTiempo === 'dia' ? 'bg-white text-black shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
          >
            <Calendar size={16} /> Día
          </button>
          <button 
            onClick={() => setRangoTiempo('mes')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-md text-sm font-bold transition-all ${rangoTiempo === 'mes' ? 'bg-white text-black shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
          >
            <CalendarDays size={16} /> Mes
          </button>
        </div>

        <button 
          onClick={descargarCSV}
          className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold transition-colors shadow-sm w-full sm:w-auto justify-center uppercase tracking-widest"
        >
          <Download size={18} />
          Exportar Excel (50/50)
        </button>
      </div>

      {/* CONTROLES DE FECHA Y SEDE */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button onClick={() => cambiarDia(-1)} className="flex-1 md:flex-none px-4 py-2 border border-stone-200 rounded-lg text-sm font-medium hover:bg-stone-50">◀ Ant</button>
          <button onClick={irAHoy} className="flex-1 md:flex-none px-4 py-2 bg-black text-white rounded-lg text-sm font-bold">Hoy</button>
          <button onClick={() => cambiarDia(1)} className="flex-1 md:flex-none px-4 py-2 border border-stone-200 rounded-lg text-sm font-medium hover:bg-stone-50">Sig ▶</button>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          {isMaster && (
            <select aria-label="Filtro Sede" value={filtroSedeMaster} onChange={(e) => setFiltroSedeMaster(e.target.value)} className="w-full sm:w-auto border-2 border-stone-200 rounded-lg p-2 text-sm font-bold text-[#B07D54] outline-none cursor-pointer bg-white">
              <option value="todas">🌎 Todas las sedes</option>
              {sedes?.map((sede: any) => <option key={sede.id} value={sede.id.toString()}>{sede.nombre}</option>)}
            </select>
          )}
          <input aria-label="Fecha" type="date" value={fechaSeleccionada} onChange={(e) => setFechaSeleccionada(e.target.value)} className="w-full sm:w-auto border-2 border-stone-200 rounded-lg p-2 text-sm outline-none cursor-pointer"/>
        </div>
      </div>

      {/* KPI HERO PANEL (DISEÑO PREMIUM OSCURO) */}
      <div className="bg-gradient-to-br from-neutral-900 to-stone-800 p-8 rounded-2xl shadow-lg border border-stone-700 flex flex-col md:flex-row items-center justify-between text-white relative overflow-hidden">
        <div className="absolute -right-10 -top-10 opacity-10"><BarChart3 size={200} /></div>
        <div className="z-10 text-center md:text-left">
          <p className="text-stone-400 text-sm uppercase tracking-widest font-bold mb-1">
            Producción Bruta ({rangoTiempo === 'dia' ? 'Diaria' : 'Mensual'})
          </p>
          <h2 className="text-5xl md:text-6xl font-serif text-[#B07D54]">S/ {ingresosTotales.toFixed(2)}</h2>
        </div>
        <div className="z-10 mt-6 md:mt-0 flex gap-8 text-center bg-black/30 p-4 rounded-xl backdrop-blur-sm border border-white/5">
          <div>
            <p className="text-3xl font-bold">{totalServicios}</p>
            <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-1">Servicios</p>
          </div>
          <div className="w-px bg-white/10"></div>
          <div>
            <p className="text-3xl font-bold text-amber-400">{pendientes}</p>
            <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-1">Pendientes</p>
          </div>
        </div>
      </div>

      {/* KPI SECUNDARIOS (SPLIT 50/50) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-xl border-2 border-emerald-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block mb-1">Ganancia Local (50%)</span>
            <span className="text-3xl font-bold text-stone-800">S/ {(ingresosTotales / 2).toFixed(2)}</span>
          </div>
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
            <DollarSign size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border-2 border-[#B07D54]/20 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#B07D54] uppercase tracking-widest block mb-1">Pago Especialistas (50%)</span>
            <span className="text-3xl font-bold text-stone-800">S/ {(ingresosTotales / 2).toFixed(2)}</span>
          </div>
          <div className="w-12 h-12 bg-[#B07D54]/10 rounded-full flex items-center justify-center text-[#B07D54]">
            <Users size={24} />
          </div>
        </div>
      </div>

      {/* GRÁFICOS VISUALES */}
      <div className={`grid grid-cols-1 ${mostrarIngresosSede ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-6`}>
        
        {/* GRÁFICO: MÉTODOS DE PAGO */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-4 mb-5">
             <Target className="text-emerald-500" size={18} />
             <h3 className="text-xs font-bold text-stone-500 uppercase tracking-widest">Caja por Método</h3>
          </div>
          <div className="space-y-5 flex-1">
            {ingresosArray.length === 0 && <p className="text-stone-400 text-sm italic">Sin cobros.</p>}
            {ingresosArray.map(([metodo, monto]: [string, number]) => {
              const porcentaje = Math.max((monto / maxMetodo) * 100, 5);
              return (
                <div key={metodo} className="relative">
                  <div className="flex justify-between text-xs font-bold text-stone-600 mb-1.5">
                    <span>{metodo}</span>
                    <span className="text-emerald-600">S/ {monto.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-2">
                    <div className="bg-gradient-to-r from-emerald-500 to-emerald-300 h-2 rounded-full" style={{ width: `${porcentaje}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* GRÁFICO: RANKING BARBEROS */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 border-b border-stone-100 pb-4 mb-5">
             <Users className="text-[#B07D54]" size={18} />
             <h3 className="text-xs font-bold text-stone-500 uppercase tracking-widest">Producción Bruta (Top)</h3>
          </div>
          <div className="space-y-5 flex-1">
            {barberosOrdenados.length === 0 && <p className="text-stone-400 text-sm italic">Sin producción.</p>}
            {barberosOrdenados.slice(0, 5).map(([barbero, monto]: [string, number], index) => { 
              const porcentaje = Math.max((monto / maxBarbero) * 100, 5);
              return (
                <div key={barbero} className="relative">
                  <div className="flex justify-between text-xs font-bold text-stone-600 mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <span className="text-[9px] bg-stone-200 text-stone-600 px-1.5 rounded">{index + 1}</span> 
                      {barbero}
                    </span>
                    <span>S/ {monto.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-2">
                    <div className="bg-gradient-to-r from-[#B07D54] to-amber-600 h-2 rounded-full" style={{ width: `${porcentaje}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* GRÁFICO: SEDES (Solo Master) */}
        {mostrarIngresosSede && (
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm animate-fade-in flex flex-col">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-4 mb-5">
               <MapPin className="text-blue-500" size={18} />
               <h3 className="text-xs font-bold text-stone-500 uppercase tracking-widest">Comparativa Sedes</h3>
            </div>
            <div className="space-y-5 flex-1">
              {sedesOrdenadas.length === 0 && <p className="text-stone-400 text-sm italic">Sin ingresos.</p>}
              {sedesOrdenadas.map(([sede, monto]: [string, number]) => {
                const porcentaje = Math.max((monto / maxSede) * 100, 5);
                return (
                  <div key={sede} className="relative">
                    <div className="flex justify-between text-xs font-bold text-stone-600 mb-1.5">
                      <span>{sede}</span>
                      <span className="text-blue-600">S/ {monto.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-2 rounded-full" style={{ width: `${porcentaje}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* TABLA VISUAL DE LIQUIDACIÓN 50/50 */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden mt-6">
        <div className="p-5 border-b border-stone-100 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Scissors className="text-[#B07D54]" size={20} />
            <h3 className="font-bold text-stone-800 uppercase tracking-widest text-sm">Resumen para Pago a Especialistas (50/50)</h3>
          </div>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-white text-stone-400 text-[10px] uppercase tracking-widest border-b border-stone-200">
                <th className="p-4 font-bold">Especialista</th>
                <th className="p-4 font-bold text-right bg-stone-50">Producción Total</th>
                <th className="p-4 font-bold text-right bg-emerald-50 text-emerald-700">Ingreso Local (50%)</th>
                <th className="p-4 font-bold text-right bg-[#B07D54]/10 text-[#B07D54]">Comisión a Pagar (50%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {barberosOrdenados.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-stone-400 font-medium">No hay liquidaciones pendientes.</td></tr>
              ) : (
                barberosOrdenados.map(([barbero, produccion]: [string, number]) => {
                  const mitad = (produccion / 2).toFixed(2);
                  return (
                    <tr key={barbero} className="hover:bg-stone-50 transition-colors">
                      <td className="p-4 font-bold text-stone-700 text-sm flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-stone-200 flex items-center justify-center text-[10px] text-stone-500">✂️</div>
                        {barbero}
                      </td>
                      <td className="p-4 text-right font-medium text-stone-600 bg-stone-50/50">
                        S/ {produccion.toFixed(2)}
                      </td>
                      <td className="p-4 text-right font-bold text-emerald-600 bg-emerald-50/30">
                        S/ {mitad}
                      </td>
                      <td className="p-4 text-right font-bold text-[#B07D54] bg-[#B07D54]/5">
                        S/ {mitad}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}