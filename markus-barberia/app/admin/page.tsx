"use client";
// Esto es un cambio real
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase"; 
import Sidebar from "../../components/admin/Sidebar";
import AgendaView from "../../components/admin/AgendaView";
import FinanceView from "../../components/admin/FinanceView";

type UserProfile = { tipo: "master" | "sede" | "barbero", refId: string | number };

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({ tipo: "master", refId: "todas" }); 
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [errorLogin, setErrorLogin] = useState("");
  const [isCheckingSession, setIsCheckingSession] = useState(true); 
  const [isLoggingIn, setIsLoggingIn] = useState(false); 

  const [citas, setCitas] = useState<any[]>([]);
  const [sedes, setSedes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeView, setActiveView] = useState<'agenda' | 'finanzas'>('agenda');

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        asignarPerfilPorEmail(session.user.email);
        setIsAuthenticated(true);
      }
      setIsCheckingSession(false);
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        asignarPerfilPorEmail(session.user.email);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  const asignarPerfilPorEmail = (userEmail: string | undefined) => {
    if (userEmail === "admin@markus.com") setUserProfile({ tipo: "master", refId: "todas" });
    else if (userEmail === "pueblo@markus.com") setUserProfile({ tipo: "sede", refId: 1 }); 
    else if (userEmail === "cercado@markus.com") setUserProfile({ tipo: "sede", refId: 2 }); 
    else if (userEmail === "magdalena@markus.com") setUserProfile({ tipo: "sede", refId: 3 }); 
    else if (userEmail === "sebastian@markus.com") setUserProfile({ tipo: "barbero", refId: 2 }); 
    else if (userEmail === "piero@markus.com") setUserProfile({ tipo: "barbero", refId: 8 }); 
    else setUserProfile({ tipo: "sede", refId: 0 }); 
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorLogin("");
    setIsLoggingIn(true); 
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setErrorLogin("Credenciales incorrectas.");
      else if (data.session) {
        asignarPerfilPorEmail(data.session.user.email);
        setIsAuthenticated(true);
      }
    } catch (err) {
      setErrorLogin("Hubo un error de conexión.");
    } finally {
      setIsLoggingIn(false); 
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut(); 
    setIsAuthenticated(false);
    setEmail("");
    setPassword("");
  };

  const cargarDatos = async () => {
    setIsLoading(true);
    const { data: dataSedes } = await supabase.from('sedes').select('*');
    if (dataSedes) setSedes(dataSedes);

    // 1. Preparamos el query
    let query = supabase
      .from('citas')
      .select(`*, barbero:barberos(nombre), sede:sedes(nombre), cita_servicios(servicios(nombre, precio))`)
      .order('fecha_hora', { ascending: true });

    // 2. 🔥 FIX SEDE: Filtramos directo en la BD para mayor seguridad y velocidad
    if (userProfile.tipo === "sede") {
      query = query.eq('sede_id', userProfile.refId);
    } else if (userProfile.tipo === "barbero") {
      query = query.eq('barbero_id', userProfile.refId);
    }

    const { data: dataCitas } = await query;
    if (dataCitas) setCitas(dataCitas);
    setIsLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) cargarDatos();
  }, [isAuthenticated]);

  // 👇 BÚSQUEDA DINÁMICA DEL NOMBRE PARA LA CABECERA 👇
  const obtenerNombreVista = () => {
    if (userProfile.tipo === "master") return "Vista Master (Global)";
    if (userProfile.tipo === "sede") {
      const sedeEncontrada = sedes.find(s => s.id?.toString() === userProfile.refId.toString());
      return sedeEncontrada ? `Sede: ${sedeEncontrada.nombre}` : "Administración de Sede";
    }
    return "";
  };

  const nombreVista = obtenerNombreVista();

  if (isCheckingSession) return <div className="min-h-screen bg-neutral-900 flex items-center justify-center text-white font-mono tracking-widest text-sm uppercase">Cargando Panel...</div>;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md animate-fade-in">
          <h1 className="text-3xl font-bold font-serif text-black tracking-tighter uppercase text-center mb-8">MARKUS</h1>
          <form onSubmit={handleLogin} className="space-y-5">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border-2 border-stone-200 rounded-lg p-3 text-black outline-none focus:border-black" placeholder="Correo" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border-2 border-stone-200 rounded-lg p-3 text-black outline-none focus:border-black" placeholder="Contraseña" required />
            {errorLogin && <p className="text-red-500 text-sm">{errorLogin}</p>}
            <button type="submit" disabled={isLoggingIn} className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-stone-800 disabled:opacity-50 transition-colors">
              {isLoggingIn ? "Verificando..." : "Ingresar"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (userProfile.tipo === "barbero") {
    return (
      <div className="min-h-screen bg-stone-50 p-4 md:p-8">
        <AgendaView 
          citasRaw={citas} 
          sedes={sedes}
          userProfile={userProfile} 
          cargarDatos={cargarDatos}
          onLogout={handleLogout}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-stone-50 overflow-hidden">
      
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        userProfile={userProfile} 
        onLogout={handleLogout} 
      />

      <main className="flex-1 overflow-y-auto p-4 md:p-8 animate-fade-in">
        
        {/* 👇 NUEVA CABECERA BLANCA (Reemplaza la que perdimos) 👇 */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 bg-white p-5 rounded-xl shadow-sm border border-stone-200">
          <div>
            <h2 className="text-xl font-bold font-serif text-stone-800 uppercase tracking-wide">{nombreVista}</h2>
            <p className="text-xs text-stone-500 font-medium tracking-widest uppercase mt-1">Panel de Control Administrativo</p>
          </div>
          <button 
            onClick={cargarDatos} 
            className="text-stone-600 hover:text-black font-bold text-sm px-4 py-2 border border-stone-200 rounded-lg transition-colors bg-stone-50 hover:bg-stone-100 flex items-center gap-2"
          >
            🔄 Refrescar Datos
          </button>
        </div>

        {activeView === 'agenda' ? (
          <AgendaView 
            citasRaw={citas} 
            sedes={sedes}
            userProfile={userProfile} 
            cargarDatos={cargarDatos}
            onLogout={handleLogout} 
          />
        ) : (
          <FinanceView 
            citasRaw={citas} 
            sedes={sedes}
            userProfile={userProfile}
          />
        )}
      </main>

    </div>
  );
}