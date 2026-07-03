"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";

// ─── PIN ICON (zoom out) ───────────────────────────────────────────────────────
// Green map-pin SVG, similar to the user's reference image
const PIN_HTML = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="32" height="48">
  <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24S24 21 24 12C24 5.373 18.627 0 12 0z"
    fill="#16a34a" stroke="#fff" stroke-width="1.2"/>
  <circle cx="12" cy="12" r="5" fill="#fff"/>
</svg>`;

const PIN_ICON = L.divIcon({
  html: PIN_HTML,
  className: "",
  iconSize: [32, 48],
  iconAnchor: [16, 48],
  popupAnchor: [0, -50],
});

// ─── LOGO ICON (zoom in) ──────────────────────────────────────────────────────
function createLogoIcon(logoUrl: string, name: string) {
  const initial = name?.charAt(0)?.toUpperCase() || "?";
  const img = logoUrl
    ? `<img src="${logoUrl}" alt="" 
        style="width:36px;height:36px;object-fit:contain;border-radius:50%;"
        onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" />
       <span style="display:none;font-size:15px;font-weight:700;color:#4f46e5;">${initial}</span>`
    : `<span style="font-size:15px;font-weight:700;color:#fff;">${initial}</span>`;

  const html = `
  <div style="
    position:relative;
    width:48px;height:48px;
    display:flex;align-items:center;justify-content:center;
  ">
    <div style="
      width:44px;height:44px;border-radius:50%;
      background:#fff;
      border:3px solid #4f46e5;
      box-shadow:0 4px 16px rgba(79,70,229,0.4);
      display:flex;align-items:center;justify-content:center;
      overflow:hidden;
    ">${img}</div>
    <div style="
      position:absolute;bottom:-6px;left:50%;transform:translateX(-50%);
      width:10px;height:10px;border-radius:50%;
      background:#4f46e5;border:2px solid #fff;
      box-shadow:0 2px 4px rgba(0,0,0,0.2);
    "></div>
  </div>`;

  return L.divIcon({
    html,
    className: "",
    iconSize: [48, 54],
    iconAnchor: [24, 54],
    popupAnchor: [0, -58],
  });
}

// ─── Zoom watcher ─────────────────────────────────────────────────────────────
const ZOOM_THRESHOLD = 11;

function ZoomWatcher({ onZoomChange }: { onZoomChange: (z: number) => void }) {
  const map = useMapEvents({
    zoomend: () => onZoomChange(map.getZoom()),
  });
  return null;
}

// ─── Fly to marker ────────────────────────────────────────────────────────────
function FlyToMarker({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 13, { animate: true, duration: 1.2 });
  }, [center, map]);
  return null;
}

// ─── Types ────────────────────────────────────────────────────────────────────
type University = {
  id: string;
  name: string;
  logo?: string;
  type: string;
  location: string;
  lat?: number;
  lng?: number;
  website?: string;
  has_cames?: boolean;
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function UniversityMap({
  universities,
}: {
  universities: University[];
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [zoom, setZoom] = useState(7);
  const [search, setSearch] = useState("");
  const [flyTo, setFlyTo] = useState<[number, number] | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const markerRefs = useRef<Map<string, L.Marker>>(new Map());

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted)
    return (
      <div className="h-[400px] w-full animate-pulse bg-muted rounded-2xl flex items-center justify-center text-muted-foreground text-sm">
        Chargement de la carte…
      </div>
    );

  const validUniversities = universities.filter((u) => u.lat && u.lng);

  // filter by search
  const filtered = search.trim()
    ? validUniversities.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.location.toLowerCase().includes(search.toLowerCase())
      )
    : validUniversities;

  const handleSearchSelect = (u: University) => {
    if (u.lat && u.lng) {
      setFlyTo([u.lat, u.lng]);
      setActiveId(u.id);
      setSearch(u.name);
      setTimeout(() => {
        const marker = markerRefs.current.get(u.id);
        if (marker) marker.openPopup();
      }, 1400);
    }
  };

  const useLogoIcon = zoom >= ZOOM_THRESHOLD;

  return (
    <div className="flex flex-col gap-4">
      {/* ─── Search Bar ─── */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
          <svg
            className="h-4 w-4 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setActiveId(null);
            setFlyTo(null);
          }}
          placeholder="Rechercher un établissement sur la carte…"
          className="w-full rounded-xl border border-border bg-card py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
        />
        {/* Dropdown results */}
        {search.trim() && !activeId && filtered.length > 0 && (
          <ul className="absolute z-[9999] mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-border bg-card shadow-xl">
            {filtered.map((u) => (
              <li key={u.id}>
                <button
                  onClick={() => handleSearchSelect(u)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-foreground hover:bg-muted transition-colors"
                >
                  {u.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={u.logo}
                      alt=""
                      className="h-7 w-7 rounded-md object-contain bg-white border border-border shrink-0"
                    />
                  ) : (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary">
                      {u.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-medium leading-tight">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.location}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
        {search.trim() && !activeId && filtered.length === 0 && (
          <div className="absolute z-[9999] mt-1 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground shadow-xl">
            Aucun établissement trouvé
          </div>
        )}
      </div>

      {/* ─── Map ─── */}
      <div className="h-[400px] w-full rounded-2xl overflow-hidden border border-border shadow-premium relative z-0">
        <MapContainer
          center={[8.6195, 0.8248]}
          zoom={7}
          className="h-full w-full z-0"
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ZoomWatcher onZoomChange={setZoom} />
          <FlyToMarker center={flyTo} />

          {validUniversities.map((uni) => (
            <Marker
              key={uni.id}
              position={[uni.lat!, uni.lng!]}
              icon={
                useLogoIcon
                  ? createLogoIcon(uni.logo || "", uni.name)
                  : PIN_ICON
              }
              ref={(ref: L.Marker | null) => {
                if (ref) markerRefs.current.set(uni.id, ref);
              }}
            >
              <Popup minWidth={230}>
                <div className="flex flex-col items-center gap-3 p-1 text-center">
                  {/* Logo */}
                  <div className="h-16 w-16 rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm flex items-center justify-center shrink-0">
                    {uni.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={uni.logo}
                        alt=""
                        className="h-full w-full object-contain p-1"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-indigo-600">
                        {uni.name.charAt(0)}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-indigo-500 mb-1">
                      {uni.type}
                    </p>
                    <p className="font-bold text-sm text-gray-900 leading-tight">
                      {uni.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      📍 {uni.location}
                    </p>
                    {uni.has_cames && (
                      <span className="mt-1 inline-block rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                        ✓ CAMES
                      </span>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col gap-1.5 w-full mt-1">
                    <Link
                      href={`/universities/${uni.id}`}
                      className="block w-full rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white text-center hover:bg-indigo-700 transition-colors"
                    >
                      Voir le profil →
                    </Link>
                    {uni.website && (
                      <a
                        href={uni.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 text-center hover:bg-gray-50 transition-colors"
                      >
                        🌐 Site officiel
                      </a>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* ─── Legend + counter ─── */}
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <span className="flex items-center gap-2">
          <span className="flex items-center gap-1">
            <svg viewBox="0 0 24 36" width="12" height="18">
              <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24S24 21 24 12C24 5.373 18.627 0 12 0z" fill="#16a34a"/>
              <circle cx="12" cy="12" r="5" fill="#fff"/>
            </svg>
            Zoom out : pins
          </span>
          <span className="text-muted-foreground/50">·</span>
          <span className="flex items-center gap-1">
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border-2 border-indigo-500 bg-white text-[8px] font-bold text-indigo-600">U</span>
            Zoom in : logos
          </span>
        </span>
        <span className="font-medium">{validUniversities.length} établissements</span>
      </div>
    </div>
  );
}
