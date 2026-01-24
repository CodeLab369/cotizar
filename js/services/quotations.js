/**
 * NICMAT S.R.L. - Sistema de Cotización
 * Servicio: Cotizaciones
 * @version 1.0.0
 */

import Storage from '../utils/storage.js';
import Currency from '../utils/currency.js';
import { generateId } from '../utils/helpers.js';
import Settings from './settings.js';
import Inventory from './inventory.js';

const STORAGE_KEY = 'quotations';

/**
 * Estados de cotización
 */
const QUOTATION_STATUS = {
    PENDING: 'pending',      // Pendiente - esperando respuesta del cliente
    ACCEPTED: 'accepted',    // Aceptada - cliente aceptó
    REJECTED: 'rejected',    // Rechazada - cliente rechazó
    EXPIRED: 'expired',      // Vencida - pasó la fecha de vigencia
    CONVERTED: 'converted'   // Convertida - se convirtió en venta
};

/**
 * Etiquetas de estados
 */
const STATUS_LABELS = {
    [QUOTATION_STATUS.PENDING]: 'Pendiente',
    [QUOTATION_STATUS.ACCEPTED]: 'Aceptada',
    [QUOTATION_STATUS.REJECTED]: 'Rechazada',
    [QUOTATION_STATUS.EXPIRED]: 'Vencida',
    [QUOTATION_STATUS.CONVERTED]: 'Convertida a Venta'
};

/**
 * Colores de estados para UI
 */
const STATUS_COLORS = {
    [QUOTATION_STATUS.PENDING]: 'warning',
    [QUOTATION_STATUS.ACCEPTED]: 'success',
    [QUOTATION_STATUS.REJECTED]: 'danger',
    [QUOTATION_STATUS.EXPIRED]: 'muted',
    [QUOTATION_STATUS.CONVERTED]: 'primary'
};

class QuotationsService {
    /**
     * Obtiene todas las cotizaciones
     * @returns {Array}
     */
    getAll() {
        const quotations = Storage.get(STORAGE_KEY, []);
        // Actualizar estados de cotizaciones vencidas
        return quotations.map(q => this.checkExpiration(q));
    }

    /**
     * Verifica si una cotización está vencida
     * @param {Object} quotation
     * @returns {Object}
     */
    checkExpiration(quotation) {
        if (quotation.status === QUOTATION_STATUS.PENDING) {
            const now = Date.now();
            if (now > quotation.expirationDate) {
                quotation.status = QUOTATION_STATUS.EXPIRED;
                this.updateStatus(quotation.id, QUOTATION_STATUS.EXPIRED);
            }
        }
        return quotation;
    }

    /**
     * Obtiene una cotización por ID
     * @param {string} id
     * @returns {Object|null}
     */
    getById(id) {
        const quotations = this.getAll();
        return quotations.find(q => q.id === id) || null;
    }

    /**
     * Obtiene cotizaciones por estado
     * @param {string} status
     * @returns {Array}
     */
    getByStatus(status) {
        return this.getAll().filter(q => q.status === status);
    }

