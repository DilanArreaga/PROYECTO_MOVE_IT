"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // <-- Importamos el lector de rutas

export default function Sidebar() {
  const [menuAbierto, setMenuAbierto] = useState(true);
  const pathname = usePathname(); // <-- Guardamos la ruta actual aquí

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
    document.body.classList.toggle('body_move');
  };

  return (
    <>
      <header style={{ position: 'fixed', top: 0, width: '100%', background: '#1e3a8a', padding: '15px 20px', zIndex: 100 }}>
        <div onClick={toggleMenu} style={{ cursor: 'pointer', color: 'white', fontSize: '24px' }}>
          <i className="fas fa-bars"></i>
        </div>
      </header>

      <div className={`menu__side ${menuAbierto ? '' : 'menu__side_move'}`}>
        <div className="name__page">
          <i className="fa-solid fa-truck"></i>
          <h4>¡MoveIt!</h4>
        </div>
        <div className="options__menu">
          
          {/* Aplicamos la clase 'selected' dinámicamente dependiendo de la página */}
          <Link href="/" className={pathname === '/' ? 'selected' : ''}>
            <div className="option"><i className="fas fa-home"></i><h4>Inicio</h4></div>
          </Link>
          
          <Link href="/servicios" className={pathname === '/servicios' ? 'selected' : ''}>
            <div className="option"><i className="fa-solid fa-cart-shopping"></i><h4>Servicios</h4></div>
          </Link>
          
          <Link href="/login" className={pathname === '/login' ? 'selected' : ''}>
            <div className="option"><i className="fa-solid fa-user"></i><h4>Login</h4></div>
          </Link>
          
          <Link href="/tu-pedido" className={pathname === '/tu-pedido' ? 'selected' : ''}>
            <div className="option"><i className="fa-solid fa-location-dot"></i><h4>Tu pedido</h4></div>
          </Link>
          
          <Link href="/contacto" className={pathname === '/contacto' ? 'selected' : ''}>
            <div className="option"><i className="fa-solid fa-phone"></i><h4>Contáctanos</h4></div>
          </Link>
          
          <Link href="/nosotros" className={pathname === '/nosotros' ? 'selected' : ''}>
            <div className="option"><i className="far fa-address-card"></i><h4>Nosotros</h4></div>
          </Link>

        </div>
      </div>
    </>
  );
}