/**
 * NICMAT S.R.L. - Sistema de Cotización
 * Utilidad: Gestión de almacenamiento local
 * @version 1.0.0
 */

import APP_CONFIG from '../config.js';

/**
 * Clase para gestionar el almacenamiento local del navegador
 */
class StorageManager {
    constructor() {
        this.prefix = APP_CONFIG.storage.prefix;
    }

    /**
     * Obtiene la clave completa con prefijo
     * @param {string} key - Clave a procesar
     * @returns {string} Clave con prefijo
     */
    getFullKey(key) {
        return `${this.prefix}${key}`;
    }

    /**
     * Guarda un valor en el almacenamiento local
     * @param {string} key - Clave del valor
     * @param {any} value - Valor a guardar
     * @returns {boolean} true si se guardó correctamente
     */
    set(key, value) {
        try {
            const fullKey = this.getFullKey(key);
            const serializedValue = JSON.stringify({
                value,
                timestamp: Date.now()
            });
            localStorage.setItem(fullKey, serializedValue);
            return true;
        } catch (error) {
            console.error('Error al guardar en almacenamiento:', error);
            return false;
        }
    }

    /**
     * Obtiene un valor del almacenamiento local
     * @param {string} key - Clave del valor
     * @param {any} defaultValue - Valor por defecto si no existe
     * @returns {any} Valor almacenado o valor por defecto
     */
    get(key, defaultValue = null) {
        try {
            const fullKey = this.getFullKey(key);
            const item = localStorage.getItem(fullKey);
            
            if (item === null) {
                return defaultValue;
            }

            const parsed = JSON.parse(item);
            return parsed.value !== undefined ? parsed.value : defaultValue;
        } catch (error) {
            console.error('Error al obtener del almacenamiento:', error);
            return defaultValue;
        }
    }

    /**
     * Elimina un valor del almacenamiento local
     * @param {string} key - Clave del valor a eliminar
     * @returns {boolean} true si se eliminó correctamente
     */
    remove(key) {
        try {
            const fullKey = this.getFullKey(key);
            localStorage.removeItem(fullKey);
            return true;
        } catch (error) {
            console.error('Error al eliminar del almacenamiento:', error);
            return false;
        }
    }

    /**
     * Verifica si existe una clave en el almacenamiento
     * @param {string} key - Clave a verificar
     * @returns {boolean} true si existe
     */
    has(key) {
        const fullKey = this.getFullKey(key);
        return localStorage.getItem(fullKey) !== null;
    }

    /**
     * Limpia todos los datos de la aplicación del almacenamiento
     * @returns {boolean} true si se limpió correctamente
     */
    clear() {
        try {
            const keysToRemove = [];
            
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(this.prefix)) {
                    keysToRemove.push(key);
                }
            }
            
            keysToRemove.forEach(key => localStorage.removeItem(key));
            return true;
        } catch (error) {
            console.error('Error al limpiar almacenamiento:', error);
            return false;
        }
    }

    /**
     * Obtiene todas las claves de la aplicación
     * @returns {string[]} Array de claves
     */
    keys() {
        const appKeys = [];
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(this.prefix)) {
                appKeys.push(key.replace(this.prefix, ''));
            }
        }
        
        return appKeys;
    }

    /**
     * Obtiene el tamaño usado en el almacenamiento (aproximado)
     * @returns {string} Tamaño en formato legible
     */
    getSize() {
        let total = 0;
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(this.prefix)) {
                total += localStorage.getItem(key).length;
            }
        }
        
        // Convertir a formato legible
        if (total < 1024) {
            return `${total} bytes`;
        } else if (total < 1024 * 1024) {
            return `${(total / 1024).toFixed(2)} KB`;
        } else {
            return `${(total / (1024 * 1024)).toFixed(2)} MB`;
        }
    }
}

// Crear instancia única (singleton)
const Storage = new StorageManager();

export default Storage;
