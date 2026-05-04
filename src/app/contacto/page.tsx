"use client"; 

import React, { useState, useRef } from 'react'; // 1. Añadimos useRef
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase'; 
import emailjs from '@emailjs/browser'; // 2. Importamos EmailJS
import '../../styles/contacto.css'; 

export default function Contacto() {
  
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [estadoEnvio, setEstadoEnvio] = useState('');
  
  // 3. Creamos una referencia para el formulario
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setEstadoEnvio('enviando');

    // 4. Tus IDs de EmailJS (Cámbialos por los tuyos)
    const SERVICE_ID = 'TU_SERVICE_ID';
    const TEMPLATE_ID = 'TU_TEMPLATE_ID';
    const PUBLIC_KEY = 'TU_PUBLIC_KEY';

    try {
      // --- PARTE A: Guardar en Firebase (Tu código original) ---
      await addDoc(collection(db, 'mensajes_contacto'), {
        nombre,
        correo,
        mensaje,
        fecha: new Date().toISOString()
      });

      // --- PARTE B: Enviar correo con EmailJS ---
      if (formRef.current) {
        await emailjs.sendForm(
          "service_ge3gdqr", 
          "template_dgz6z5h", 
          formRef.current, 
          "6iI3kkbMcqmASkXMi"
        );
      }

      // Éxito total
      setEstadoEnvio('exito');
      setNombre('');
      setCorreo('');
      setMensaje('');

      setTimeout(() => setEstadoEnvio(''), 4000);

    } catch (error) {
      console.error("Error en el proceso:", error);
      setEstadoEnvio('error');
      setTimeout(() => setEstadoEnvio(''), 4000);
    }
  };

  return (
    <div className="contacto-container">
      <div className="contacto-grid">
        
        <div className="info-section">
          <h2>Información de Contacto</h2>
          <p>
            ¿Tienes alguna pregunta o necesitas ayuda con tu mudanza? 
            No dudes en contactarnos directamente.
          </p>
          
          <div className="contact-details">
            <div className="detail-item">
              <span>📞 Teléfono:</span>  +502 4805-6297 / 4778-6314
            </div>
            <div className="detail-item">
              <span>✉️ Correo:</span> moveitcontacto@gmail.com
            </div>
          </div>

          <div className="social-links">
            <h3>Síguenos en Redes</h3>
            <div className="icons-wrapper">
              <a href="https://api.whatsapp.com/send?phone=50248056297" target="_blank" rel="noreferrer"><i className="fa-brands fa-whatsapp"></i></a>
              <a href="https://www.instagram.com/move_it__/" target="_blank" rel="noreferrer"><i className="fa-brands fa-instagram"></i></a>
              <a href="https://www.facebook.com/dylan.arreaga" target="_blank" rel="noreferrer"><i className="fa-brands fa-facebook"></i></a>
              <a href="mailto:moveitcontacto@gmail.com" target="_blank" rel="noreferrer"><i className="fa-solid fa-envelope"></i></a>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Envíanos un mensaje</h2>
          
          {/* 5. Agregamos la ref al form y nombres a los inputs */}
          <form ref={formRef} onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Nombre:</label>
              <input 
                name="nombre" // Nombre para la plantilla de EmailJS
                type="text" 
                placeholder="Escribe tu nombre completo" 
                required 
                value={nombre}
                onChange={(e) => setNombre(e.target.value)} 
              />
            </div>
            <div className="input-group">
              <label>Correo Electrónico:</label>
              <input 
                name="correo" // Nombre para la plantilla de EmailJS
                type="email" 
                placeholder="ejemplo@correo.com" 
                required 
                value={correo}
                onChange={(e) => setCorreo(e.target.value)} 
              />
            </div>
            <div className="input-group">
              <label>Mensaje:</label>
              <textarea 
                name="mensaje" // Nombre para la plantilla de EmailJS
                placeholder="¿Cómo podemos ayudarte?" 
                rows={6} 
                required
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)} 
              ></textarea>
            </div>

            {estadoEnvio === 'exito' && <p style={{ color: '#16a34a', fontWeight: 'bold', marginBottom: '15px' }}>¡Mensaje enviado con éxito y guardado!</p>}
            {estadoEnvio === 'error' && <p style={{ color: '#dc2626', fontWeight: 'bold', marginBottom: '15px' }}>Hubo un error al procesar tu solicitud.</p>}

            <button 
              type="submit" 
              className="btn-primary"
              disabled={estadoEnvio === 'enviando'} 
              style={{ opacity: estadoEnvio === 'enviando' ? 0.7 : 1 }}
            >
              {estadoEnvio === 'enviando' ? 'Enviando...' : 'Enviar Mensaje'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}