    /**
     * Crea una nueva cotización
     * @param {Object} quotationData
     * @returns {Object}
     */
    create(quotationData) {
        const quotations = Storage.get(STORAGE_KEY, []);
        const config = Settings.getQuotationConfig();
        const company = Settings.getCompany();

        if (!quotationData.items || quotationData.items.length === 0) {
            throw new Error('No hay productos en la cotización');
        }

        // Validar y preparar items
        const preparedItems = quotationData.items.map(item => {
            const cantidad = parseInt(item.cantidad) || 0;
            const precio = Currency.parse(item.precio) || 0;
            
            if (cantidad <= 0) throw new Error(`Cantidad inválida para ${item.marca} ${item.amperaje}`);
            if (precio < 0) throw new Error(`Precio inválido para ${item.marca} ${item.amperaje}`);

            return {
                marca: item.marca,
                amperaje: item.amperaje,
                cantidad,
                precio,
                total: Currency.round(cantidad * precio)
            };
        });

        const totalBaterias = preparedItems.reduce((sum, item) => sum + item.cantidad, 0);
        const totalImporte = preparedItems.reduce((sum, item) => sum + item.total, 0);
        const descuento = Currency.parse(quotationData.descuento) || 0;
        const totalSaldo = Math.max(0, Currency.round(totalImporte - descuento));

        // Calcular fecha de vencimiento
        const vigenciaDias = quotationData.vigenciaDias || config.vigenciaDias;
        const expirationDate = Date.now() + (vigenciaDias * 24 * 60 * 60 * 1000);

        // Obtener número de cotización
        const numero = Settings.getNextQuotationNumber();

        const newQuotation = {
            id: generateId(),
            numero,
            date: Date.now(),
            expirationDate,
            vigenciaDias,
            status: QUOTATION_STATUS.PENDING,
            
            // Datos del cliente
            cliente: {
                nombre: quotationData.clienteNombre || '',
                telefono: quotationData.clienteTelefono || '',
                email: quotationData.clienteEmail || '',
                direccion: quotationData.clienteDireccion || ''
            },
            
            // Items y totales
            items: preparedItems,
            totalBaterias,
            totalImporte,
            descuento,
            totalSaldo,
            
            // Notas
            notas: quotationData.notas || '',
            terminosCondiciones: config.terminosCondiciones.replace('{vigencia}', vigenciaDias),
            
            // Datos de empresa al momento de crear
            empresa: {
                nombre: company.nombre,
                nit: company.nit,
                direccion: company.direccion,
                telefono: company.telefono,
                telefono2: company.telefono2,
                email: company.email,
                ciudad: company.ciudad,
                logo: company.logo
            }
        };

        // Incrementar número de cotización
        Settings.incrementQuotationNumber();

        quotations.unshift(newQuotation);
        Storage.set(STORAGE_KEY, quotations);

        return newQuotation;
    }

    /**
     * Actualiza una cotización
     * @param {string} id
     * @param {Object} data
     * @returns {Object}
     */
    update(id, data) {
        const quotations = Storage.get(STORAGE_KEY, []);
        const index = quotations.findIndex(q => q.id === id);
        
        if (index === -1) throw new Error('Cotización no encontrada');
        
        // Solo se puede editar si está pendiente
        if (quotations[index].status !== QUOTATION_STATUS.PENDING) {
            throw new Error('Solo se pueden editar cotizaciones pendientes');
        }

        // Validar y preparar items si se enviaron
        if (data.items) {
            const preparedItems = data.items.map(item => {
                const cantidad = parseInt(item.cantidad) || 0;
                const precio = Currency.parse(item.precio) || 0;
                
                if (cantidad <= 0) throw new Error(`Cantidad inválida para ${item.marca} ${item.amperaje}`);
                if (precio < 0) throw new Error(`Precio inválido para ${item.marca} ${item.amperaje}`);

                return {
                    marca: item.marca,
                    amperaje: item.amperaje,
                    cantidad,
                    precio,
                    total: Currency.round(cantidad * precio)
                };
            });

            const totalBaterias = preparedItems.reduce((sum, item) => sum + item.cantidad, 0);
            const totalImporte = preparedItems.reduce((sum, item) => sum + item.total, 0);
            const descuento = Currency.parse(data.descuento) || quotations[index].descuento;
            const totalSaldo = Math.max(0, Currency.round(totalImporte - descuento));

            data.items = preparedItems;
            data.totalBaterias = totalBaterias;
            data.totalImporte = totalImporte;
            data.descuento = descuento;
            data.totalSaldo = totalSaldo;
        }

        // Actualizar cliente si se envió
        if (data.clienteNombre !== undefined || data.clienteTelefono !== undefined || 
            data.clienteEmail !== undefined || data.clienteDireccion !== undefined) {
            data.cliente = {
                ...quotations[index].cliente,
                nombre: data.clienteNombre ?? quotations[index].cliente.nombre,
                telefono: data.clienteTelefono ?? quotations[index].cliente.telefono,
                email: data.clienteEmail ?? quotations[index].cliente.email,
                direccion: data.clienteDireccion ?? quotations[index].cliente.direccion
            };
        }

        quotations[index] = {
            ...quotations[index],
            ...data,
            updatedAt: Date.now()
        };

        Storage.set(STORAGE_KEY, quotations);
        return quotations[index];
    }

