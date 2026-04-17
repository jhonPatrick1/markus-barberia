/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        // Limpiamos el link de Cercado de Lima
        source: '/cercado-de-lima',
        destination: '/',
        permanent: true,
      },
      {
        // Limpiamos el link de Producto 2
        source: '/producto-2',
        destination: '/',
        permanent: true,
      },
      {
        // Limpiamos cualquier link que empiece con /pro (visto en Google)
        source: '/pro/:path*',
        destination: '/',
        permanent: true,
      },
      {
        // Limpiamos cualquier link de la tienda vieja (shop)
        source: '/shop/:path*',
        destination: '/',
        permanent: true,
      }
    ];
  },
};

export default nextConfig;