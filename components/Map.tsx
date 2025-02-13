import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import { Trip } from "@/types/type";

// Dynamic import untuk RoutingMachine
const RoutingMachine = dynamic(() => import("./RoutingMachine"), { ssr: false });

interface MapProps {
  selectedTrip: Trip | null;
}

export default function Map({ selectedTrip }: MapProps) {
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    setMapReady(true);
  }, []);

  return (
    <div className="h-[500px] w-1/2 bg-white">
      {mapReady && (
        <MapContainer
          center={[-6.2088, 106.8456]}
          zoom={20}
          scrollWheelZoom={false}
          className="h-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {selectedTrip?.pickup_latitude && selectedTrip?.dropoff_latitude && (
            <RoutingMachine selectedTrip={selectedTrip} />
          )}
        </MapContainer>
      )}
    </div>
  );
}