    /**
     * Actualiza el estado de una cotización
     * @param {string} id
     * @param {string} status
     * @returns {Object}
     */
    updateStatus(id, status) {
        const quotations = Storage.get(STORAGE_KEY, []);
        const index = quotations.findIndex(q => q.id === id);
        
        if (index === -1) throw new Error('Cotización no encontrada');

        quotations[index].status = status;
        quotations[index].statusUpdatedAt = Date.now();

        Storage.set(STORAGE_KEY, quotations);
        return quotations[index];
    }

    /**
     * Elimina una cotización
     * @param {string} id
     * @returns {boolean}
     */
    delete(id) {
        const quotations = Storage.get(STORAGE_KEY, []);
        const index = quotations.findIndex(q => q.id === id);
        
        if (index === -1) return false;

        quotations.splice(index, 1);
        Storage.set(STORAGE_KEY, quotations);
        return true;
    }

    /**
     * Convierte una cotización en venta
     * @param {string} id
     * @returns {Object} Datos para crear la venta
     */
    convertToSale(id) {
        const quotation = this.getById(id);
        
        if (!quotation) throw new Error('Cotización no encontrada');
        if (quotation.status === QUOTATION_STATUS.CONVERTED) {
            throw new Error('Esta cotización ya fue convertida a venta');
        }
        if (quotation.status === QUOTATION_STATUS.EXPIRED) {
            throw new Error('No se puede convertir una cotización vencida');
        }
        if (quotation.status === QUOTATION_STATUS.REJECTED) {
            throw new Error('No se puede convertir una cotización rechazada');
        }

        // Verificar stock disponible
        for (const item of quotation.items) {
            const product = Inventory.findByMarcaAmperaje(item.marca, item.amperaje);
            if (!product) {
                throw new Error(`Producto no encontrado: ${item.marca} ${item.amperaje}`);
            }
            if (product.cantidad < item.cantidad) {
                throw new Error(`Stock insuficiente para ${item.marca} ${item.amperaje}. Disponible: ${product.cantidad}, Requerido: ${item.cantidad}`);
            }
        }

        // Marcar como convertida
        this.updateStatus(id, QUOTATION_STATUS.CONVERTED);

        // Retornar datos para crear la venta
        return {
            items: quotation.items,
            descuento: quotation.descuento,
            quotationId: quotation.id,
            quotationNumero: quotation.numero
        };
    }

    /**
     * Obtiene estadísticas de cotizaciones
     * @returns {Object}
     */
    getStats() {
        const quotations = this.getAll();
        const now = Date.now();
        const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);

        const thisMonth = quotations.filter(q => q.date >= thirtyDaysAgo);

        return {
            total: quotations.length,
            pending: quotations.filter(q => q.status === QUOTATION_STATUS.PENDING).length,
            accepted: quotations.filter(q => q.status === QUOTATION_STATUS.ACCEPTED).length,
            rejected: quotations.filter(q => q.status === QUOTATION_STATUS.REJECTED).length,
            expired: quotations.filter(q => q.status === QUOTATION_STATUS.EXPIRED).length,
            converted: quotations.filter(q => q.status === QUOTATION_STATUS.CONVERTED).length,
            thisMonth: thisMonth.length,
            totalValue: quotations.reduce((sum, q) => sum + q.totalSaldo, 0),
            pendingValue: quotations
                .filter(q => q.status === QUOTATION_STATUS.PENDING)
                .reduce((sum, q) => sum + q.totalSaldo, 0)
        };
    }

    /**
     * Obtiene etiqueta de estado
     * @param {string} status
     * @returns {string}
     */
    getStatusLabel(status) {
        return STATUS_LABELS[status] || status;
    }

    /**
     * Obtiene color de estado
     * @param {string} status
     * @returns {string}
     */
    getStatusColor(status) {
        return STATUS_COLORS[status] || 'muted';
    }

    /**
     * Constantes de estados
     */
    get STATUS() {
        return QUOTATION_STATUS;
    }
}

// Crear instancia única
const Quotations = new QuotationsService();

export default Quotations;
