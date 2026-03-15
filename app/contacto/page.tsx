import React from 'react';
import '../../styles/contacto.css'; // Asegúrate de crear este archivo

export default function Contacto() {
  return (
    <div className="contacto-container">
      {/* Sección principal en dos columnas */}
      <div className="contacto-grid">
        
        {/* COLUMNA IZQUIERDA: Info de contacto */}
        <div className="info-section">
          <h2>Información de Contacto</h2>
          <p>
            ¿Tienes alguna pregunta o necesitas ayuda con tu mudanza? 
            No dudes en contactarnos directamente.
          </p>
          
          <div className="contact-details">
            <div className="detail-item">
              <span>📞 Teléfono:</span> +502 4805-6297
            </div>
            <div className="detail-item">
              <span>✉️ Correo:</span> contacto@moveit.com.gt
            </div>
           
          </div>

          <div className="social-links">
            <h3>Síguenos en Redes</h3>
            {/* Alineación horizontal de iconos organizados */}
            <div className="icons-wrapper">
              <a href="#" target="_blank"><i className="fa-brands fa-whatsapp"></i></a>
              <a href="#" target="_blank"><i className="fa-brands fa-instagram"></i></a>
              <a href="#" target="_blank"><i className="fa-brands fa-facebook"></i></a>
              <a href="#" target="_blank"><i className="fa-solid fa-phone-volume"></i></a>
              <a href="#" target="_blank"><i className="fa-solid fa-envelope"></i></a>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: Formulario moderno */}
        <div className="form-section">
          <h2>Envíanos un mensaje</h2>
          <form>
            <div className="input-group">
              <label>Nombre:</label>
              <input type="text" placeholder="Escribe tu nombre completo" required />
            </div>
            <div className="input-group">
              <label>Correo Electrónico:</label>
              <input type="email" placeholder="ejemplo@correo.com" required />
            </div>
            <div className="input-group">
              <label>Mensaje:</label>
              <textarea placeholder="¿Cómo podemos ayudarte?" rows={6} required></textarea>
            </div>
            {/* Botón en rojo corporativo */}
            <button type="submit" className="btn-primary">Enviar Mensaje</button>
          </form>
        </div>

      </div>
    </div>
  );
}