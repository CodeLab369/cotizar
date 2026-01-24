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
     * Elimina una venta (no repone stock)
     * @param {string} id
     * @returns {boolean}
     */
    delete(id) {
        const sales = this.getAll();
        const filtered = sales.filter(sale => sale.id !== id);
        if (filtered.length === sales.length) return false;
        Storage.set(STORAGE_KEY, filtered);
        return true;
    }
}

const Sales = new SalesService();
export default Sales;
