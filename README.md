# SkyConnect Explorer

## 📦 Instalar dependencias

```bash
bun i
```

## ⚙️ Configurar Variables de entorno

copiar `.env.example` a `.env` y completar con:

```env
API_URL=https://api.aviationstack.com/v1
PRIVATE_KEY_AVIATIONSTACK=your_api_key_here
```

## 🚀 Iniciar el servidor de desarrollo:

```bash
bun run dev
```

Deberías ver el servidor corriendo en http://localhost:3000

## 🏠 construcción del proyecto a producción:

```bash
bun run build

bun run start
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### Dependencias de desarrollo (tipos):

```bash
bun add -D @types/leaflet
```



## 📚 Librerías instaladas, agradezco a los autores de estas por su trabajo y contribuciones:

- **zustand**: State management ligero
- **leaflet**: Librería de mapas interactivos
- **react-leaflet**: Wrapper de Leaflet para React
- **@types/leaflet**: Tipos de TypeScript para Leaflet
- **framer-motion**: Animaciones fluidas
- **clsx**: Utilidad para combinar class names
- **tailwind-merge**: Merge de clases de Tailwind sin conflictos
- **date-fns**: Utilidades para manejo de fechas