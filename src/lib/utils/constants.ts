// Configuración de la API
export const API_CONFIG = {
  BASE_URL: process.env.API_URL || "https://api.aviationstack.com/v1",
  API_KEY: process.env.PRIVATE_KEY_AVIATIONSTACK || "",
  TIMEOUT: 10000, // 10 segundos
} as const;

// Configuración de paginación
export const PAGINATION = {
  DEFAULT_LIMIT: 6,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1,
};

// Tabs del detalle del aeropuerto
export const AIRPORT_TABS = [
  { id: "general", label: "General" },
  { id: "location", label: "Ubicación" },
  { id: "timezone", label: "Zona Horaria" },
  { id: "statistics", label: "Estadísticas" },
] as const;

// Tiempos de caché (en segundos)
export const CACHE_TIME = {
  AIRPORTS_LIST: 3600, // 1 hora
  AIRPORT_DETAILS: 7200, // 2 horas
  SEARCH_RESULTS: 1800, // 30 minutos
} as const;

// Mensajes de error
export const ERROR_MESSAGES = {
  NETWORK_ERROR:
    "Error de conexión. Por favor, verifica tu conexión a internet.",
  API_ERROR: "Error al obtener los datos. Intenta nuevamente.",
  NOT_FOUND: "No se encontraron resultados.",
  INVALID_SEARCH: "Por favor, ingresa un término de búsqueda válido.",
  TIMEOUT: "La solicitud ha tardado demasiado. Intenta nuevamente.",
} as const;

// Límites de búsqueda
export const SEARCH_LIMITS = {
  MIN_QUERY_LENGTH: 2,
  MAX_QUERY_LENGTH: 100,
  DEBOUNCE_TIME: 500, // ms
} as const;
