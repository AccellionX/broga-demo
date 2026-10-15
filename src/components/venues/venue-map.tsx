"use client";

import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import type { Venue } from "@/lib/mock-data";
import { getNextClassLabel, getTeacher } from "@/lib/mock-data";
import "leaflet/dist/leaflet.css";

const icon = L.divIcon({
  className: "",
  html: `<div style="width:28px;height:28px;border-radius:50%;background:#1B4332;border:3px solid #FAF7F2;box-shadow:0 2px 8px rgba(0,0,0,.25)"></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

function FitBounds({ venues }: { venues: Venue[] }) {
  const map = useMap();
  useEffect(() => {
    if (venues.length === 0) return;
    const bounds = L.latLngBounds(venues.map((v) => [v.lat, v.lng]));
    map.fitBounds(bounds.pad(0.15));
  }, [venues, map]);
  return null;
}

export function VenueMap({
  venues,
  selectedId,
  onSelect,
}: {
  venues: Venue[];
  selectedId?: string;
  onSelect?: (id: string) => void;
}) {
  const center: [number, number] =
    venues.length > 0
      ? [venues[0].lat, venues[0].lng]
      : [51.25, -0.5];

  return (
    <MapContainer
      center={center}
      zoom={9}
      className="h-full w-full rounded-xl"
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds venues={venues} />
      {venues.map((v) => {
        const teacher = getTeacher(v.teacherId);
        return (
          <Marker
            key={v.id}
            position={[v.lat, v.lng]}
            icon={icon}
            opacity={selectedId && selectedId !== v.id ? 0.55 : 1}
            eventHandlers={{
              click: () => onSelect?.(v.id),
            }}
          >
            <Popup>
              <div className="min-w-[160px] text-sm">
                <p className="font-bold text-forest-800">{v.name}</p>
                <p className="text-charcoal/70">
                  {v.town} · {getNextClassLabel(v)}
                </p>
                {teacher && (
                  <p className="text-charcoal/60">{teacher.name}</p>
                )}
                <Link
                  href={`/venues/${v.slug}`}
                  className="mt-1 inline-block font-semibold text-accent"
                >
                  View classes →
                </Link>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
