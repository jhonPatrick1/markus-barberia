"use client";

import { CalendarDays, LineChart, LogOut, Scissors, Menu, X, Users } from "lucide-react";
import { useState } from "react";

export default function Sidebar({ activeView, setActiveView, userProfile, onLogout }: any) {
  // Estado para controlar si el menú está abierto en celulares
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* === CABECERA MÓVIL (Solo visible en celulares) === */}
      <div className="md:hidden bg-neutral-900 text-white p-4 flex justify-between items-center shadow-md z-20">
        <h1 className="text-xl font-bold font-serif tracking-widest uppercase flex items-center gap-2">
          <Scissors size={20} /> MARKUS
        </h1>
        <button 
          onClick={() => setIsOpen(true)} 
          aria-label="Abrir menú de navegación"
          className="text-white hover:text-neutral-300 transition-colors"
        >
          <Menu size={28} />
        </button>
      </div>

      {/* === OVERLAY OSCURO PARA MÓVIL === */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 z-30 animate-fade-in" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* === MENÚ LATERAL (Sidebar) === */}
      <aside 
        className={`fixed md:static inset-y-0 left-0 w-64 bg-neutral-900 text-white flex flex-col h-full shadow-2xl z-40 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <button 
          onClick={() => setIsOpen(false)} 
          aria-label="Cerrar menú de navegación"
          className="md:hidden absolute top-5 right-5 text-neutral-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        {/* Logo y Cabecera */}
        <div className="p-8 border-b border-neutral-800">
          <h1 className="text-3xl font-bold font-serif tracking-widest uppercase flex items-center gap-2">
            <Scissors size={24} /> MARKUS
          </h1>
          <p className="text-neutral-400 text-xs mt-2 uppercase tracking-widest font-medium">
            {userProfile.tipo === "master" ? "Master Global" : "Admin. Sede"}
          </p>
        </div>

        {/* Menú de Navegación (El flex-1 empuja lo de abajo) */}
        <nav className="flex-1 p-4 space-y-2 mt-4">
          <button
            onClick={() => { 
              setActiveView('agenda'); 
              setIsOpen(false); 
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
              activeView === 'agenda' 
                ? 'bg-white text-black shadow-md' 
                : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
            }`}
          >
            <CalendarDays size={18} />
            Agenda y Citas
          </button>

          <button
            onClick={() => { 
              setActiveView('finanzas'); 
              setIsOpen(false); 
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
              activeView === 'finanzas' 
                ? 'bg-white text-black shadow-md' 
                : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
            }`}
          >
            <LineChart size={18} />
            Panel Financiero
          </button>

          <button
            onClick={() => { 
              setActiveView('gestion'); 
              setIsOpen(false); 
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
              activeView === 'gestion' 
                ? 'bg-white text-black shadow-md' 
                : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
            }`}
          >
            <Users size={18} />
            Gestión de Sede
          </button>

          {/* 🔥 BOTÓN DE CLIENTES MOVIDO ADENTRO DEL NAV 🔥 */}
          <button 
            onClick={() => {
              setActiveView('clientes');
              setIsOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
              activeView === 'clientes' 
                ? 'bg-white text-black shadow-md' 
                : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            Base de Clientes
          </button>
          
        </nav>

        {/* Botón de Salir abajo (Aquí termina el flex-1 y se pega al fondo) */}
        <div className="p-4 border-t border-neutral-800">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold text-neutral-400 hover:bg-red-500/10 hover:text-red-500 transition-all"
          >
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  );
}