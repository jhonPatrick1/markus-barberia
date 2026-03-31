// Forzando actualizacion para Vercel
import Navbar from "../../components/Navbar"; 
import Footer from "../../components/Footer";
import Preloader from "@/components/Preloader";
// Datos de productos (Simulados)
const products = [
  {
    id: 1,
    name: "Cera Mate Strong",
    price: "S/ 35.00",
    image: "https://images.unsplash.com/photo-1626896262228-e421570778c4?q=80&w=1000&auto=format&fit=crop",
    desc: "Fijación fuerte sin brillo. Ideal para texturizar."
  },
  {
    id: 2,
    name: "Minoxidil 5% Kirkland",
    price: "S/ 60.00",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000&auto=format&fit=crop", // Foto referencial
    desc: "Tratamiento para crecimiento de barba y cabello."
  },
  {
    id: 3,
    name: "After Shave Premium",
    price: "S/ 45.00",
    image: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=1000&auto=format&fit=crop",
    desc: "Cierra poros y refresca la piel después del afeitado."
  },
  {
    id: 4,
    name: "Polvo Texturizador",
    price: "S/ 40.00",
    image: "https://images.unsplash.com/photo-1595348007507-681b94d16d44?q=80&w=1000&auto=format&fit=crop",
    desc: "Volumen instantáneo y efecto mate natural."
  }
];

export default function Shop() {
  return (
    <main className="min-h-screen bg-black text-white">
        <Preloader />
        
      <Navbar />

      {/* --- HEADER DE LA TIENDA --- */}
      <section className="pt-32 pb-16 px-4 text-center bg-neutral-900 border-b border-white/10">
        <h1 className="font-heading text-4xl md:text-6xl font-bold uppercase mb-4 tracking-tighter">
          Markus Store
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          Lleva la calidad de la barbería a tu casa. Productos seleccionados por nuestros expertos.
        </p>
      </section>

      {/* --- GRID DE PRODUCTOS --- */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="group bg-neutral-900 border border-white/10 rounded-xl overflow-hidden hover:border-white/30 transition-all duration-300">
              
              {/* Imagen */}
              <div className="aspect-square relative overflow-hidden bg-white/5">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="object-cover w-full h-full group-hover:scale-110 transition duration-500 opacity-80 group-hover:opacity-100"
                />
                {/* Etiqueta de Precio Flotante */}
                <div className="absolute top-3 right-3 bg-black text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20">
                  {product.price}
                </div>
              </div>

              {/* Info */}
              <div className="p-6">
                <h3 className="font-bold text-lg text-white mb-2 uppercase">{product.name}</h3>
                <p className="text-gray-500 text-sm mb-6 h-10 leading-snug">{product.desc}</p>
                
                {/* Botón Comprar (WhatsApp) */}
                <a 
                  href={`https://wa.me/51917876813?text=Hola%20Markus%2C%20quisiera%20comprar%20el%20producto%3A%20${product.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition uppercase text-sm tracking-wide"
                >
                  Comprar Ahora
                </a>
              </div>

            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}