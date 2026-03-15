import React from 'react';

export default function HomePage() {
  return (
    <main className="main-content">
      <section className="hero-section">
        <br />
        <h2>
          <i className="fa-solid fa-truck"> Servicio de Mudanza </i>
        </h2>
        <br />

        <div className="content-container">
          <p>
            <strong>Move It</strong> es una empresa de servicios de mudanza con sede en la ciudad de Guatemala, que
            ofrece servicios de mudanza nacional, así como también servicios de almacenamiento y
            alquiler de bodegas. La empresa cuenta con un equipo de profesionales capacitados y con experiencia en el
            traslado de bienes de todo tipo, incluyendo muebles, electrónica, obras de arte y otros artículos delicados.
          </p>

          {/* Banner de Innovación con IA - Resaltando tu propuesta de valor */}
         <div className="ai-feature-card" style={{
    /* Cambiamos el degradado para que use solo tonos de rojo */
    background: 'linear-gradient(135deg, #dc2626 0%, #8a1e1e 100%)',
    color: 'white',
    padding: '25px',
    borderRadius: '15px',
    margin: '30px 0',
    boxShadow: '0 4px 15px rgba(220, 38, 38, 0.2)' /* Sombra rojiza sutil */
}}>
    
            <h3><i className="fa-solid fa-robot"></i> Innovación con IA</h3>
            <p>
              La novedad de esta aplicación es que contamos con una implementación de la 
              <strong> inteligencia artificial (Gemini)</strong> la cual nos ayuda a realizar 
              presupuestos automáticamente mediante una foto desde nuestra aplicación móvil.
            </p>
          </div>

          <p>
            Además, <strong>Move It</strong> cuenta con bodegas de almacenamiento seguro y seco, disponibles para alquilar.
            Las bodegas están protegidas con sistemas de seguridad avanzados y se mantienen en condiciones óptimas para
            garantizar la protección de los bienes almacenados. Los clientes pueden alquilar las bodegas por períodos
            cortos o largos, dependiendo de sus necesidades.
          </p>

          <p>
            Nos enorgullecemos de ofrecer servicios de alta calidad a precios competitivos.
            Ya sea que necesite trasladar sus pertenencias a una nueva casa o trasladar su empresa a un nuevo lugar, 
            estamos comprometidos en hacer que su experiencia sea lo más fácil y libre de estrés posible.
          </p>
        </div>
      </section>
    </main>
  );
}