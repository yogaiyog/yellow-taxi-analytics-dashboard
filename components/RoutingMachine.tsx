import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import { useMap } from "react-leaflet";
import { Trip } from "@/types/type";

L.Marker.prototype.options.icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
});

interface RoutingMachineProps {
  selectedTrip: Trip;
}

export default function RoutingMachine({ selectedTrip }: RoutingMachineProps) {
  const map = useMap();
  const routingControlRef = useRef<L.Routing.Control | null>(null);

  useEffect(() => {
    if (!map || !selectedTrip) return;

    // Validasi koordinat sebelum digunakan
    if (
      typeof selectedTrip.pickup_latitude !== "number" ||
      typeof selectedTrip.pickup_longitude !== "number" ||
      typeof selectedTrip.dropoff_latitude !== "number" ||
      typeof selectedTrip.dropoff_longitude !== "number"
    ) {
      console.error("Invalid coordinates:", selectedTrip);
      return;
    }

    // Hapus rute lama dengan aman
    if (routingControlRef.current) {
      try {
        routingControlRef.current.getPlan().setWaypoints([]);
        map.removeControl(routingControlRef.current);
      } catch (error) {
        console.warn("Error while removing routing control:", error);
      }
      routingControlRef.current = null;
    }

    // Bersihkan layer lama yang tertinggal di map
    map.eachLayer((layer) => {
      if (layer instanceof L.Routing.Control) {
        map.removeLayer(layer);
      }
    });

    const routingControl = L.Routing.control({
        waypoints: [
          L.latLng(selectedTrip.pickup_latitude, selectedTrip.pickup_longitude),
          L.latLng(selectedTrip.dropoff_latitude, selectedTrip.dropoff_longitude),
        ],
        routeWhileDragging: true,
        lineOptions: {
          styles: [{ color: "#a600ff", weight: 6, opacity: 0.7 }],
          extendToWaypoints: false,
          missingRouteTolerance: 0,
        },
      }).addTo(map);
      
      // Buat bounds berdasarkan titik awal dan akhir
      const bounds = L.latLngBounds([
        L.latLng(selectedTrip.pickup_latitude, selectedTrip.pickup_longitude),
        L.latLng(selectedTrip.dropoff_latitude, selectedTrip.dropoff_longitude),
      ]);
      
      // Zoom out agar seluruh rute terlihat
      map.fitBounds(bounds, {
        padding: [50, 50], // Bisa diperbesar jika masih terlalu dekat
      });
      
      

    routingControlRef.current = routingControl;

    return () => {
      if (routingControlRef.current) {
        try {
          routingControlRef.current.getPlan().setWaypoints([]);
          map.removeControl(routingControlRef.current);
        } catch (error) {
          console.warn("Error while removing routing control:", error);
        }
        routingControlRef.current = null;
      }
    };
  }, [map, selectedTrip]);

  return null;
}
