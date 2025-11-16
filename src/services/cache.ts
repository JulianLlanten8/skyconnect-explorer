/**
 * Sistema de caché simple en memoria para evitar llamadas duplicadas a la API
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class SimpleCache {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultTTL = 60 * 60 * 1000; // 1 hora

  /**
   * Obtener datos del cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Verificar si expiró
    const now = Date.now();
    if (now - entry.timestamp > this.defaultTTL) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Guardar datos en cache
   */
  set<T>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });

    // Auto-limpiar después del TTL
    if (ttl) {
      setTimeout(() => {
        this.cache.delete(key);
      }, ttl);
    }
  }

  /**
   * Verificar si existe y no ha expirado
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);

    if (!entry) {
      return false;
    }

    const now = Date.now();
    if (now - entry.timestamp > this.defaultTTL) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Limpiar todo el cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Eliminar una entrada específica
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Obtener estadísticas del cache
   */
  stats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Instancia global del cache
export const apiCache = new SimpleCache();

/**
 * Helper para generar keys de cache
 */
export function createCacheKey(prefix: string, params?: Record<string, any>): string {
  if (!params) {
    return prefix;
  }

  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');

  return `${prefix}:${sortedParams}`;
}

/**
 * Tags de caché (compatibilidad con código anterior)
 */
export const CACHE_TAGS = {
  AIRPORTS: "airports",
  AIRPORT_DETAILS: (code: string) => `airport:${code}`,
  SEARCH: (query: string) => `search:${query}`,
} as const;
