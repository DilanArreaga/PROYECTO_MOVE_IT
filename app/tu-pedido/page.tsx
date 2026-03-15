"use client";

import React from 'react';
import '../../styles/tu-pedido.css';

export default function TuPedido() {
  return (
    <div className="pedido-container">
      <h1 className="pedido-header">
        <i className="fa-solid fa-truck-ramp-box"></i> Seguimiento en Vivo
      </h1>

      {/* Buscador */}
      <div className="search-box">
        <input type="text" placeholder="Introduce tu código de rastreo..." />
        <button type="button">Buscar</button>
      </div>

      {/* TARJETAS EN FILA HORIZONTAL (SOLO RUTA Y ESTADO) */}
      <div className="resumen-horizontal">
        
        {/* Origen y Destino */}
        <div className="card-info">
          <span>📍 Trayecto de Mudanza</span>
          <strong>Ciudad de Guatemala ➔ Antigua Guatemala</strong>
        </div>

        {/* Estado actual */}
        <div className="card-info">
          <span>📦 Estado del Pedido</span>
          <strong style={{color: '#16a34a'}}>En ruta de entrega</strong>
        </div>

      </div>

      {/* MAPA CORREGIDO */}
      <div className="map-container">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15444.64684496459!2d-90.741088!3d14.558585!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85890e062274943b%3A0x7d5e45a278ec6122!2sAntigua%20Guatemala!5e0!3m2!1ses!2sgt!4v1710500000000!5m2!1ses!2sgt"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
        ></iframe>
      </div>

      <p className="update-info">
        <i className="fa-solid fa-clock"></i> Localización actualizada: Hace 1 minuto
      </p>
    </div>
  );
}