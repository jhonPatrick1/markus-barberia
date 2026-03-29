"use client";

import { useState } from "react";
import { CheckCircle2, X } from "lucide-react";

export default function ChargeModal({ cita, onClose, onConfirmarCobro }: any) {
  const [monto, setMonto] = useState<string>("35.00"); 
  const [metodoPago, setMetodoPago] = useState("Efectivo");
  const [isProcesando, setIsProcesando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcesando(true);
    await onConfirmarCobro(cita.id, Number(monto), metodoPago);
    setIsProcesando(false);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full relative">
        
        <button onClick={onClose} aria-label="Cerrar modal" className="absolute top-4 right-4 text-stone-400 hover:text-stone-800 transition-colors">
          <X size={20} />
        </button>
        
        <div className="mb-6 text-center">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
             <CheckCircle2 size={28} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Cobrar Servicio</h3>
          <p className="text-xs text-stone-500 mt-1 uppercase tracking-widest font-medium">Cliente: {cita.cliente_nombre}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="input-monto" className="block text-xs font-bold text-stone-500 uppercase mb-1 tracking-wider">Monto Final (S/)</label>
            <input 
              id="input-monto"
              type="number" step="0.10" required
              value={monto} onChange={e => setMonto(e.target.value)}
              className="w-full border-2 border-stone-200 rounded-lg p-3 text-2xl font-bold text-center text-stone-900 outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
          
          <div>
            <label htmlFor="select-metodo" className="block text-xs font-bold text-stone-500 uppercase mb-1 tracking-wider">Método de Pago</label>
            <select 
              id="select-metodo"
              value={metodoPago} onChange={e => setMetodoPago(e.target.value)}
              className="w-full border-2 border-stone-200 rounded-lg p-3 text-stone-900 outline-none focus:border-emerald-500 font-medium bg-white"
            >
              <option value="Efectivo">Efectivo</option>
              <option value="Yape">Yape</option>
              <option value="Plin">Plin</option>
              <option value="Tarjeta">Tarjeta</option>
            </select>
          </div>

          <button 
            type="submit" disabled={isProcesando}
            className="w-full py-4 mt-4 rounded-lg font-bold text-sm bg-black text-white hover:bg-stone-800 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
          >
            {isProcesando ? "Procesando..." : "Confirmar Cobro"}
          </button>
        </form>
      </div>
    </div>
  );
}