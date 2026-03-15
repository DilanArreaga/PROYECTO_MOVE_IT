"use client";
import React, { useState } from 'react';
import '../../styles/login.css';

export default function LoginPage() {
  const [isRegisterActive, setIsRegisterActive] = useState(false);

  const togglePanel = () => {
    setIsRegisterActive(!isRegisterActive);
  };

  return (
    <div className="login-screen">
      <div className={`login-container ${isRegisterActive ? 'active' : ''}`}>
        
        {/* Formulario de Registro */}
        <div className="form-container sign-up-container">
          <form>
            <h2>Crear Cuenta</h2>
            <div className="input-group">
              <input type="text" placeholder="Nombre Completo" />
            </div>
            <div className="input-group">
              <input type="email" placeholder="Correo Electrónico" />
            </div>
            <div className="input-group">
              <input type="password" placeholder="Contraseña" />
            </div>
            <button type="button" className="btn-primary">Registrarse</button>
          </form>
        </div>

        {/* Formulario de Iniciar Sesión */}
        <div className="form-container sign-in-container">
          <form>
            <h2>Iniciar Sesión</h2>
            <div className="input-group">
              <input type="email" placeholder="Correo Electrónico" />
            </div>
            <div className="input-group">
              <input type="password" placeholder="Contraseña" />
            </div>
            <button type="button" className="btn-primary">Entrar</button>
          </form>
        </div>

        {/* Panel Deslizante Informativo */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h3>¿Ya tienes cuenta?</h3>
              <p>Inicia sesión para seguir gestionando tus mudanzas.</p>
              <button className="btn-outline" onClick={togglePanel}>
                Ir al Login
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h3>¿Aún no tienes cuenta?</h3>
              <p>Regístrate para que puedas iniciar sesión.</p>
              <button className="btn-outline" onClick={togglePanel}>
                Registrarse
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}