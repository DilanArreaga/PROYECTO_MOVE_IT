import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container-footer">
        <div className="footer-content">
          
          <div className="footer-section">
            <h2 style={{ color: 'white', marginBottom: '15px' }}>
              <i className="fa-solid fa-truck"></i> ¡MoveIt!
            </h2>
            <p style={{ color: '#ccc', lineHeight: '1.6' }}>
              La mejor logística y almacenamiento en Guatemala. Ahora con presupuestos inteligentes impulsados por Inteligencia Artificial.
            </p>
          </div>

          <div className="footer-section">
            <h3>Enlaces Rápidos</h3>
            <ul>
              <li><Link href="/">Inicio</Link></li>
              <li><Link href="/servicios">Nuestros Servicios</Link></li>
              <li><Link href="/nosotros">Sobre Nosotros</Link></li>
              <li><Link href="/contacto">Atención al Cliente</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Contacto</h3>
            <ul style={{ color: '#ccc', lineHeight: '2' }}>
              <li><i className="fa-solid fa-phone"></i> +502 4805-6297</li>
              <li><i className="fa-solid fa-envelope"></i> contacto@moveit.com.gt</li>
              <li><i className="fa-solid fa-location-dot"></i> Ciudad de Guatemala</li>
            </ul>
          </div>


        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} <strong>¡MoveIt!</strong> - FUNDAMENTOS WEB</p>
          <div className="social-mini" style={{ display: 'flex', gap: '15px', fontSize: '1.2rem' }}>
            <a href="https://www.facebook.com/dylan.arreaga.1" target="_blank" rel="noreferrer"><i className="fa-brands fa-facebook"></i></a>
            <a href="https://www.instagram.com/arreaga._.dilan" target="_blank" rel="noreferrer"><i className="fa-brands fa-instagram"></i></a>
            <a href="https://api.whatsapp.com/send?phone=50248056297" target="_blank" rel="noreferrer"><i className="fa-brands fa-whatsapp"></i></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;