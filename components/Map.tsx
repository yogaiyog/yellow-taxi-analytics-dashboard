"use client"; // Wajib untuk Next.js App Router

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";

// Dynamic import agar hanya dijalankan di client-side
const RoutingMachine = dynamic(() => import("./RoutingMachine"), { ssr: false });

export default function Map() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true); // Pastikan komponen dimuat setelah browser tersedia
  }, []);

  return (
    <div className="h-[500px] w-1/2 bg-white">
      {loaded && (
        <MapContainer center={[-6.2088, 106.8456]} zoom={7} scrollWheelZoom={false} className="h-full">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[-6.2088, 106.8456]}>
            <Popup>Jakarta, Indonesia</Popup>
          </Marker>
          <Marker position={[-6.9175, 107.6191]}>
            <Popup>Bandung, Indonesia</Popup>
          </Marker>
          <RoutingMachine />
        </MapContainer>
      )}
    </div>
  );
}
