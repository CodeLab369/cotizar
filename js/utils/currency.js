/**
 * NICMAT S.R.L. - Sistema de Cotización
 * Utilidad: Formateo de moneda (Bolivianos)
 * @version 1.0.0
 */

import APP_CONFIG from '../config.js';

/**
 * Clase para gestionar el formateo de moneda boliviana
 */
class CurrencyFormatter {
    constructor() {
        this.config = APP_CONFIG.currency;
    }

    /**
     * Formatea un número a formato de moneda boliviana
     * @param {number} value - Valor a formatear
     * @param {boolean} includeSymbol - Incluir símbolo de moneda
     * @returns {string} Valor formateado (ej: "1.500,50" o "Bs. 1.500,50")
     */
    format(value, includeSymbol = true) {
        if (value === null || value === undefined || isNaN(value)) {
            return includeSymbol ? `${this.config.symbol} 0,00` : '0,00';
        }

        // Convertir a número
        const numValue = parseFloat(value);
        
        // Separar parte entera y decimal
        const fixed = numValue.toFixed(this.config.decimals);
        const [integerPart, decimalPart] = fixed.split('.');
        
        // Agregar separador de miles
        const formattedInteger = integerPart.replace(
            /\B(?=(\d{3})+(?!\d))/g, 
            this.config.thousandsSeparator
        );
        
        // Combinar partes
        const formattedValue = `${formattedInteger}${this.config.decimalSeparator}${decimalPart}`;
        
        return includeSymbol 
            ? `${this.config.symbol} ${formattedValue}` 
            : formattedValue;
    }

    /**
     * Parsea un string de moneda boliviana a número
     * @param {string} value - Valor en formato boliviano (ej: "1.500,50")
     * @returns {number} Valor numérico
     */
    parse(value) {
        if (value === null || value === undefined || value === '') {
            return 0;
        }

        // Convertir a string si no lo es
        let strValue = String(value);
        
        // Remover símbolo de moneda
        strValue = strValue.replace(this.config.symbol, '').trim();
        
        // Remover separadores de miles y reemplazar coma por punto
        strValue = strValue
            .replace(new RegExp(`\\${this.config.thousandsSeparator}`, 'g'), '')
            .replace(this.config.decimalSeparator, '.');
        
        const parsed = parseFloat(strValue);
        return isNaN(parsed) ? 0 : parsed;
    }

    /**
     * Formatea un input mientras el usuario escribe
     * @param {string} value - Valor del input
     * @returns {string} Valor formateado para el input
     */
    formatInput(value) {
        if (!value) return '';
        
        // Remover todo excepto números y comas
        let cleaned = value.replace(/[^\d,]/g, '');
        
        // Asegurar que solo haya una coma
        const parts = cleaned.split(',');
        if (parts.length > 2) {
            cleaned = parts[0] + ',' + parts.slice(1).join('');
        }
        
        // Limitar decimales
        if (parts.length === 2 && parts[1].length > this.config.decimals) {
            cleaned = parts[0] + ',' + parts[1].substring(0, this.config.decimals);
        }
        
        // Agregar separadores de miles a la parte entera
        const [intPart, decPart] = cleaned.split(',');
        const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        
        return decPart !== undefined ? `${formattedInt},${decPart}` : formattedInt;
    }

    /**
     * Valida si un valor es un formato de moneda válido
     * @param {string} value - Valor a validar
     * @returns {boolean} true si es válido
     */
    isValid(value) {
        if (!value) return false;
        
        // Patrón para moneda boliviana: 1.234,56 o 1234,56 o 1234
        const pattern = /^(\d{1,3}(\.\d{3})*|\d+)(,\d{1,2})?$/;
        const cleanValue = String(value).replace(this.config.symbol, '').trim();
        
        return pattern.test(cleanValue);
    }

    /**
     * Redondea un valor a los decimales configurados
     * @param {number} value - Valor a redondear
     * @returns {number} Valor redondeado
     */
    round(value) {
        const multiplier = Math.pow(10, this.config.decimals);
        return Math.round(value * multiplier) / multiplier;
    }

    /**
     * Suma múltiples valores
     * @param {...number} values - Valores a sumar
     * @returns {number} Suma total
     */
    sum(...values) {
        return this.round(values.reduce((acc, val) => acc + (parseFloat(val) || 0), 0));
    }

    /**
     * Calcula porcentaje
     * @param {number} value - Valor base
     * @param {number} percentage - Porcentaje a calcular
     * @returns {number} Resultado del porcentaje
     */
    percentage(value, percentage) {
        return this.round((value * percentage) / 100);
    }

    /**
     * Obtiene el símbolo de la moneda
     * @returns {string} Símbolo de moneda
     */
    getSymbol() {
        return this.config.symbol;
    }
}

// Crear instancia única (singleton)
const Currency = new CurrencyFormatter();

export default Currency;
