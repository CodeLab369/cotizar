/**
 * NICMAT S.R.L. - Sistema de Cotización
 * Servicio: Configuraciones
 * @version 1.0.0
 */

import Storage from '../utils/storage.js';

/**
 * Configuración por defecto de la empresa
 */
const DEFAULT_COMPANY = {
    nombre: 'NICMAT S.R.L.',
    nit: '',
    direccion: '',
    telefono: '',
    telefono2: '',
    email: '',
    ciudad: 'Santa Cruz',
    logo: null // Base64 de la imagen
};

/**
 * Configuración por defecto de cotizaciones
 */
const DEFAULT_QUOTATION_CONFIG = {
    vigenciaDias: 15,
    prefijo: 'COT-',
    siguienteNumero: 1,
    terminosCondiciones: `• Los precios incluyen IVA.
• La validez de esta cotización es de {vigencia} días.
• Forma de pago: Contado / Crédito según acuerdo.
• Garantía según especificaciones del fabricante.
• Precios sujetos a cambio sin previo aviso.`,
    notasAdicionales: ''
};

/**
 * Clase para gestionar las configuraciones
 */
class SettingsService {
    constructor() {
        this.companyKey = 'company';
        this.quotationConfigKey = 'quotation_config';
    }

    // ==================== DATOS DE EMPRESA ====================

    /**
     * Obtiene los datos de la empresa
     * @returns {Object} Datos de la empresa
     */
    getCompany() {
        return Storage.get(this.companyKey, { ...DEFAULT_COMPANY });
    }

    /**
     * Guarda los datos de la empresa
     * @param {Object} data - Datos de la empresa
     * @returns {Object} Datos guardados
     */
    saveCompany(data) {
        const current = this.getCompany();
        const updated = {
            ...current,
            ...data,
            updatedAt: Date.now()
        };
        Storage.set(this.companyKey, updated);
        return updated;
    }

    /**
     * Guarda el logo de la empresa
     * @param {string} base64 - Logo en formato base64
     * @returns {Object} Datos de empresa actualizados
     */
    saveLogo(base64) {
        return this.saveCompany({ logo: base64 });
    }

    /**
     * Elimina el logo de la empresa
     * @returns {Object} Datos de empresa actualizados
     */
    removeLogo() {
        return this.saveCompany({ logo: null });
    }

    // ==================== CONFIGURACIÓN DE COTIZACIONES ====================

    /**
     * Obtiene la configuración de cotizaciones
     * @returns {Object} Configuración de cotizaciones
     */
    getQuotationConfig() {
        return Storage.get(this.quotationConfigKey, { ...DEFAULT_QUOTATION_CONFIG });
    }

    /**
     * Guarda la configuración de cotizaciones
     * @param {Object} config - Configuración de cotizaciones
     * @returns {Object} Configuración guardada
     */
    saveQuotationConfig(config) {
        const current = this.getQuotationConfig();
        const updated = {
            ...current,
            ...config,
            updatedAt: Date.now()
        };
        Storage.set(this.quotationConfigKey, updated);
        return updated;
    }

    /**
     * Obtiene el siguiente número de cotización formateado
     * @returns {string} Número de cotización (ej: COT-0001)
     */
    getNextQuotationNumber() {
        const config = this.getQuotationConfig();
        const year = new Date().getFullYear();
        const numero = String(config.siguienteNumero).padStart(4, '0');
        return `${config.prefijo}${year}-${numero}`;
    }

    /**
     * Incrementa el número de cotización
     * @returns {Object} Configuración actualizada
     */
    incrementQuotationNumber() {
        const config = this.getQuotationConfig();
        return this.saveQuotationConfig({
            siguienteNumero: config.siguienteNumero + 1
        });
    }

    // ==================== RESPALDO Y RESTAURACIÓN ====================

    /**
     * Exporta todos los datos del sistema
     * @returns {Object} Datos exportados
     */
    exportAllData() {
        const data = {
            version: '1.0.0',
            exportedAt: new Date().toISOString(),
            company: this.getCompany(),
            quotationConfig: this.getQuotationConfig(),
            inventory: Storage.get('inventory', []),
            stores: Storage.get('stores', []),
            sales: Storage.get('sales', []),
            clients: Storage.get('clients', []),
            quotations: Storage.get('quotations', [])
        };
        return data;
    }

