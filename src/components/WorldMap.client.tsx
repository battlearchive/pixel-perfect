import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "@tanstack/react-router";
import type { Battle } from "@/lib/battles.types";
import { ERAS, formatYear } from "@/lib/battles.types";

const COUNTRY_GEOJSON_URL =
  "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson";

let countriesPromise: Promise<GeoJSON.FeatureCollection> | null = null;
function loadCountries(): Promise<GeoJSON.FeatureCollection> {
  if (!countriesPromise) {
    countriesPromise = fetch(COUNTRY_GEOJSON_URL).then((r) => r.json());
  }
  return countriesPromise;
}

export default function WorldMap({ battles }: { battles: Battle[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!ref.current) return;
    const map = L.map(ref.current, {
      center: [25, 15],
      zoom: 2,
      minZoom: 2,
      maxZoom: 7,
      worldCopyJump: true,
      scrollWheelZoom: false,
      attributionControl: false,
    });

    // Dark basemap (CartoDB dark, no labels) that matches the parchment-noir theme.
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
      {
        subdomains: "abcd",
        maxZoom: 19,
        attribution: "© OpenStreetMap, © CARTO",
      },
    ).addTo(map);

    // Subtle warm-gold country outlines on top of the dark canvas.
    loadCountries()
      .then((geo) => {
        L.geoJSON(geo, {
          interactive: false,
          style: {
            color: "#c9a84c",
            weight: 0.8,
            opacity: 0.55,
            fillColor: "#3a2a18",
            fillOpacity: 0.18,
          },
        }).addTo(map);
      })
      .catch(() => {
        // Outlines are decorative; ignore failures.
      });

    // Warm labels overlay (very faint) so place-names stay legible without bright text.
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png",
      { subdomains: "abcd", opacity: 0.55 },
    ).addTo(map);

    L.control.scale({ imperial: false }).addTo(map);

    for (const b of battles) {
      const color = ERAS[b.era]?.color ?? "#c9a84c";
      const icon = L.divIcon({
        className: "",
        html: `<div role="button" tabindex="0" aria-label="${b.name}, ${formatYear(b.year)} — click to read chronicle" style="position:relative;width:22px;height:22px"><div style="position:absolute;inset:0;border-radius:50%;background:${color};box-shadow:0 0 0 2px rgba(0,0,0,0.8),0 0 14px ${color}"></div><div style="position:absolute;inset:-7px;border-radius:50%;border:1.5px solid ${color};animation:bv-pulse 2.4s ease-out infinite"></div></div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });
      const m = L.marker([b.lat, b.lng], { icon, alt: `${b.name}, ${formatYear(b.year)}` } as L.MarkerOptions).addTo(map);
      m.bindTooltip(
        `<div style="font-family:Georgia,serif"><strong>${b.name}</strong><br/><span style="color:#c9a84c;font-size:11px">${formatYear(b.year)}</span></div>`,
        { direction: "top", offset: [0, -8] },
      );
      m.on("click", () => navigate({ to: "/battles/$slug", params: { slug: b.slug } }));
    }

    return () => {
      map.remove();
    };
  }, [battles, navigate]);

  return (
    <div
      ref={ref}
      className="h-[520px] w-full rounded-sm border border-accent/30 shadow-[0_30px_80px_-40px_rgba(201,168,76,0.4)]"
      style={{ background: "#0e0a07" }}
    />
  );
}
