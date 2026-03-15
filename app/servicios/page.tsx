import React from 'react';
import Link from 'next/link';
import '../../styles/servicios.css'; // Cargamos tus estilos de tarjetas 3D

export default function ServiciosPage() {
  return (
    <main>
      <h2><i className="fa-solid fa-cart-shopping"></i> Nuestros Servicios</h2>
      <br />
      <div className="container__card">
        
        {/* Tarjeta 1: Nacional */}
        <div className="card__father">
            <div className="card">
                <div className="card__front" style={{ backgroundImage: "url('/img/Nacional.jfif')" }}>
                    <div className="bg"></div>
                    <div className="body__card_front">
                        <h1>Nuestro servicio nacional</h1>
                    </div>
                </div>
                <div className="card__back">
                    <div className="body__card_back">
                        <h1>Servicio Nacional</h1>
                        <p>Nos encargamos del traslado de tus bienes a cualquier departamento de Guatemala con la mayor seguridad.</p>
                        <Link href="/servicios/nacional">
                            <input type="button" value="Leer Más" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>

        {/* Tarjeta 2: Bodegas */}
        <div className="card__father">
            <div className="card">
                <div className="card__front" style={{ backgroundImage: "url('/img/Bodega2.jfif')" }}>
                    <div className="bg"></div>
                    <div className="body__card_front">
                        <h1>Nuestro servicio de bodegas</h1>
                    </div>
                </div>
                <div className="card__back">
                    <div className="body__card_back">
                        <h1>Servicios de bodegas</h1>
                        <p>Almacenamiento seguro, amplio y monitoreado las 24 horas del día para tus pertenencias más valiosas.</p>
                        <Link href="/servicios/bodega">
                            <input type="button" value="Leer Más" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>

        {/* Tarjeta 3: Internacional/Empresas */}
        <div className="card__father">
            <div className="card">
                <div className="card__front" style={{ backgroundImage: "url('/img/Internacional.jfif')" }}>
                    <div className="bg"></div>
                    <div className="body__card_front">
                        <h1>Nuestro servicio a empresas</h1>
                    </div>
                </div>
                <div className="card__back">
                    <div className="body__card_back">
                        <h1>Servicio Internacional</h1>
                        <p>Logística completa y especializada para el traslado de mobiliario y equipo de oficinas empresariales.</p>
                        <Link href="/servicios/internacional">
                            <input type="button" value="Leer Más" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </main>
  );
}