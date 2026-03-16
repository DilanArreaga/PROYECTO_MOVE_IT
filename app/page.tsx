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

          {/* Banner de Innovación con IA */}
          <div className="ai-feature-card" style={{
            background: 'linear-gradient(135deg, #dc2626 0%, #8a1e1e 100%)',
            color: 'white',
            padding: '25px',
            borderRadius: '15px',
            margin: '30px 0',
            boxShadow: '0 4px 15px rgba(220, 38, 38, 0.2)'
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

      {/* --- SECCIÓN: DESCARGA LA APP (SIN QR) --- */}
      <section className="download-app-section" style={{
        backgroundColor: '#f9f9f9',
        padding: '60px 20px',
        borderRadius: '20px',
        margin: '40px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        border: '1px solid #eee'
      }}>
        <div className="download-container" style={{ maxWidth: '700px' }}>
          <span style={{
            background: '#dc2626',
            color: 'white',
            padding: '5px 15px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            textTransform: 'uppercase'
          }}>¡Potencia tu Mudanza!</span>
          
          <h2 style={{ fontSize: '2.5rem', margin: '20px 0', color: '#1a1a1a', fontWeight: '800' }}>
            Descarga la App de <span style={{ color: '#dc2626' }}>MoveIt!</span>
          </h2>
          
          <p style={{ fontSize: '1.1rem', color: '#555', marginBottom: '35px', lineHeight: '1.6' }}>
            Obtén presupuestos con <strong>IA</strong>, rastrea tu camión en tiempo real y gestiona todo tu servicio desde tu smartphone. 
            La forma más inteligente de mudarse en Guatemala.
          </p>
          
          <div className="store-buttons" style={{ 
            display: 'flex', 
            gap: '20px', 
            justifyContent: 'center',
            flexWrap: 'wrap' 
          }}>
            <a href="#" style={{
              background: '#1a1a1a',
              color: 'white',
              padding: '14px 30px',
              borderRadius: '12px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '1.1rem',
              transition: '0.3s'
            }}>
              <i className="fa-brands fa-apple" style={{ fontSize: '1.6rem' }}></i> 
              <div style={{ textAlign: 'left' }}>
                <small style={{ display: 'block', fontSize: '0.7rem' }}>Descárgalo en el</small>
                <strong>App Store</strong>
              </div>
            </a>
            
            <a href="#" style={{
              background: '#1a1a1a',
              color: 'white',
              padding: '14px 30px',
              borderRadius: '12px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '1.1rem',
              transition: '0.3s'
            }}>
              <i className="fa-brands fa-google-play" style={{ fontSize: '1.6rem' }}></i>
              <div style={{ textAlign: 'left' }}>
                <small style={{ display: 'block', fontSize: '0.7rem' }}>Disponible en</small>
                <strong>Google Play</strong>
              </div>
            </a>
          </div>
        </div>
      </section>
      {/* --- FIN SECCIÓN DESCARGA --- */}

    </main>
  );
}