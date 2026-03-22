"use client";

import { useState, useEffect } from "react";
import Link from "next/link"; // Link para el Logo
import BookingModal from "./BookingModal";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1000, 
      once: true,     
    });
  }, []);

  return (
    <>
      <nav className="fixed w-full z-50 flex justify-between items-center px-8 py-4 bg-black/90 backdrop-blur-md border-b border-white/10">
        {/*  */}
        <Link href="/" className="font-heading text-2xl font-bold tracking-tighter text-white hover:text-amber-500 transition duration-300">
          MARKUS
        </Link>

        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-300">
          {/* */}
          <a href="#" className="hover:text-amber-500 transition duration-300">INICIO</a>
          <a href="#servicios" className="hover:text-amber-500 transition duration-300">SERVICIOS</a>
          <a href="#crew" className="hover:text-amber-500 transition duration-300">STAFF</a>
          <a href="/tienda" className="text-amber-500 font-bold hover:text-white transition duration-300">TIENDA</a>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-full font-semibold transition text-sm shadow-lg shadow-amber-600/20"
        >
          Reservar
        </button>
      </nav>

      <BookingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}