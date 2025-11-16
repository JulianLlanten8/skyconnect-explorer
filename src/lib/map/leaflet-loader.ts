/**
 * Utilidad para cargar Leaflet de forma segura en Next.js
 * Leaflet requiere 'window' que solo existe en el navegador, no en el servidor
 */

// Variable global para almacenar Leaflet una vez cargado
let leafletInstance: typeof import("leaflet") | null = null;

/**
 * Carga Leaflet dinámicamente (solo se ejecuta una vez)
 * @returns Instancia de Leaflet lista para usar
 */
export async function loadLeaflet() {
  // Si ya está cargado, retornarlo
  if (leafletInstance) {
    return leafletInstance;
  }

  // Paso 1: Cargar el CSS de Leaflet (solo una vez)
  loadLeafletCSS();

  // Paso 2: Importar la librería Leaflet
  leafletInstance = await import("leaflet");

  // Paso 3: Arreglar el problema de los iconos
  fixLeafletIcons(leafletInstance);

  return leafletInstance;
}

/**
 * Carga el CSS de Leaflet si no está ya cargado
 */
function loadLeafletCSS() {
  // Verificar si ya está cargado
  if (document.querySelector('link[href*="leaflet.css"]')) {
    return;
  }

  // Crear y añadir el tag <link> al <head>
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
  link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
  link.crossOrigin = "";
  document.head.appendChild(link);
}

/**
 * Arregla el problema de iconos de Leaflet con Webpack/Next.js
 * Webpack cambia las rutas de los iconos, necesitamos URLs absolutas
 */
function fixLeafletIcons(L: typeof import("leaflet")) {
  // Eliminar el método que causa problemas
  delete (L.Icon.Default.prototype as any)._getIconUrl;

  // Configurar URLs absolutas para los iconos
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}
