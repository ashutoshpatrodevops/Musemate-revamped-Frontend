'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapIcon } from 'lucide-react'; // Optional: npm install lucide-react

interface MuseumMapProps {
  coordinates: [number, number]; // [longitude, latitude]
  title: string;
}

export function MuseumMap({ coordinates, title }: MuseumMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Google Maps URL generator
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coordinates[1]},${coordinates[0]}`;

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([coordinates[1], coordinates[0]], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19,
    }).addTo(map);

    const customIcon = L.divIcon({
      className: 'bg-transparent',
      html: `<div class="w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg"></div>`,
      iconSize: [16, 16],
    });

    L.marker([coordinates[1], coordinates[0]], { icon: customIcon })
      .addTo(map)
      .bindPopup(`
        <div class="p-1">
          <p class="font-bold text-sm mb-1">${title}</p>
          <a href="${googleMapsUrl}" target="_blank" class="text-xs text-blue-600 underline">
            View on Google Maps
          </a>
        </div>
      `);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [coordinates, title, googleMapsUrl]);

  return (
    <div className="relative w-full h-[400px] rounded-xl overflow-hidden border shadow-sm group">
      {/* The Leaflet Map */}
      <div ref={mapRef} className="h-full w-full z-0" />

      {/* Floating Google Maps Button */}
      <a
        href={googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-4 right-4 z-[1000] flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-900 px-4 py-2 rounded-full shadow-md border border-gray-200 transition-all hover:scale-105 active:scale-95 font-medium text-sm"
      >
        <MapIcon size={16} className="text-green-600" />
        Open Google Maps
      </a>
    </div>
  );
}