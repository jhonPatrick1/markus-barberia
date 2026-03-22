import type { Metadata } from "next";
import { Oswald, Raleway } from "next/font/google";
import "./globals.css";


// 2. Configuramos Oswald (para títulos)
const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald", // Esta variable la usaremos en Tailwind
  weight: ["400", "700"], // Cargamos normal y negrita
});

// 3. Configuramos Raleway (para textos)
const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  weight: ["300", "400", "600"],
});

export const metadata: Metadata = {
  title: "MARKUS - Barbería | Estilo sin límites",
  description: "La mejor experiencia de barbería en Pueblo Libre y Cercado de Lima. Cortes clásicos, modernos y cuidado de barba.",
  keywords: ["barbería", "lima", "corte de pelo", "barba", "pueblo libre", "markus"],
  icons: {
    icon: '/favicon.ico', // (Opcional si tienes un icono)
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      {/* 4. Inyectamos las variables de las fuentes en el Body */}
      
      <body className={`${oswald.variable} ${raleway.variable} font-sans antialiased`}>
     
        {children}
      </body>
    </html>
  );
}