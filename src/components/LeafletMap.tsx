"use client";

import React, { useEffect, useRef } from 'react';

export interface MapMarker {
  lat: number;
  lng: number;
  title: string;
  /** 'truck' | 'origin' | 'destination' | 'client' */
  type: 'truck' | 'origin' | 'destination' | 'client';
}

interface Props {
  markers: MapMarker[];
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
}

// Colores por tipo de marcador
const COLORS: Record<string, string> = {
  truck:       '#ef4444',  // rojo — camión
  origin:      '#1e3a8a',  // azul — origen
  destination: '#16a34a',  // verde — destino
  client:      '#7c3aed',  // morado — cliente
};

const ICONS_SVG: Record<string, string> = {
  truck: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="16" height="16"><path d="M1 3h15v13H1V3zm15 4h4l3 3v5h-7V7zM7 17a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm10 0a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"/></svg>`,
  origin: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="16" height="16"><circle cx="12" cy="12" r="6"/></svg>`,
  destination: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="16" height="16"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>`,
  client: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="16" height="16"><path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z"/></svg>`,
};

export default function LeafletMap({ markers, center, zoom = 14, height = '500px' }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<unknown>(null);
  const markersRef = useRef<unknown[]>([]);
  const polylineRef = useRef<unknown>(null);

  useEffect(() => {
    // Cargar Leaflet CSS si no está ya
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Cargar Leaflet JS
    const loadLeaflet = () => {
      return new Promise<void>((resolve) => {
        if ((window as unknown as Record<string, unknown>).L) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => resolve();
        document.head.appendChild(script);
      });
    };

    loadLeaflet().then(() => {
      if (!mapRef.current) return;

      const L = (window as unknown as Record<string, unknown>).L as {
        map: (...args: unknown[]) => unknown;
        tileLayer: (...args: unknown[]) => unknown;
        divIcon: (...args: unknown[]) => unknown;
        marker: (...args: unknown[]) => unknown;
        polyline: (...args: unknown[]) => unknown;
      };

      // Si ya existe el mapa, destruirlo antes de crear uno nuevo
      if (leafletMapRef.current) {
        (leafletMapRef.current as { remove: () => void }).remove();
        leafletMapRef.current = null;
      }

      const defaultCenter = center || (markers[0] ? { lat: markers[0].lat, lng: markers[0].lng } : { lat: 14.6045, lng: -90.4895 });

      const map = L.map(mapRef.current as unknown, {
        center: [defaultCenter.lat, defaultCenter.lng],
        zoom,
        zoomControl: true,
      }) as { addLayer: (l: unknown) => void; fitBounds: (b: unknown, opts?: unknown) => void; remove: () => void };

      // Tiles de OpenStreetMap
      (L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }) as { addTo: (m: unknown) => void }).addTo(map);

      leafletMapRef.current = map;

      // Limpiar marcadores anteriores
      markersRef.current = [];
      if (polylineRef.current) {
        (polylineRef.current as { remove: () => void }).remove();
        polylineRef.current = null;
      }

      if (markers.length === 0) return;

      const latlngs: [number, number][] = [];

      markers.forEach((m) => {
        const color = COLORS[m.type] || '#333';
        const iconSvg = ICONS_SVG[m.type] || ICONS_SVG.origin;

        const icon = L.divIcon({
          className: '',
          html: `
            <div style="
              background:${color};
              width:36px;height:36px;
              border-radius:50% 50% 50% 0;
              transform:rotate(-45deg);
              border:3px solid white;
              box-shadow:0 2px 8px rgba(0,0,0,0.35);
              display:flex;align-items:center;justify-content:center;
            ">
              <div style="transform:rotate(45deg);display:flex;align-items:center;justify-content:center;">
                ${iconSvg}
              </div>
            </div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 36],
          popupAnchor: [0, -36],
        });

        const marker = (L.marker([m.lat, m.lng], { icon }) as {
          addTo: (m: unknown) => { bindPopup: (s: string) => unknown };
        }).addTo(map).bindPopup(`<strong>${m.title}</strong>`);

        markersRef.current.push(marker);
        latlngs.push([m.lat, m.lng]);
      });

      // Dibujar línea entre marcadores si hay más de uno
      if (latlngs.length >= 2) {
        const poly = L.polyline(latlngs as unknown, {
          color: '#dc2626',
          weight: 4,
          opacity: 0.7,
          dashArray: '8, 8',
        }) as { addTo: (m: unknown) => void; getBounds: () => unknown };
        poly.addTo(map);
        polylineRef.current = poly;

        // Ajustar zoom para ver todos los marcadores
        map.fitBounds(poly.getBounds(), { padding: [40, 40] });
      }
    });

    return () => {
      if (leafletMapRef.current) {
        (leafletMapRef.current as { remove: () => void }).remove();
        leafletMapRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(markers), center?.lat, center?.lng, zoom]);

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height, minHeight: '380px' }}
    />
  );
}
