# Cliente API de Aviationstack - Documentación Completa

### **endpoints.ts** ✅

- Configuración de endpoints
- Función `buildURL()` para construir URLs con parámetros
- Interfaz `AirportQueryParams` para tipado
- Validación de parámetros de búsqueda

### **mappers.ts**

- Mapeo de datos crudos a tipos TypeScript
- `mapAirport()` - Transforma aeropuerto individual
- `mapAirportsResponse()` - Transforma respuesta completa
- `mapSingleAirport()` - Obtiene primer resultado
- `removeDuplicateAirports()` - Elimina duplicados
- `sortAirportsByName()` - Ordena alfabéticamente

### **client.ts**

- Cliente principal de la API
- Clase `AviationstackError` para errores personalizados
- Función `fetchAPI()` con manejo de errores y timeout
- `getAirports()` - Lista de aeropuertos con paginación
- `getAirportByIATA()` - Buscar por código IATA
- `getAirportByICAO()` - Buscar por código ICAO
- `searchAirports()` - Búsqueda por nombre
- `getAirportsByCountry()` - Filtrar por país

## 🚀 Uso Rápido

\`\`\`typescript
import { aviationstackClient } from "@/services/aviationstack";

// Obtener aeropuertos
const airports = await aviationstackClient.getAirports({ limit: 10 });

// Buscar por código
const airport = await aviationstackClient.getAirportByIATA("BOG");

// Buscar por nombre
const results = await aviationstackClient.searchAirports("Bogotá");
\`\`\`

## 🧪 Testing

Para probar el cliente:

\`\`\`typescript
// Crear un archivo de prueba
// src/app/test/page.tsx

import { aviationstackClient } from "@/services/aviationstack";

export default async function TestPage() {
const airports = await aviationstackClient.getAirports({ limit: 5 });

return (
<pre>{JSON.stringify(airports, null, 2)}</pre>
);
}
\`\`\`

Visita: http://localhost:3000/test
