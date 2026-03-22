"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase"; 

export default function AdminDashboard() {
  // === ESTADOS DE LOGIN ===
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string>(""); 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorLogin, setErrorLogin] = useState("");

  // === ESTADOS DEL DASHBOARD ===
  const [citas, setCitas] = useState<any[]>([]);
  const [sedes, setSedes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // === LÓGICA DE LOGIN ===
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorLogin("");

    if (username === "admin" && password === "markus2026") {
      setUserRole("todas");
      setIsAuthenticated(true);
    } else if (username === "pueblo" && password === "sede123") {
      setUserRole("1"); 
      setIsAuthenticated(true);
    } else if (username === "cercado" && password === "sede123") {
      setUserRole("2"); 
      setIsAuthenticated(true);
    } else {
      setErrorLogin("Credenciales incorrectas. Intenta de nuevo.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
    setUserRole("");
  };

  // === CARGA DE DATOS ===
  const cargarDatos = async () => {
    setIsLoading(true);
    const { data: dataSedes } = await supabase.from('sedes').select('*');
    if (dataSedes) setSedes(dataSedes);

    const { data: dataCitas } = await supabase
      .from('citas')
      .select(`*, barbero:barberos(nombre), sede:sedes(nombre)`)
      .order('fecha_hora', { ascending: true });

    if (dataCitas) setCitas(dataCitas);
    setIsLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      cargarDatos();
    }
  }, [isAuthenticated]);

  // === LÓGICA PARA CANCELAR CITA ===
  const handleCancelarCita = async (citaId: number) => {
    const confirmar = window.confirm("¿Estás seguro de cancelar esta cita? El horario volverá a estar disponible en la web.");
    if (!confirmar) return;

    try {
      await supabase.from('cita_servicios').delete().eq('cita_id', citaId);
      const { error } = await supabase.from('citas').delete().eq('id', citaId);
      if (error) throw error;
      
      alert("Cita cancelada correctamente.");
      cargarDatos(); 
    } catch (error) {
      console.error("Error al cancelar:", error);
      alert("Hubo un error al cancelar la cita.");
    }
  };

  // === PANTALLA DE LOGIN ===
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold font-heading text-black tracking-tighter">MARKUS</h1>
            <p className="text-gray-500 mt-2 text-sm">Acceso a Panel de Administración</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Usuario</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border-2 border-gray-100 rounded-lg p-3 text-black outline-none focus:border-black transition-colors" 
                placeholder="Ej. admin"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Contraseña</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-2 border-gray-100 rounded-lg p-3 text-black outline-none focus:border-black transition-colors" 
                placeholder="••••••••"
              />
            </div>

            {errorLogin && <p className="text-red-500 text-sm font-medium">{errorLogin}</p>}

            <button type="submit" className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition-colors shadow-lg mt-4">
              Ingresar al Sistema
            </button>
          </form>
        </div>
      </div>
    );
  }

  // === FILTRADO SEGÚN ROL ===
  const citasFiltradas = userRole === "todas" 
    ? citas 
    : citas.filter(c => c.sede_id.toString() === userRole);

  const nombreSedeVista = userRole === "todas" 
    ? "Todas las Sedes (Master)" 
    : sedes.find(s => s.id.toString() === userRole)?.nombre || "Sede Local";

  // === PANTALLA DEL DASHBOARD ===
  return (
    <div className="min-h-screen bg-gray-50 p-8 text-black">
      <div className="max-w-6xl mx-auto animate-fade-in">
        
        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm">
          <div>
            <h1 className="text-3xl font-bold font-heading tracking-tighter">MARKUS</h1>
            <p className="text-gray-500 text-sm mt-1">
              Gestionando: <span className="font-bold text-black">{nombreSedeVista}</span>
            </p>
          </div>
          
          {/* BOTONES DE ACCIÓN ARRIBA A LA DERECHA */}
          <div className="flex gap-3">
            <button 
              onClick={cargarDatos}
              className="text-gray-500 hover:text-black font-medium text-sm px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <span>🔄</span> Refrescar
            </button>
            <button 
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-600 font-medium text-sm px-4 py-2 border border-gray-200 rounded-lg hover:bg-red-50 transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          {isLoading ? (
            <div className="p-10 text-center text-gray-500 font-medium">Cargando la base de datos...</div>
          ) : citasFiltradas.length === 0 ? (
            <div className="p-10 text-center text-gray-500 font-medium">No hay reservas programadas para esta sede.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-900 text-white text-xs uppercase tracking-wider">
                  <th className="p-4 font-bold">Fecha y Hora</th>
                  <th className="p-4 font-bold">Cliente</th>
                  <th className="p-4 font-bold">Contacto</th>
                  <th className="p-4 font-bold">Detalle</th>
                  <th className="p-4 text-center font-bold">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {citasFiltradas.map((cita) => {
                  // CORRECCIÓN DE HORA: El navegador ya detecta la zona local por defecto.
                  const fechaLocal = new Date(cita.fecha_hora); 
                  
                  return (
                    <tr key={cita.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-sm">{fechaLocal.toLocaleDateString()}</div>
                        <div className="text-xs text-gray-500 font-medium">{fechaLocal.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-sm">{cita.cliente_nombre} {cita.cliente_apellido}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-gray-600">{cita.cliente_celular}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1 items-start">
                          <span className="bg-gray-100 px-2 py-1 rounded text-xs font-bold text-gray-700">✂️ {cita.barbero?.nombre}</span>
                          {userRole === "todas" && (
                            <span className="bg-blue-50 px-2 py-1 rounded text-xs font-bold text-blue-700">📍 {cita.sede?.nombre}</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => handleCancelarCita(cita.id)}
                          className="text-red-500 hover:text-white border border-red-200 hover:border-red-500 hover:bg-red-500 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm"
                        >
                          Cancelar ✕
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}