    /**
     * Importa datos al sistema
     * @param {Object} data - Datos a importar
     * @param {Object} options - Opciones de importación
     * @returns {Object} Resultado de la importación
     */
    importData(data, options = { merge: false }) {
        const result = {
            success: true,
            imported: [],
            errors: []
        };

        try {
            // Validar versión
            if (!data.version) {
                throw new Error('Archivo de respaldo inválido: falta versión');
            }

            // Importar datos de empresa
            if (data.company) {
                if (options.merge) {
                    const current = this.getCompany();
                    this.saveCompany({ ...current, ...data.company });
                } else {
                    Storage.set(this.companyKey, data.company);
                }
                result.imported.push('Datos de empresa');
            }

            // Importar configuración de cotizaciones
            if (data.quotationConfig) {
                if (options.merge) {
                    const current = this.getQuotationConfig();
                    this.saveQuotationConfig({ ...current, ...data.quotationConfig });
                } else {
                    Storage.set(this.quotationConfigKey, data.quotationConfig);
                }
                result.imported.push('Configuración de cotizaciones');
            }

            // Importar inventario
            if (data.inventory) {
                if (options.merge) {
                    const current = Storage.get('inventory', []);
                    const merged = this.mergeArrays(current, data.inventory, 'id');
                    Storage.set('inventory', merged);
                } else {
                    Storage.set('inventory', data.inventory);
                }
                result.imported.push(`Inventario (${data.inventory.length} productos)`);
            }

            // Importar tiendas
            if (data.stores) {
                if (options.merge) {
                    const current = Storage.get('stores', []);
                    const merged = this.mergeArrays(current, data.stores, 'id');
                    Storage.set('stores', merged);
                } else {
                    Storage.set('stores', data.stores);
                }
                result.imported.push(`Tiendas (${data.stores.length})`);
            }

            // Importar ventas
            if (data.sales) {
                if (options.merge) {
                    const current = Storage.get('sales', []);
                    const merged = this.mergeArrays(current, data.sales, 'id');
                    Storage.set('sales', merged);
                } else {
                    Storage.set('sales', data.sales);
                }
                result.imported.push(`Ventas (${data.sales.length})`);
            }

            // Importar clientes
            if (data.clients) {
                if (options.merge) {
                    const current = Storage.get('clients', []);
                    const merged = this.mergeArrays(current, data.clients, 'id');
                    Storage.set('clients', merged);
                } else {
                    Storage.set('clients', data.clients);
                }
                result.imported.push(`Clientes (${data.clients.length})`);
            }

            // Importar cotizaciones
            if (data.quotations) {
                if (options.merge) {
                    const current = Storage.get('quotations', []);
                    const merged = this.mergeArrays(current, data.quotations, 'id');
                    Storage.set('quotations', merged);
                } else {
                    Storage.set('quotations', data.quotations);
                }
                result.imported.push(`Cotizaciones (${data.quotations.length})`);
            }

        } catch (error) {
            result.success = false;
            result.errors.push(error.message);
        }

        return result;
    }

    /**
     * Combina dos arrays evitando duplicados por ID
     * @param {Array} current - Array actual
     * @param {Array} imported - Array importado
     * @param {string} key - Clave para identificar duplicados
     * @returns {Array} Array combinado
     */
    mergeArrays(current, imported, key = 'id') {
        const map = new Map();
        
        // Agregar elementos actuales
        current.forEach(item => map.set(item[key], item));
        
        // Agregar/sobrescribir con importados
        imported.forEach(item => map.set(item[key], item));
        
        return Array.from(map.values());
    }

    /**
     * Limpia todos los datos del sistema
     * @param {boolean} keepSettings - Mantener configuraciones
     * @returns {boolean} Éxito de la operación
     */
    clearAllData(keepSettings = false) {
        try {
            // Limpiar datos principales
            Storage.remove('inventory');
            Storage.remove('stores');
            Storage.remove('sales');
            Storage.remove('clients');
            Storage.remove('quotations');

            // Limpiar configuraciones si se especifica
            if (!keepSettings) {
                Storage.remove(this.companyKey);
                Storage.remove(this.quotationConfigKey);
            }

            return true;
        } catch (error) {
            console.error('Error al limpiar datos:', error);
            return false;
        }
    }

    /**
     * Obtiene estadísticas de los datos almacenados
     * @returns {Object} Estadísticas
     */
    getDataStats() {
        return {
            inventory: Storage.get('inventory', []).length,
            stores: Storage.get('stores', []).length,
            sales: Storage.get('sales', []).length,
            clients: Storage.get('clients', []).length,
            quotations: Storage.get('quotations', []).length
        };
    }
}

// Exportar instancia única
const Settings = new SettingsService();
export default Settings;
