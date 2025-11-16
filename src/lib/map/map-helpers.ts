import type { Airport } from "@/types/airport";

/**
 * Crea un icono personalizado de aeropuerto (avión)
 */
export function createAirportIcon(L: typeof import("leaflet"), size = 40) {
  const svgIcon = `
    <svg 
      width="${size / 2}"
      height="${size / 2}"
      viewBox="0 0 20 20"
      fill="white"
    >
      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
    </svg>
  `;

  return L.divIcon({
    html: `
      <div style="
        background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
        width: ${size}px;
        height: ${size}px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: ${size === 40 ? "3px" : "2px"} solid white;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="transform: rotate(45deg);">
          ${svgIcon}
        </div>
      </div>
    `,
    className: "airport-icon",
    iconSize: [size, size],
    iconAnchor: [size / 2, size], // Base del icono
    popupAnchor: [0, -size], // Dónde aparece el popup
  });
}

/**
 * Crea el contenido HTML del popup de información del aeropuerto
 */
export function createPopupContent(airport: Airport): string {
  const codes = [
    airport.iata_code &&
      `<span class="airport-code iata">${airport.iata_code}</span>`,
    airport.icao_code &&
      `<span class="airport-code icao">${airport.icao_code}</span>`,
  ]
    .filter(Boolean)
    .join("");

  return `
    <div class="airport-popup">
      <h3 class="airport-name">${airport.airport_name}</h3>
      <div class="airport-location">
        ${airport.city_iata_code}, ${airport.country_name}
      </div>
      <div class="airport-codes">
        ${codes}
      </div>
      <div class="airport-coordinates">
        📍 ${airport.latitude.toFixed(4)}, ${airport.longitude.toFixed(4)}
      </div>
    </div>
    
    <style>
      .airport-popup {
        font-family: system-ui, -apple-system, sans-serif;
        min-width: 200px;
      }
      .airport-name {
        margin: 0 0 8px 0;
        font-size: 16px;
        font-weight: 600;
        color: #1f2937;
      }
      .airport-location {
        font-size: 14px;
        color: #6b7280;
        margin-bottom: 8px;
      }
      .airport-codes {
        display: flex;
        gap: 8px;
        margin-bottom: 8px;
      }
      .airport-code {
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;
      }
      .airport-code.iata {
        background: #dbeafe;
        color: #1e40af;
      }
      .airport-code.icao {
        background: #e5e7eb;
        color: #374151;
      }
      .airport-coordinates {
        font-size: 12px;
        color: #9ca3af;
      }
    </style>
  `;
}

/**
 * Añade un círculo de área alrededor del aeropuerto
 */
export function addAreaCircle(
  L: typeof import("leaflet"),
  map: any,
  latitude: number,
  longitude: number,
  radiusKm = 3
) {
  L.circle([latitude, longitude], {
    color: "#3b82f6",
    fillColor: "#60a5fa",
    fillOpacity: 0.15,
    radius: radiusKm * 1000, // Convertir km a metros
  }).addTo(map);
}
