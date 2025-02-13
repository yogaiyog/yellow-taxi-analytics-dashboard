import { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import { useMap } from "react-leaflet";

L.Marker.prototype.options.icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png"
});

export default function Routing() {
  const map = useMap();

  useEffect(() => {
    if (!map) return; // Menghindari error jika map belum tersedia

    const routingControl = L.Routing.control({
      waypoints: [L.latLng(57.74, 11.94), L.latLng(57.6792, 11.949)],
      routeWhileDragging: true
    }).addTo(map);

    // Mengembalikan fungsi cleanup secara eksplisit
    return () => {
      if (map && routingControl) {
        map.removeControl(routingControl);
      }
    };
  }, [map]);

  return null;
}
