/**
 * Utilidades para manejo de sesión y almacenamiento
 */

/**
 * Interfaz para almacenar datos en localStorage con versionado
 */
interface StorageItem<T> {
  version: number;
  data: T;
  timestamp: number;
}

/**
 * Alias para localStorage con tipos seguros
 */
export class StorageService {
  private readonly PREFIX = 'iclinic_';

  private get storage(): Storage | null {
    if (typeof globalThis === 'undefined' || !('localStorage' in globalThis)) {
      return null;
    }

    return globalThis.localStorage;
  }

  /**
   * Guarda un item en localStorage
   */
  setItem<T>(key: string, value: T): void {
    const item: StorageItem<T> = {
      version: 1,
      data: value,
      timestamp: Date.now(),
    };
    try {
      this.storage?.setItem(this.PREFIX + key, JSON.stringify(item));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  /**
   * Obtiene un item de localStorage
   */
  getItem<T>(key: string): T | null {
    try {
      const item = this.storage?.getItem(this.PREFIX + key);
      if (!item) return null;
      const parsed: StorageItem<T> = JSON.parse(item);
      return parsed.data;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }

  /**
   * Elimina un item de localStorage
   */
  removeItem(key: string): void {
    try {
      this.storage?.removeItem(this.PREFIX + key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }

  /**
   * Limpia localStorage
   */
  clear(): void {
    try {
      const storage = this.storage;
      if (!storage) {
        return;
      }

      const keys = Object.keys(storage);
      keys.forEach((key) => {
        if (key.startsWith(this.PREFIX)) {
          storage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
}
