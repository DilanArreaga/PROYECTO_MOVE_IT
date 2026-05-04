"use client";
import React from 'react';
import '../../styles/servicios.css'; 

export default function ServiciosPage() {
  return (
    <main style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h2 style={{ fontSize: '2.8rem', color: '#1a1a1a', fontWeight: '800' }}>
          <i className="fa-solid fa-truck-fast" style={{ color: '#dc2626', marginRight: '15px' }}></i>
          Nuestros Servicios
        </h2>
        <p style={{ fontSize: '1.1rem', color: '#666', marginTop: '10px' }}>
          Logística avanzada con el respaldo de tecnología IA para tu tranquilidad.
        </p>
      </div>

      <div className="container__card" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '30px' }}>
        
        {/* Tarjeta 1: Mudanza Tradicional */}
        <div className="card__father">
            <div className="card">
                <div className="card__front" style={{ backgroundImage: "url('/img/Nacional.jfif')" }}>
                    <div className="bg"></div>
                    <div className="body__card_front">
                        <h1 style={{ fontSize: '1.6rem' }}>Mudanza Tradicional</h1>
                    </div>
                </div>
                <div className="card__back" style={{ backgroundColor: '#dc2626' }}>
                    <div className="body__card_back" style={{ padding: '20px' }}>
                        <h1 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '10px' }}>Servicio Residencial</h1>
                        <p style={{ fontSize: '0.95rem', color: '#fff', lineHeight: '1.5', marginBottom: '15px' }}>
                            Especialistas en el traslado de hogares y apartamentos dentro de toda Guatemala. 
                            Utilizamos IA para darte un presupuesto exacto mediante fotos de tus espacios.
                        </p>
                        <p style={{ fontSize: '0.9rem', color: '#fff', opacity: '0.9', borderTop: '1px solid rgba(255,255,255,0.3)', paddingTop: '10px' }}>
                            Incluye protección de muebles con mantas premium, desarmado de camas y rastreo GPS en vivo durante todo el trayecto.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* Tarjeta 2: Almacenamiento */}
        <div className="card__father">
            <div className="card">
                <div className="card__front" style={{ backgroundImage: "url('/img/Bodega2.jfif')" }}>
                    <div className="bg"></div>
                    <div className="body__card_front">
                        <h1 style={{ fontSize: '1.6rem' }}>Almacenamiento</h1>
                    </div>
                </div>
                <div className="card__back" style={{ backgroundColor: '#dc2626' }}>
                    <div className="body__card_back" style={{ padding: '20px' }}>
                        <h1 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '10px' }}>Servicios de bodegas</h1>
                        <p style={{ fontSize: '0.95rem', color: '#fff', lineHeight: '1.5', marginBottom: '15px' }}>
                            Contamos con unidades de almacenamiento seguro y monitoreado las 24 horas del día. 
                            Perfecto para mudanzas que requieren un tiempo de espera o inventarios excedentes.
                        </p>
                        <p style={{ fontSize: '0.9rem', color: '#fff', opacity: '0.9', borderTop: '1px solid rgba(255,255,255,0.3)', paddingTop: '10px' }}>
                            Nuestras instalaciones cuentan con control de plagas, humedad y acceso restringido mediante códigos de seguridad únicos.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* Tarjeta 3: Mudanza de Empresas */}
        <div className="card__father">
            <div className="card">
                <div className="card__front" style={{ backgroundImage: "url('/img/Internacional.jfif')" }}>
                    <div className="bg"></div>
                    <div className="body__card_front">
                        <h1 style={{ fontSize: '1.6rem' }}>Mudanza de Empresas</h1>
                    </div>
                </div>
                <div className="card__back" style={{ backgroundColor: '#dc2626' }}>
                    <div className="body__card_back" style={{ padding: '20px' }}>
                        <h1 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '10px' }}>Servicio Corporativo</h1>
                        <p style={{ fontSize: '0.95rem', color: '#fff', lineHeight: '1.5', marginBottom: '15px' }}>
                            Logística de alto nivel para oficinas y locales comerciales. Minimizamos el tiempo de 
                            inactividad para que tu empresa no deje de operar durante el traslado.
                        </p>
                        <p style={{ fontSize: '0.9rem', color: '#fff', opacity: '0.9', borderTop: '1px solid rgba(255,255,255,0.3)', paddingTop: '10px' }}>
                            Expertos en manejo de equipo IT, servidores y mobiliario modular. Ofrecemos servicios nocturnos y de fin de semana.
                        </p>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </main>
  );
}