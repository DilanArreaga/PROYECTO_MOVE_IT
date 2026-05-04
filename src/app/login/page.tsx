"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../firebase'; 
import '../../styles/login.css';

export default function LoginPage() {
  const [isRegisterActive, setIsRegisterActive] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  // Estados para saber si hay alguien logueado o si Firebase está verificando
  const [verificando, setVerificando] = useState(true);
  const [usuarioLogueado, setUsuarioLogueado] = useState(false);

  const router = useRouter();

  // El "vigilante" que revisa si ya hay sesión al abrir la página
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsuarioLogueado(true); // ¡Sí hay alguien!
      } else {
        setUsuarioLogueado(false); // No hay nadie
      }
      setVerificando(false);
    });
    return () => unsubscribe();
  }, []);

  const togglePanel = () => {
    setIsRegisterActive(!isRegisterActive);
    setErrorMsg(''); 
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/tu-pedido'); 
    } catch (error: any) {
      setErrorMsg("Error al crear cuenta. Intenta con otro correo.");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/tu-pedido'); 
    } catch (error: any) {
      setErrorMsg("Correo o contraseña incorrectos.");
    }
  };

  const handleCerrarSesion = async () => {
    await signOut(auth);
  };

  // Pantalla para que no parpadee mientras Firebase revisa
  if (verificando) return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Cargando...</div>;

  // === SI YA INICIÓ SESIÓN, MOSTRAMOS ESTA PANTALLA ESPECIAL ===
  if (usuarioLogueado) {
    return (
      <div className="login-screen">
        <div className="login-container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '40px' }}>
          <h2 style={{ color: '#dc2626', marginBottom: '20px' }}>¡Ya tienes una sesión iniciada! 🚚</h2>
          <p style={{ marginBottom: '30px' }}>Estás listo para seguir gestionando tu mudanza.</p>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button className="btn-primary" onClick={() => router.push('/tu-pedido')}>
              Ir a mi pedido
            </button>
            <button className="btn-outline" onClick={handleCerrarSesion} style={{ color: '#333', borderColor: '#333' }}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

  // === SI NO HAY SESIÓN, SE MUESTRA EL LOGIN NORMAL ===
  return (
    <div className="login-screen">
      <div className={`login-container ${isRegisterActive ? 'active' : ''}`}>
        
        {/* Formulario de Registro */}
        <div className="form-container sign-up-container">
          <form onSubmit={handleRegister}>
            <h2>Crear Cuenta</h2>
            <input type="email" placeholder="Correo Electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Contraseña (mínimo 6 caracteres)" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit" className="btn-primary">Registrarse</button>
          </form>
        </div>

        {/* Formulario de Iniciar Sesión */}
        <div className="form-container sign-in-container">
          <form onSubmit={handleLogin}>
            <h2>Iniciar Sesión</h2>
            {errorMsg && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errorMsg}</p>}
            <input type="email" placeholder="Correo Electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit" className="btn-primary">Entrar</button>
          </form>
        </div>

        {/* Panel Deslizante Informativo */}
        <div className="overlay-container">
          <div className="overlay">
            
            {/* Panel que se ve cuando estás en el formulario de Registro */}
            <div className="overlay-panel overlay-left">
              <h3>Nuestros Servicios</h3>
              <p>
                <strong>Mudanza de Empresas:</strong> Logística especializada para oficinas.<br/>
                <strong>Almacenamiento:</strong> Bodegas seguras para tus pertenencias.
              </p>
              <button type="button" className="btn-outline" onClick={togglePanel}>Volver al Login</button>
            </div>

            {/* Panel que se ve cuando estás en el formulario de Login */}
            <div className="overlay-panel overlay-right">
              <h3>Bienvenido a MoveIt</h3>
              <p>
                Descubre nuestra <strong>Mudanza Tradicional</strong> con cotización por IA.<br/>
                Expertos en traslados residenciales y corporativos.
              </p>
              <button type="button" className="btn-outline" onClick={togglePanel}>Crear Cuenta</button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}