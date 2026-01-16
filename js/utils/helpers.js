/**
 * NICMAT S.R.L. - Sistema de Cotización
 * Utilidad: Funciones auxiliares
 * @version 1.0.0
 */

/**
 * Genera un ID único
 * @returns {string} ID único
 */
export function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Formatea una fecha
 * @param {Date|string|number} date - Fecha a formatear
 * @param {string} format - Formato de salida
 * @returns {string} Fecha formateada
 */
export function formatDate(date, format = 'DD/MM/YYYY') {
    const d = new Date(date);
    
    if (isNaN(d.getTime())) {
        return '';
    }

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');

    return format
        .replace('DD', day)
        .replace('MM', month)
        .replace('YYYY', year)
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds);
}

/**
 * Obtiene la fecha actual formateada
 * @returns {string} Fecha actual
 */
export function getCurrentDate() {
    return formatDate(new Date());
}

/**
 * Debounce - retrasa la ejecución de una función
 * @param {Function} func - Función a ejecutar
 * @param {number} wait - Tiempo de espera en ms
 * @returns {Function} Función con debounce
 */
export function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle - limita la ejecución de una función
 * @param {Function} func - Función a ejecutar
 * @param {number} limit - Límite de tiempo en ms
 * @returns {Function} Función con throttle
 */
export function throttle(func, limit = 300) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Capitaliza la primera letra de un texto
 * @param {string} text - Texto a capitalizar
 * @returns {string} Texto capitalizado
 */
export function capitalize(text) {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Trunca un texto a una longitud máxima
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @param {string} suffix - Sufijo a agregar
 * @returns {string} Texto truncado
 */
export function truncate(text, maxLength = 50, suffix = '...') {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Escapa HTML para prevenir XSS
 * @param {string} text - Texto a escapar
 * @returns {string} Texto escapado
 */
export function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Clona un objeto de forma profunda
 * @param {Object} obj - Objeto a clonar
 * @returns {Object} Objeto clonado
 */
export function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    
    try {
        return JSON.parse(JSON.stringify(obj));
    } catch (error) {
        console.error('Error al clonar objeto:', error);
        return obj;
    }
}

/**
 * Compara si dos objetos son iguales
 * @param {Object} obj1 - Primer objeto
 * @param {Object} obj2 - Segundo objeto
 * @returns {boolean} true si son iguales
 */
export function isEqual(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
}

/**
 * Ordena un array de objetos por una propiedad
 * @param {Array} array - Array a ordenar
 * @param {string} key - Propiedad por la cual ordenar
 * @param {string} order - 'asc' o 'desc'
 * @returns {Array} Array ordenado
 */
export function sortBy(array, key, order = 'asc') {
    return [...array].sort((a, b) => {
        const valA = a[key];
        const valB = b[key];
        
        if (valA < valB) return order === 'asc' ? -1 : 1;
        if (valA > valB) return order === 'asc' ? 1 : -1;
        return 0;
    });
}

/**
 * Filtra un array de objetos por búsqueda
 * @param {Array} array - Array a filtrar
 * @param {string} query - Término de búsqueda
 * @param {string[]} keys - Propiedades donde buscar
 * @returns {Array} Array filtrado
 */
export function searchFilter(array, query, keys) {
    if (!query) return array;
    
    const lowerQuery = query.toLowerCase();
    
    return array.filter(item => {
        return keys.some(key => {
            const value = item[key];
            if (value === null || value === undefined) return false;
            return String(value).toLowerCase().includes(lowerQuery);
        });
    });
}

/**
 * Espera un tiempo determinado (promesa)
 * @param {number} ms - Milisegundos a esperar
 * @returns {Promise} Promesa que se resuelve después del tiempo
 */
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Verifica si el dispositivo es móvil
 * @returns {boolean} true si es móvil
 */
export function isMobile() {
    return window.innerWidth <= 768;
}

/**
 * Verifica si el dispositivo es tablet
 * @returns {boolean} true si es tablet
 */
export function isTablet() {
    return window.innerWidth > 768 && window.innerWidth <= 1024;
}

/**
 * Verifica si el dispositivo es desktop
 * @returns {boolean} true si es desktop
 */
export function isDesktop() {
    return window.innerWidth > 1024;
}

/**
 * Obtiene las iniciales de un nombre
 * @param {string} name - Nombre completo
 * @returns {string} Iniciales (máximo 2)
 */
export function getInitials(name) {
    if (!name) return '';
    
    const words = name.trim().split(/\s+/);
    if (words.length === 1) {
        return words[0].substring(0, 2).toUpperCase();
    }
    
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}
