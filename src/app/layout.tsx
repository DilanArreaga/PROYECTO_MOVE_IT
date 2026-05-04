import '../styles/globals.css';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

// Esto ayuda al SEO (Buscadores como Google)
export const metadata = {
  title: '¡MoveIt! - Mudanzas e IA',
  description: 'Servicio de mudanza, almacenamiento y bodegas en Guatemala.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        {/* Cargamos FontAwesome para que todos tus iconos funcionen */}
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" 
          crossOrigin="anonymous" 
          referrerPolicy="no-referrer" 
        />
      </head>
      <body id="body">
        
        {/* El menú lateral interactivo */}
        <Sidebar />

        {/* Aquí Next.js inyecta el contenido de la página en la que estés (page.tsx) */}
        {children}

        {/* El pie de página */}
        <Footer />
        
      </body>
    </html>
  );
}