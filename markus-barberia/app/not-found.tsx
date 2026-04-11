    import { redirect } from 'next/navigation';

export default function NotFound() {
  // Apenas el servidor detecta que la página no existe, manda al Home
  redirect('/');
}