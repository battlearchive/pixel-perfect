import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Battle } from "@/lib/battles.types";
import { ERAS } from "@/lib/battles.types";

const COUNTRY_GEOJSON_URL =
  "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson";

let countriesPromise: Promise<GeoJSON.FeatureCollection> | null = null;
function loadCountries(): Promise<GeoJSON.FeatureCollection> {
  if (!countriesPromise) {
    countriesPromise = fetch(COUNTRY_GEOJSON_URL).then((r) => r.json());
  }
  return countriesPromise;
}

export default function TacticalMap({ battle }: { battle: Battle }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const map = L.map(ref.current, {
      center: [battle.lat, battle.lng],
      zoom: 7,
      scrollWheelZoom: false,
      attributionControl: false,
    });

    // Dark CartoDB base
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
      { subdomains: "abcd", maxZoom: 19 },
    ).addTo(map);

    // Country outlines in warm gold
    loadCountries()
      .then((geo) => {
        L.geoJSON(geo, {
          interactive: false,
          style: {
            color: "#c9a84c",
            weight: 0.9,
            opacity: 0.55,
            fillColor: "#3a2a18",
            fillOpacity: 0.15,
          },
        }).addTo(map);
      })
      .catch(() => {});

    // Warm faint labels
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png",
      { subdomains: "abcd", opacity: 0.6 },
    ).addTo(map);

    L.control.scale({ imperial: false }).addTo(map);

    const color = ERAS[battle.era]?.color ?? "#c9a84c";
    const icon = L.divIcon({
      className: "",
      html: `<div style="position:relative;width:24px;height:24px"><div style="position:absolute;inset:0;border-radius:50%;background:${color};border:2px solid rgba(0,0,0,0.85);box-shadow:0 0 18px ${color}"></div></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
    L.marker([battle.lat, battle.lng], { icon })
      .addTo(map)
      .bindTooltip(battle.location, { permanent: true, direction: "top", offset: [0, -10] });

    return () => {
      map.remove();
    };
  }, [battle]);

  return (
    <div
      ref={ref}
      className="h-[420px] w-full rounded-sm border border-accent/30"
      style={{ background: "#0e0a07" }}
    />
  );
}
