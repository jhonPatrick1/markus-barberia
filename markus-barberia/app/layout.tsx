import type { Metadata } from "next";
import { Oswald, Raleway } from "next/font/google";
import "./globals.css";

// 2. Configuramos Oswald (para títulos)
const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  weight: ["400", "700"],
});

// 3. Configuramos Raleway (para textos)
const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  weight: ["300", "400", "600"],
});

export const metadata: Metadata = {
  // === SEO BÁSICO Y PREMIUM ===
  title: "MARKUS Barbería | Corte Clásico y Estilo Premium",
  description: "Vive la experiencia MARKUS. Especialistas en barbería clásica, cortes modernos y perfilado de barba de alto nivel en Pueblo Libre, Cercado de Lima y Magdalena. Agenda tu cita online.",
  keywords: [
    "barbería premium", 
    "barber shop lima", 
    "corte de cabello hombre", 
    "cuidado de barba", 
    "barbería pueblo libre", 
    "barbería magdalena", 
    "barbería cercado de lima", 
    "markus barbería"
  ],
  
  // === OPEN GRAPH (Para Facebook, LinkedIn, WhatsApp) ===
  openGraph: {
    title: "MARKUS Barbería | Descubre Tu Mejor Versión y Estilo", // Pasó de 47 a 52 caracteres (Verde)
    description: "Reserva tu cita en segundos. Descubre la mejor experiencia de barbería premium en Lima con nuestros especialistas.", // Pasó de 106 a 114 caracteres (Verde)
    url: "markus-barberia-7a4p.vercel.app", 
    siteName: "MARKUS Barbería",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Instalaciones y estilo de MARKUS Barbería",
      },
    ],
    locale: "es_PE",
    type: "website",
  },

  // === TWITTER CARDS (Para Twitter/X) ===
  twitter: {
    card: "summary_large_image",
    title: "MARKUS Barbería | Estilo sin límites",
    description: "Agenda tu cita online en segundos y vive la experiencia MARKUS.",
    images: ["/og-image.jpg"],
  },
  
  // (Opcional) Le decimos a los bots de Google que sí indexen la página
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${oswald.variable} ${raleway.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}