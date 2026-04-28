"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { Search, Plus, User, Phone, Mail, Edit2, X, Trash2, Award } from "lucide-react";

export default function CRMView() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  // Estados del Modal Formulario
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ nombre: "", celular: "", correo: "" });

  // 🔥 NUEVO: Estados para el Modal de Eliminación Premium 🔥
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean, id: number | null, nombre: string }>({ isOpen: false, id: null, nombre: "" });
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchClientes = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('cantidad_citas', { ascending: false, nullsFirst: false }) 
      .order('fecha_registro', { ascending: false });
    
    if (!error && data) {
      setClientes(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const abrirModalNuevo = () => {
    setEditingId(null);
    setFormData({ nombre: "", celular: "", correo: "" });
    setIsModalOpen(true);
  };

  const abrirModalEditar = (cliente: any) => {
    setEditingId(cliente.id);
    setFormData({ nombre: cliente.nombre, celular: cliente.celular || "", correo: cliente.correo || "" });
    setIsModalOpen(true);
  };

  // 🔥 FUNCIÓN ACTUALIZADA: Abre el modal bonito en lugar del feo window.confirm 🔥
  const clickEliminar = (id: number, nombre: string) => {
    setDeleteConfirm({ isOpen: true, id, nombre });
  };

  const ejecutarEliminacion = async () => {
    if (!deleteConfirm.id) return;
    setIsDeleting(true);
    
    try {
      const { error } = await supabase.from('clientes').delete().eq('id', deleteConfirm.id);
      if (error) throw error;
      
      await fetchClientes();
      setDeleteConfirm({ isOpen: false, id: null, nombre: "" }); // Cerramos modal al terminar
    } catch (error) {
      console.error("Error eliminando cliente:", error);
      alert("Hubo un error al intentar eliminar el cliente.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const nombreLimpio = formData.nombre.trim();
      
      if (editingId) {
        await supabase.from('clientes').update({
          nombre: nombreLimpio,
          celular: formData.celular,
          correo: formData.correo
        }).eq('id', editingId);
      } else {
        await supabase.from('clientes').insert({
          nombre: nombreLimpio,
          celular: formData.celular,
          correo: formData.correo || "contacto@cliente.com",
          cantidad_citas: 0 
        });
      }
      
      await fetchClientes();
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Error guardando cliente:", error);
      if (error.code === '23505') { 
        alert("¡Error! Ese número de celular ya está registrado en otro cliente.");
      } else {
        alert("Hubo un error al guardar el cliente.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const clientesFiltrados = clientes.filter(c => 
    c.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.celular?.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* BARRA SUPERIOR Y BUSCADOR */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nombre o celular..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border-2 border-stone-200 rounded-lg text-sm outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
        
        <button 
          onClick={abrirModalNuevo}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-black hover:bg-stone-800 text-white rounded-lg text-sm font-bold transition-colors shadow-sm"
        >
          <Plus size={18} /> Nuevo Cliente
        </button>
      </div>

      {/* TABLA DE BASE DE DATOS */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-stone-100 text-stone-500 text-xs uppercase tracking-wider border-b border-stone-200">
                <th className="p-4 font-bold">Cliente</th>
                <th className="p-4 font-bold">Contacto</th>
                <th className="p-4 font-bold text-center">Visitas</th>
                <th className="p-4 font-bold">Fecha de Registro</th>
                <th className="p-4 font-bold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {isLoading ? (
                <tr><td colSpan={5} className="p-8 text-center text-stone-400 font-medium">Cargando base de datos...</td></tr>
              ) : clientesFiltrados.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-stone-400 font-medium">No se encontraron clientes.</td></tr>
              ) : (
                clientesFiltrados.map((cliente) => {
                  const fechaReg = new Date(cliente.fecha_registro).toLocaleDateString();
                  const visitas = cliente.cantidad_citas || 0;
                  const esFrecuente = visitas >= 3;

                  return (
                    <tr key={cliente.id} className="hover:bg-stone-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-stone-500 font-bold text-xs uppercase shrink-0">
                            {cliente.nombre?.charAt(0) || "C"}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-stone-800 text-sm">{cliente.nombre}</span>
                            {esFrecuente && (
                              <span className="text-[9px] font-bold text-amber-600 uppercase tracking-widest flex items-center gap-1 mt-0.5">
                                <Award size={10} /> Cliente Frecuente
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1 text-xs text-stone-600 font-medium">
                          <span className="flex items-center gap-2"><Phone size={12} className="text-stone-400"/> {cliente.celular || "Sin celular"}</span>
                          <span className="flex items-center gap-2"><Mail size={12} className="text-stone-400"/> {cliente.correo || "Sin correo"}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className={`inline-flex items-center justify-center min-w-[32px] h-8 px-2 rounded-lg font-bold text-sm border shadow-sm ${esFrecuente ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-white text-stone-600 border-stone-200'}`}>
                          {visitas}
                        </div>
                      </td>
                      <td className="p-4 text-xs text-stone-500 font-medium">{fechaReg}</td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button 
                            onClick={() => abrirModalEditar(cliente)}
                            className="p-2 text-stone-400 hover:text-[#25D366] hover:bg-[#25D366]/10 rounded-lg transition-colors"
                            title="Editar Cliente"
                          >
                            <Edit2 size={16} />
                          </button>
                          
                          <button 
                            onClick={() => clickEliminar(cliente.id, cliente.nombre)}
                            className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar Cliente"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🔥 NUEVO MODAL DE ELIMINACIÓN (BONITO) 🔥 */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center relative border-2 border-red-500/20">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Trash2 size={32} />
            </div>
            <h3 className="font-serif text-2xl font-bold text-stone-800 mb-2 uppercase tracking-widest">¿Eliminar Cliente?</h3>
            <p className="text-stone-500 text-sm font-medium mb-8 leading-relaxed">
              Estás a punto de borrar a <strong className="text-stone-800">{deleteConfirm.nombre}</strong> de tu base de datos. Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button 
                type="button" 
                onClick={() => setDeleteConfirm({ isOpen: false, id: null, nombre: "" })} 
                disabled={isDeleting}
                className="flex-1 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="button" 
                onClick={ejecutarEliminacion} 
                disabled={isDeleting}
                className="flex-1 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30 disabled:opacity-50"
              >
                {isDeleting ? "Borrando..." : "Sí, Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL AGREGAR/EDITAR CLIENTE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              title="Cerrar modal"
              aria-label="Cerrar modal"
              className="absolute top-4 right-4 text-stone-400 hover:text-black"
            >
              <X size={20} />
            </button>
            
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <User className="text-[#25D366]" /> 
              {editingId ? "Editar Cliente" : "Nuevo Cliente"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5">Nombre Completo</label>
                <input required type="text" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} className="w-full border-2 border-stone-200 rounded-lg p-2.5 outline-none focus:border-[#25D366] text-sm" placeholder="Ej. Juan Pérez" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5">Celular / WhatsApp (ÚNICO)</label>
                <input required type="tel" value={formData.celular} onChange={e => setFormData({...formData, celular: e.target.value})} className="w-full border-2 border-stone-200 rounded-lg p-2.5 outline-none focus:border-[#25D366] text-sm" placeholder="Ej. 987654321" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1.5">Correo Electrónico (Opcional)</label>
                <input type="email" value={formData.correo} onChange={e => setFormData({...formData, correo: e.target.value})} className="w-full border-2 border-stone-200 rounded-lg p-2.5 outline-none focus:border-[#25D366] text-sm" placeholder="Ej. juan@gmail.com" />
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full py-3 mt-4 rounded-lg font-bold text-sm bg-black text-white hover:bg-stone-800 transition-colors disabled:opacity-50 shadow-lg">
                {isSubmitting ? "Guardando..." : "Guardar Cliente"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}