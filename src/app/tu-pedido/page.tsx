"use client";

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../../firebase';
import '../../styles/tu-pedido.css';
import {
  doc,
  onSnapshot,
  collection,
  query,
  where,
  orderBy,
  getDocs,
} from 'firebase/firestore';
import type { MapMarker } from '../../components/LeafletMap';

// Carga dinámica para evitar SSR (Leaflet necesita window)
const LeafletMap = dynamic(() => import('../../components/LeafletMap'), {
  ssr: false,
  loading: () => (
    <div style={{ width: '100%', height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f6fb', borderRadius: '16px' }}>
      <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Cargando mapa...</span>
    </div>
  ),
});

// ──────────────────────────────────────────────
// Tipos de datos
// ──────────────────────────────────────────────
interface Cotizacion {
  id: string;
  destino?: string;
  destinoNombre?: string;
  origen?: string;
  origenNombre?: string;
  fecha?: string;
  distanciaKm?: number;
  distancia?: number;
  precio?: string;
  precioTotal?: string;
  total?: number;
  timestamp?: number;
  estadoCotizacion?: string;
  // La app Android usa destinoLat/destinoLng
  destinoLat?: number;
  destinoLng?: number;
  // Campos alternativos
  latDestino?: number;
  lngDestino?: number;
}

interface ItemInventario {
  nombre: string;
  volumen?: number;
  fragilidad?: string;
  cantidad?: number;
}

interface SesionInventario {
  items: ItemInventario[];
  volumenTotal?: string;
  fecha?: number;
}

interface MudanzaActiva {
  lat: number;
  lng: number;
  latDestino?: number;
  lngDestino?: number;
  origenNombre?: string;
  destinoNombre?: string;
  estado?: string;
}

// ──────────────────────────────────────────────
// Utilidades
// ──────────────────────────────────────────────

/**
 * Geocoding reverso gratuito con Nominatim (OpenStreetMap).
 * Devuelve nombre legible del lugar o "Cargando…".
 */
async function coordsADireccion(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=es`,
      { headers: { 'User-Agent': 'MoveItApp/1.0' } }
    );
    if (!res.ok) return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    const data = await res.json();
    // Intentar mostrar barrio/colonia + municipio
    const addr = data.address || {};
    const partes = [
      addr.neighbourhood || addr.suburb || addr.quarter || addr.village || addr.town,
      addr.city || addr.municipality || addr.county,
    ].filter(Boolean);
    return partes.length > 0 ? partes.join(', ') : data.display_name?.split(',').slice(0, 2).join(',').trim() || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
}

/** Formatea kilómetros de forma amigable */
function formatDistancia(km?: number | null): string {
  if (!km && km !== 0) return '—';
  if (km < 1) return `${Math.round(km * 1000)} metros`;
  return `${km.toFixed(1)} km`;
}

/** Formatea precio */
function formatPrecio(cot: Cotizacion): string {
  if (cot.precio) return cot.precio;
  if (cot.precioTotal) return cot.precioTotal;
  if (cot.total) return `Q ${cot.total.toFixed(2)}`;
  return 'Por confirmar';
}

/** Distancia en km (normaliza campos) */
function getDistanciaKm(cot: Cotizacion): number | undefined {
  return cot.distanciaKm ?? cot.distancia ?? undefined;
}

// ──────────────────────────────────────────────
// Componente principal
// ──────────────────────────────────────────────
export default function TuPedido() {
  const router = useRouter();
  const [cargando, setCargando] = useState(true);
  const [uid, setUid] = useState<string | null>(null);

  const [coordsGPS, setCoordsGPS] = useState<{ lat: number; lng: number } | null>(null);
  const [mudanzaActiva, setMudanzaActiva] = useState<MudanzaActiva | null>(null);
  const [ultimaActualizacion, setUltimaActualizacion] = useState('Sin datos aún');

  // Nombres legibles de origen y destino GPS
  const [nombreOrigen, setNombreOrigen] = useState<string>('');
  const [nombreDestino, setNombreDestino] = useState<string>('');

  // Cotizaciones
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [cotSeleccionada, setCotSeleccionada] = useState<Cotizacion | null>(null);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);

  // Inventario asociado a cotización seleccionada
  const [inventario, setInventario] = useState<SesionInventario | null>(null);

  // ─── Auth ────────────────────────────────────
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
        setCargando(false);
      } else {
        router.push('/login');
      }
    });
    return () => unsub();
  }, [router]);

  // ─── GPS / Mudanza activa ─────────────────────
  useEffect(() => {
    if (!uid) return;

    const mudanzaRef = doc(db, 'mudanza_activa', uid);
    const unsub = onSnapshot(mudanzaRef, async (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        const lat = d.lat as number;
        const lng = d.lng as number;

        if (lat && lng) {
          const activa: MudanzaActiva = {
            lat,
            lng,
            latDestino: d.latDestino,
            lngDestino: d.lngDestino,
            origenNombre: d.origenNombre,
            destinoNombre: d.destinoNombre,
            estado: d.estado,
          };
          setMudanzaActiva(activa);
          setCoordsGPS({ lat, lng });

          const hora = new Date().toLocaleTimeString('es-GT', {
            hour: '2-digit', minute: '2-digit', second: '2-digit'
          });
          setUltimaActualizacion(hora);

          // Resolver nombres si no vienen en el documento
          if (d.origenNombre) {
            setNombreOrigen(d.origenNombre);
          } else {
            coordsADireccion(lat, lng).then(setNombreOrigen);
          }

          if (d.latDestino && d.lngDestino) {
            if (d.destinoNombre) {
              setNombreDestino(d.destinoNombre);
            } else {
              coordsADireccion(d.latDestino, d.lngDestino).then(setNombreDestino);
            }
          } else {
            setNombreDestino('');
          }
        }
      } else {
        setMudanzaActiva(null);
        setCoordsGPS(null);
        setUltimaActualizacion('Sin mudanza activa');
        setNombreOrigen('');
        setNombreDestino('');
      }
    });

    return () => unsub();
  }, [uid]);

  // ─── Cotizaciones (todas del usuario) ────────
  useEffect(() => {
    if (!uid) return;

    const cargarCotizaciones = async () => {
      try {
        // Intentar con campo "userId"
        const q = query(
          collection(db, 'cotizaciones'),
          where('userId', '==', uid),
          orderBy('timestamp', 'desc')
        );
        const snap = await getDocs(q);
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as Cotizacion));
        setCotizaciones(docs);
        if (docs.length > 0) setCotSeleccionada(docs[0]);
      } catch {
        // Si falla el índice, intentar sin orderBy
        try {
          const q2 = query(collection(db, 'cotizaciones'), where('userId', '==', uid));
          const snap2 = await getDocs(q2);
          const docs2 = snap2.docs
            .map(d => ({ id: d.id, ...d.data() } as Cotizacion))
            .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
          setCotizaciones(docs2);
          if (docs2.length > 0) setCotSeleccionada(docs2[0]);
        } catch (err2) {
          console.error('Error cargando cotizaciones:', err2);
        }
      }
    };

    cargarCotizaciones();
  }, [uid]);

  // ─── Inventario del usuario ────────────────────
  useEffect(() => {
    if (!uid) return;
    const q = query(
      collection(db, 'inventarios'),
      where('userId', '==', uid),
      orderBy('fecha', 'desc')
    );
    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        setInventario(snap.docs[0].data() as SesionInventario);
      }
    }, () => {
      // Si falla el índice, intentar sin orderBy
      getDocs(query(collection(db, 'inventarios'), where('userId', '==', uid)))
        .then(snap => {
          if (!snap.empty) {
            const sorted = snap.docs
              .map(d => d.data() as SesionInventario)
              .sort((a, b) => (b.fecha || 0) - (a.fecha || 0));
            setInventario(sorted[0]);
          }
        })
        .catch(console.error);
    });
    return () => unsub();
  }, [uid]);

  const cerrarSesion = async () => {
    try { await signOut(auth); } catch (e) { console.error(e); }
  };

  const seleccionarCot = useCallback((cot: Cotizacion) => {
    setCotSeleccionada(cot);
    setMostrarHistorial(false);
  }, []);

  // ─── Marcadores del mapa (calculado en top-level, no en JSX) ────────
  const hayMudanza = !!mudanzaActiva;

  const mapMarkers: MapMarker[] = useMemo(() => {
    const markers: MapMarker[] = [];
    if (mudanzaActiva) {
      markers.push({
        lat: mudanzaActiva.lat,
        lng: mudanzaActiva.lng,
        title: `🚚 Camión MoveIt${nombreOrigen ? ` — ${nombreOrigen}` : ''}`,
        type: 'truck',
      });
      if (mudanzaActiva.latDestino && mudanzaActiva.lngDestino) {
        markers.push({
          lat: mudanzaActiva.latDestino,
          lng: mudanzaActiva.lngDestino,
          title: `📍 Destino${nombreDestino ? `: ${nombreDestino}` : ''}`,
          type: 'destination',
        });
      }
    } else {
      markers.push({
        lat: 14.6045,
        lng: -90.4895,
        title: '🏢 Sede MoveIt — Universidad Galileo',
        type: 'origin',
      });
    }
    return markers;
  }, [mudanzaActiva, nombreOrigen, nombreDestino]);

  // ─── Pantalla de carga ────────────────────────
  if (cargando) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <h2>Verificando seguridad 🔒</h2>
        <p>Cargando tu información de MoveIt</p>
      </div>
    );
  }


  // ─── Render principal ─────────────────────────
  return (
    <div className="pedido-wrapper">
      {/* ── Encabezado ─────────────────────────── */}
      <div className="pedido-header-bar">
        <h1 className="pedido-titulo">
          <i className="fa-solid fa-truck-ramp-box" /> Seguimiento en Vivo
        </h1>
        <button onClick={cerrarSesion} className="btn-cerrar-sesion">
          <i className="fa-solid fa-right-from-bracket" /> Cerrar Sesión
        </button>
      </div>

      {/* ── Banner mudanza activa ───────────────── */}
      {hayMudanza && (
        <div className="banner-activo">
          <span className="pulse-dot" />
          <strong>Mudanza en curso — GPS activo en tiempo real</strong>
          <span className="ultima-act">Actualizado: {ultimaActualizacion}</span>
        </div>
      )}

      {/* ── Cuerpo principal ────────────────────── */}
      <div className="pedido-body">

        {/* ====== COLUMNA IZQUIERDA ====== */}
        <div className="col-info">

          {/* Cards Origen / Destino / Estado */}
          <div className="cards-resumen">
            <div className="card-dato">
              <span className="card-label">
                <i className="fa-solid fa-location-dot" style={{ color: '#dc2626' }} /> Origen
              </span>
              <strong className="card-valor">
                {hayMudanza
                  ? (nombreOrigen || 'Obteniendo ubicación…')
                  : 'Sin mudanza activa'}
              </strong>
            </div>

            <div className="card-dato">
              <span className="card-label">
                <i className="fa-solid fa-flag-checkered" style={{ color: '#16a34a' }} /> Destino
              </span>
              <strong className="card-valor">
                {hayMudanza
                  ? (nombreDestino || (mudanzaActiva?.lngDestino ? 'Obteniendo destino…' : 'Destino no registrado'))
                  : '—'}
              </strong>
            </div>

            <div className="card-dato card-estado">
              <span className="card-label">
                <i className="fa-solid fa-circle-info" /> Estado
              </span>
              <strong className={`card-valor estado-badge ${hayMudanza ? 'activo' : 'inactivo'}`}>
                {hayMudanza
                  ? (mudanzaActiva?.estado || 'En ruta de entrega')
                  : 'Sin mudanza activa'}
              </strong>
            </div>
          </div>

          {/* ─── COTIZACIONES ─────────────────── */}
          <div className="seccion-cotizaciones">
            <div className="cot-header">
              <h2 className="seccion-titulo">
                <i className="fa-solid fa-file-invoice" style={{ color: '#dc2626' }} /> Mis Cotizaciones
              </h2>
              {cotizaciones.length > 1 && (
                <button
                  className="btn-historial"
                  onClick={() => setMostrarHistorial(!mostrarHistorial)}
                >
                  <i className={`fa-solid fa-chevron-${mostrarHistorial ? 'up' : 'down'}`} />
                  {mostrarHistorial ? 'Ocultar' : `Ver todas (${cotizaciones.length})`}
                </button>
              )}
            </div>

            {/* Historial desplegable */}
            {mostrarHistorial && cotizaciones.length > 1 && (
              <div className="historial-lista">
                {cotizaciones.map((cot, i) => (
                  <button
                    key={cot.id}
                    className={`historial-item ${cotSeleccionada?.id === cot.id ? 'activo' : ''}`}
                    onClick={() => seleccionarCot(cot)}
                  >
                    <span className="hist-num">#{cotizaciones.length - i}</span>
                    <span className="hist-destino">{cot.destinoNombre || cot.destino || 'Destino desconocido'}</span>
                    <span className="hist-fecha">{cot.fecha || '—'}</span>
                    <span className="hist-precio">{formatPrecio(cot)}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Cotización seleccionada */}
            {cotSeleccionada ? (
              <div className="cot-card">
                {cotizaciones.length > 1 && (
                  <div className="cot-badge-num">
                    Cotización #{cotizaciones.length - cotizaciones.indexOf(cotSeleccionada)}
                    {cotizaciones.indexOf(cotSeleccionada) === 0 && (
                      <span className="badge-reciente"> · Más reciente</span>
                    )}
                  </div>
                )}

                {/* Ruta visual origen → destino */}
                <div className="ruta-visual">
                  <div className="ruta-punto origen">
                    <i className="fa-solid fa-circle-dot" />
                    <span>{cotSeleccionada.origenNombre || cotSeleccionada.origen || 'Origen registrado'}</span>
                  </div>
                  <div className="ruta-linea">
                    <i className="fa-solid fa-arrow-down" />
                    <span className="ruta-distancia">
                      {formatDistancia(getDistanciaKm(cotSeleccionada))}
                    </span>
                  </div>
                  <div className="ruta-punto destino">
                    <i className="fa-solid fa-location-dot" />
                    <span>{cotSeleccionada.destinoNombre || cotSeleccionada.destino || 'Destino registrado'}</span>
                  </div>
                </div>

                <div className="cot-detalles">
                  <div className="detalle-row">
                    <i className="fa-solid fa-calendar-day" />
                    <span><strong>Fecha:</strong> {cotSeleccionada.fecha || '—'}</span>
                  </div>
                  <div className="detalle-row">
                    <i className="fa-solid fa-route" />
                    <span>
                      <strong>Distancia:</strong>{' '}
                      {formatDistancia(getDistanciaKm(cotSeleccionada))}
                    </span>
                  </div>
                  {cotSeleccionada.estadoCotizacion && (
                    <div className="detalle-row">
                      <i className="fa-solid fa-tag" />
                      <span><strong>Estado:</strong> {cotSeleccionada.estadoCotizacion}</span>
                    </div>
                  )}
                </div>

                {/* Inventario */}
                {inventario && inventario.items && inventario.items.length > 0 && (
                  <div className="inventario-mini">
                    <p className="inv-titulo">
                      <i className="fa-solid fa-boxes-stacked" style={{ color: '#dc2626' }} />
                      {' '}Inventario ({inventario.items.length} objetos)
                    </p>
                    {inventario.items.slice(0, 5).map((item, i) => (
                      <div key={i} className="inv-item">
                        <span>• {item.nombre}</span>
                        <span className="inv-vol">{item.volumen ? `${item.volumen} m³` : ''}</span>
                      </div>
                    ))}
                    {inventario.items.length > 5 && (
                      <p className="inv-mas">+{inventario.items.length - 5} objetos más</p>
                    )}
                  </div>
                )}

                {/* Total */}
                <div className="cot-total">
                  <span className="total-label">
                    <i className="fa-solid fa-circle-check" style={{ color: '#16a34a' }} /> Total estimado
                  </span>
                  <span className="total-precio">{formatPrecio(cotSeleccionada)}</span>
                </div>
              </div>
            ) : (
              <div className="cot-vacia">
                <i className="fa-solid fa-file-circle-question" />
                <p>Aún no tienes cotizaciones.</p>
                <small>Usa la app Android para crear una.</small>
              </div>
            )}
          </div>
        </div>

        {/* ====== COLUMNA DERECHA: MAPA ====== */}
        <div className="col-mapa">
          <div className="mapa-wrapper">
            {/* Badge estado */}
            <div className={`mapa-badge ${hayMudanza ? 'en-ruta' : 'base'}`}>
              <i className={`fa-solid ${hayMudanza ? 'fa-truck-moving' : 'fa-map-pin'}`} />
              {hayMudanza
                ? (mudanzaActiva?.lngDestino
                  ? 'Ruta en vivo: Camión → Destino'
                  : 'Posición del camión en tiempo real')
                : 'Mapa base — Ciudad de Guatemala'}
            </div>

            {/* Leyenda de marcadores */}
            <div className="mapa-leyenda-top">
              {hayMudanza && (
                <span className="ley-chip rojo">
                  <span className="dot rojo" /> Camión
                </span>
              )}
              {mudanzaActiva?.latDestino && (
                <span className="ley-chip verde">
                  <span className="dot verde" /> Destino
                </span>
              )}
              {!hayMudanza && (
                <span className="ley-chip gris">
                  <span className="dot gris" /> Base
                </span>
              )}
            </div>

            {/* Mapa Leaflet con múltiples marcadores */}
            <LeafletMap
              markers={mapMarkers}
              zoom={hayMudanza ? 14 : 13}
              height="460px"
            />
          </div>

          <p className="update-row">
            <i className={`fa-solid fa-satellite-dish ${hayMudanza ? 'txt-verde' : 'txt-gris'}`} />
            {hayMudanza
              ? `GPS activo · Última señal: ${ultimaActualizacion}`
              : 'Sin señal GPS activa'}
          </p>
        </div>

      </div>
    </div>
  );
}