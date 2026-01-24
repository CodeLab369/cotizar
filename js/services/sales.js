/**
 * NICMAT S.R.L. - Sistema de Cotización
 * Servicio: Ventas
 * @version 1.0.0
 */

import Storage from '../utils/storage.js';
import Currency from '../utils/currency.js';
import { generateId } from '../utils/helpers.js';
import Inventory from './inventory.js';

const STORAGE_KEY = 'sales';

class SalesService {
    /**
     * Obtiene todas las ventas
     * @returns {Array}
     */
    getAll() {
        return Storage.get(STORAGE_KEY, []);
    }

    /**
     * Obtiene una venta por ID
     * @param {string} id
     * @returns {Object|null}
     */
    getById(id) {
        const sales = this.getAll();
        return sales.find(sale => sale.id === id) || null;
    }

    /**
     * Registra una nueva venta y descuenta stock
     * @param {Object} saleData
     * @returns {Object} Venta registrada
     */
    add(saleData) {
        const sales = this.getAll();

        if (!saleData.items || saleData.items.length === 0) {
            throw new Error('No hay productos en la venta');
        }

        // Validar y preparar items
        const preparedItems = saleData.items.map(item => {
            const product = Inventory.findByMarcaAmperaje(item.marca, item.amperaje);
            if (!product) throw new Error(`Producto no encontrado: ${item.marca} ${item.amperaje}`);

            const cantidad = parseInt(item.cantidad) || 0;
            const precio = Currency.parse(item.precio) || 0;
            if (cantidad <= 0) throw new Error(`Cantidad inválida para ${item.marca} ${item.amperaje}`);
            if (precio < 0) throw new Error(`Precio inválido para ${item.marca} ${item.amperaje}`);

            // Validar stock
            if (cantidad > product.cantidad) {
                throw new Error(`Stock insuficiente para ${item.marca} ${item.amperaje}. Disponible: ${product.cantidad}`);
            }

            return {
                productId: product.id,
                marca: product.marca,
                amperaje: product.amperaje,
                cantidad,
                precio,
                total: Currency.round(cantidad * precio)
            };
        });

        const totalBaterias = preparedItems.reduce((sum, item) => sum + item.cantidad, 0);
        const totalImporte = preparedItems.reduce((sum, item) => sum + item.total, 0);
        const descuento = Currency.parse(saleData.descuento) || 0;
        const totalSaldo = Math.max(0, Currency.round(totalImporte - descuento));

        const newSale = {
            id: generateId(),
            date: Date.now(),
            items: preparedItems,
            totalBaterias,
            totalImporte,
            descuento,
            totalSaldo
        };

        // Descontar stock
        preparedItems.forEach(item => {
            const product = Inventory.getById(item.productId);
            if (product) {
                Inventory.update(product.id, {
                    marca: product.marca,
                    amperaje: product.amperaje,
                    cantidad: product.cantidad - item.cantidad,
                    costo: product.costo,
                    precioVenta: product.precioVenta
                });
            }
        });

        sales.unshift(newSale); // Insertar al inicio para mostrar la venta más reciente primero
        Storage.set(STORAGE_KEY, sales);

        return newSale;
    }

    /**
     * Actualiza una venta existente
     * @param {string} id
     * @param {Object} updatedSale
     * @returns {boolean}
     */
    update(id, updatedSale) {
        const sales = this.getAll();
        const index = sales.findIndex(sale => sale.id === id);
        if (index === -1) return false;
        
        sales[index] = {
            ...sales[index],
            items: updatedSale.items,
            totalBaterias: updatedSale.totalBaterias,
            totalImporte: updatedSale.totalImporte,
            descuento: updatedSale.descuento,
            totalSaldo: updatedSale.totalSaldo
        };
        
        Storage.set(STORAGE_KEY, sales);
        return true;
    }

    /**
     * Actualiza una venta con manejo de stock (para edición completa)
     * @param {string} id
     * @param {Object} saleData
     * @returns {Object}
     */
    updateWithStock(id, saleData) {
        const sales = this.getAll();
        const index = sales.findIndex(sale => sale.id === id);
        if (index === -1) throw new Error('Venta no encontrada');
        
        const oldSale = sales[index];
        
        // Validar y preparar nuevos items
        const preparedItems = saleData.items.map(item => {
            const product = Inventory.findByMarcaAmperaje(item.marca, item.amperaje);
            if (!product) throw new Error(`Producto no encontrado: ${item.marca} ${item.amperaje}`);

            const cantidad = parseInt(item.cantidad) || 0;
            const precio = Currency.parse(item.precio) || 0;
            if (cantidad <= 0) throw new Error(`Cantidad inválida para ${item.marca} ${item.amperaje}`);
            if (precio < 0) throw new Error(`Precio inválido para ${item.marca} ${item.amperaje}`);

            // Validar stock (ya fue repuesto antes de editar)
            if (cantidad > product.cantidad) {
                throw new Error(`Stock insuficiente para ${item.marca} ${item.amperaje}. Disponible: ${product.cantidad}`);
            }

            return {
                productId: product.id,
                marca: product.marca,
                amperaje: product.amperaje,
                cantidad,
                precio,
                total: Currency.round(cantidad * precio)
            };
        });

        const totalBaterias = preparedItems.reduce((sum, item) => sum + item.cantidad, 0);
        const totalImporte = preparedItems.reduce((sum, item) => sum + item.total, 0);
        const descuento = Currency.parse(saleData.descuento) || 0;
        const totalSaldo = Math.max(0, Currency.round(totalImporte - descuento));

        // Descontar stock de nuevos items
        this.deductStock(preparedItems);

        // Actualizar venta
        sales[index] = {
            ...oldSale,
            items: preparedItems,
            totalBaterias,
            totalImporte,
            descuento,
            totalSaldo
        };
        
        Storage.set(STORAGE_KEY, sales);
        return sales[index];
    }

    /**
     * Repone el stock de una venta
     * @param {string} id
     */
    restoreStock(id) {
        const sale = this.getById(id);
        if (!sale) return;
        
        sale.items.forEach(item => {
            const product = Inventory.getById(item.productId);
            if (product) {
                Inventory.update(product.id, {
                    marca: product.marca,
                    amperaje: product.amperaje,
                    cantidad: product.cantidad + item.cantidad,
                    costo: product.costo,
                    precioVenta: product.precioVenta
                });
            }
        });
    }

    /**
     * Descuenta stock de items
     * @param {Array} items
     */
    deductStock(items) {
        items.forEach(item => {
            const product = Inventory.getById(item.productId);
            if (product) {
                Inventory.update(product.id, {
                    marca: product.marca,
                    amperaje: product.amperaje,
                    cantidad: product.cantidad - item.cantidad,
                    costo: product.costo,
                    precioVenta: product.precioVenta
                });
            }
        });
    }

    /**
     * Elimina una venta y repone stock
     * @param {string} id
     * @returns {boolean}
     */
    delete(id) {
        const sale = this.getById(id);
        if (!sale) return false;
        
        // Reponer stock
        this.restoreStock(id);
        
        // Eliminar venta
        const sales = this.getAll();
        const filtered = sales.filter(s => s.id !== id);
        Storage.set(STORAGE_KEY, filtered);
        return true;
    }
}

const Sales = new SalesService();
export default Sales;
