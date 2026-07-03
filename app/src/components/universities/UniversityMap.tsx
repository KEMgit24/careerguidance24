"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

interface University {
  id: string;
  name: string;
  location: string;
  type: string;
  logo: string;
}

interface UniversityMapProps {
  universities: University[];
}

/* City coordinates for Togo */
const CITY_COORDS: Record<string, [number, number]> = {
  "Lomé": [6.1319, 1.2221],
  "Kara": [9.5511, 1.1861],
  "Atakpamé": [7.5333, 1.1167],
  "Sokodé": [8.9833, 1.1333],
  "Tsévié": [6.4333, 1.2167],
  "Dapaong": [10.8627, 0.2075],
  "Notsé": [6.95, 1.1667],
  "Togo": [8.6195, 1.2200],
};

function MapInner({ universities }: UniversityMapProps) {
  const [L, setL] = useState<typeof import("leaflet") | null>(null);
  const [components, setComponents] = useState<typeof import("react-leaflet") | null>(null);

  useEffect(() => {
    Promise.all([import("leaflet"), import("react-leaflet")]).then(([leaflet, rl]) => {
      // Fix default icon issue
      delete (leaflet.Icon.Default.prototype as any)._getIconUrl;
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });
      setL(leaflet);
      setComponents(rl);
    });
  }, []);

  if (!L || !components) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-2xl border border-border bg-muted">
        <div className="flex flex-col items-center gap-3">
          <svg className="h-8 w-8 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-sm text-muted-foreground">Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup } = components;

  // Group universities by city
  const groups: Record<string, University[]> = {};
  universities.forEach((u) => {
    const city = u.location || "Togo";
    if (!groups[city]) groups[city] = [];
    groups[city].push(u);
  });

  return (
    <MapContainer
      center={[8.0, 1.17]}
      zoom={7}
      scrollWheelZoom={false}
      style={{ height: "400px", width: "100%", borderRadius: "16px" }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {Object.entries(groups).map(([city, unis]) => {
        const coords = CITY_COORDS[city] || CITY_COORDS["Togo"];
        return (
          <Marker key={city} position={coords}>
            <Popup>
              <div className="max-w-[220px]">
                <p className="font-bold text-sm mb-1">📍 {city}</p>
                <p className="text-xs text-gray-600 mb-2">{unis.length} établissement{unis.length > 1 ? "s" : ""}</p>
                <ul className="space-y-1">
                  {unis.slice(0, 5).map((u) => (
                    <li key={u.id} className="text-xs">
                      <a href={`/universities/${u.id}`} className="hover:text-primary hover:underline transition-colors">
                        {u.name.length > 40 ? u.name.slice(0, 37) + "..." : u.name}
                      </a>
                    </li>
                  ))}
                  {unis.length > 5 && <li className="text-xs text-gray-500">+{unis.length - 5} autres</li>}
                </ul>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

export default function UniversityMap(props: UniversityMapProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-2xl border border-border bg-muted">
        <p className="text-sm text-muted-foreground">Chargement de la carte...</p>
      </div>
    );
  }
  return <MapInner {...props} />;
}
