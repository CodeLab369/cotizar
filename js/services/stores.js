/**
 * NICMAT S.R.L. - Sistema de Cotización
 * Servicio: Tiendas
 * @version 1.0.0
 */

import Storage from '../utils/storage.js';
import { generateId } from '../utils/helpers.js';
import Inventory from './inventory.js';

const STORAGE_KEY = 'stores';
const TRANSFERS_KEY = 'store_transfers';

/**
 * Tipos de tienda
 */
export const STORE_TYPES = {
    MATRIZ: 'Casa Matriz',
    SUCURSAL: 'Sucursal'
};

class StoresService {
    /**
     * Obtiene todas las tiendas
     * @returns {Array}
     */
    getAll() {
        return Storage.get(STORAGE_KEY, []);
    }

    /**
     * Obtiene una tienda por ID
     * @param {string} id
     * @returns {Object|null}
     */
    getById(id) {
        const stores = this.getAll();
        return stores.find(store => store.id === id) || null;
    }

    /**
     * Crea una nueva tienda
     * @param {Object} storeData
     * @returns {Object}
     */
    add(storeData) {
        const stores = this.getAll();

        if (!storeData.nombre || !storeData.nombre.trim()) {
            throw new Error('El nombre de la tienda es requerido');
        }

        if (!storeData.tipo || !Object.values(STORE_TYPES).includes(storeData.tipo)) {
            throw new Error('Selecciona un tipo de tienda válido');
        }

        // Verificar si ya existe Casa Matriz
        if (storeData.tipo === STORE_TYPES.MATRIZ) {
            const existingMatriz = stores.find(s => s.tipo === STORE_TYPES.MATRIZ);
            if (existingMatriz) {
                throw new Error('Ya existe una Casa Matriz. Solo puede haber una.');
            }
        }

        const newStore = {
            id: generateId(),
            nombre: storeData.nombre.trim(),
            tipo: storeData.tipo,
            encargado: (storeData.encargado || '').trim(),
            ciudad: (storeData.ciudad || '').trim(),
            direccion: (storeData.direccion || '').trim(),
            createdAt: Date.now(),
            inventory: [] // Inventario propio de la tienda
        };

        stores.push(newStore);
        Storage.set(STORAGE_KEY, stores);

        return newStore;
    }

    /**
     * Actualiza una tienda
     * @param {string} id
     * @param {Object} storeData
     * @returns {boolean}
     */
    update(id, storeData) {
        const stores = this.getAll();
        const index = stores.findIndex(store => store.id === id);
        if (index === -1) return false;

        // Verificar si cambia a Casa Matriz y ya existe una
        if (storeData.tipo === STORE_TYPES.MATRIZ && stores[index].tipo !== STORE_TYPES.MATRIZ) {
            const existingMatriz = stores.find(s => s.tipo === STORE_TYPES.MATRIZ);
            if (existingMatriz) {
                throw new Error('Ya existe una Casa Matriz. Solo puede haber una.');
            }
        }

        stores[index] = {
            ...stores[index],
            nombre: (storeData.nombre || stores[index].nombre).trim(),
            tipo: storeData.tipo || stores[index].tipo,
            encargado: (storeData.encargado || '').trim(),
            ciudad: (storeData.ciudad || '').trim(),
            direccion: (storeData.direccion || '').trim()
        };

        Storage.set(STORAGE_KEY, stores);
        return true;
    }

    /**
     * Elimina una tienda
     * @param {string} id
     * @returns {boolean}
     */
    delete(id) {
        const stores = this.getAll();
        const store = stores.find(s => s.id === id);
        
        if (!store) return false;
        
        // Verificar si tiene inventario
        if (store.inventory && store.inventory.length > 0) {
            throw new Error('No se puede eliminar una tienda con inventario. Transfiere los productos primero.');
        }

        const filtered = stores.filter(s => s.id !== id);
        Storage.set(STORAGE_KEY, filtered);
        return true;
    }

    /**
     * Obtiene el inventario de una tienda
     * @param {string} storeId
     * @returns {Array}
     */
    getStoreInventory(storeId) {
        const store = this.getById(storeId);
        return store ? store.inventory || [] : [];
    }

    /**
     * Envía productos del inventario principal a una tienda
     * @param {string} storeId
     * @param {Array} items - [{productId, cantidad}]
     * @returns {Object} Transferencia registrada
     */
    sendProducts(storeId, items) {
        const stores = this.getAll();
        const storeIndex = stores.findIndex(s => s.id === storeId);
        
        if (storeIndex === -1) {
            throw new Error('Tienda no encontrada');
        }

        if (!items || items.length === 0) {
            throw new Error('No hay productos para enviar');
        }

        const store = stores[storeIndex];
        const transferItems = [];

        // Validar y preparar items
        for (const item of items) {
            const product = Inventory.getById(item.productId);
            if (!product) {
                throw new Error(`Producto no encontrado: ${item.productId}`);
            }

            const cantidad = parseInt(item.cantidad) || 0;
            if (cantidad <= 0) {
                throw new Error(`Cantidad inválida para ${product.marca} ${product.amperaje}`);
            }

            if (cantidad > product.cantidad) {
                throw new Error(`Stock insuficiente para ${product.marca} ${product.amperaje}. Disponible: ${product.cantidad}`);
            }

            transferItems.push({
                productId: product.id,
                marca: product.marca,
                amperaje: product.amperaje,
                cantidad,
                costo: product.costo,
                precioVenta: product.precioVenta
            });
        }

        // Descontar del inventario principal
        for (const item of transferItems) {
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
        }

        // Agregar al inventario de la tienda
        if (!store.inventory) store.inventory = [];

        for (const item of transferItems) {
            const existingIndex = store.inventory.findIndex(
                i => i.productId === item.productId
            );

            if (existingIndex !== -1) {
                store.inventory[existingIndex].cantidad += item.cantidad;
            } else {
                store.inventory.push({
                    productId: item.productId,
                    marca: item.marca,
                    amperaje: item.amperaje,
                    cantidad: item.cantidad,
                    costo: item.costo,
                    precioVenta: item.precioVenta
                });
            }
        }

        stores[storeIndex] = store;
        Storage.set(STORAGE_KEY, stores);

        // Registrar transferencia
        const transfer = {
            id: generateId(),
            storeId,
            storeName: store.nombre,
            items: transferItems,
            totalUnidades: transferItems.reduce((sum, i) => sum + i.cantidad, 0),
            date: Date.now(),
            tipo: 'envio'
        };

        this.saveTransfer(transfer);

        return transfer;
    }

    /**
     * Guarda una transferencia
     * @param {Object} transfer
     */
    saveTransfer(transfer) {
        const transfers = Storage.get(TRANSFERS_KEY, []);
        transfers.unshift(transfer);
        Storage.set(TRANSFERS_KEY, transfers);
    }

    /**
     * Obtiene todas las transferencias
     * @returns {Array}
     */
    getTransfers() {
        return Storage.get(TRANSFERS_KEY, []);
    }

    /**
     * Obtiene transferencias de una tienda
     * @param {string} storeId
     * @returns {Array}
     */
    getStoreTransfers(storeId) {
        const transfers = this.getTransfers();
        return transfers.filter(t => t.storeId === storeId);
    }

    /**
     * Devuelve productos de una tienda al inventario principal
     * @param {string} storeId
     * @param {string} productId
     * @param {number} cantidad - Cantidad a devolver (si no se especifica, devuelve todo)
     * @returns {Object} Información de la devolución
     */
    returnProduct(storeId, productId, cantidad = null) {
        const stores = this.getAll();
        const storeIndex = stores.findIndex(s => s.id === storeId);
        
        if (storeIndex === -1) {
            throw new Error('Tienda no encontrada');
        }

        const store = stores[storeIndex];
        if (!store.inventory) store.inventory = [];

        const itemIndex = store.inventory.findIndex(i => i.productId === productId);
        if (itemIndex === -1) {
            throw new Error('Producto no encontrado en la tienda');
        }

        const storeItem = store.inventory[itemIndex];
        const cantidadADevolver = cantidad !== null ? Math.min(cantidad, storeItem.cantidad) : storeItem.cantidad;

        if (cantidadADevolver <= 0) {
            throw new Error('Cantidad inválida');
        }

        // Devolver al inventario principal
        const mainProduct = Inventory.getById(productId);
        if (mainProduct) {
            Inventory.update(productId, {
                marca: mainProduct.marca,
                amperaje: mainProduct.amperaje,
                cantidad: mainProduct.cantidad + cantidadADevolver,
                costo: mainProduct.costo,
                precioVenta: mainProduct.precioVenta
            });
        } else {
            // Si el producto ya no existe en inventario principal, recrearlo
            Inventory.add({
                marca: storeItem.marca,
                amperaje: storeItem.amperaje,
                cantidad: cantidadADevolver,
                costo: storeItem.costo,
                precioVenta: storeItem.precioVenta
            });
        }

        // Actualizar inventario de la tienda
        if (cantidadADevolver >= storeItem.cantidad) {
            // Eliminar completamente
            store.inventory.splice(itemIndex, 1);
        } else {
            // Reducir cantidad
            store.inventory[itemIndex].cantidad -= cantidadADevolver;
        }

        stores[storeIndex] = store;
        Storage.set(STORAGE_KEY, stores);

        // Registrar transferencia de devolución
        const transfer = {
            id: generateId(),
            storeId,
            storeName: store.nombre,
            items: [{
                productId,
                marca: storeItem.marca,
                amperaje: storeItem.amperaje,
                cantidad: cantidadADevolver
            }],
            totalUnidades: cantidadADevolver,
            date: Date.now(),
            tipo: 'devolucion'
        };

        this.saveTransfer(transfer);

        return {
            producto: `${storeItem.marca} ${storeItem.amperaje}`,
            cantidad: cantidadADevolver,
            transfer
        };
    }

    /**
     * Obtiene estadísticas
     * @returns {Object}
     */
    getStats() {
        const stores = this.getAll();
        const transfers = this.getTransfers();

        const totalTiendas = stores.length;
        const casaMatriz = stores.filter(s => s.tipo === STORE_TYPES.MATRIZ).length;
        const sucursales = stores.filter(s => s.tipo === STORE_TYPES.SUCURSAL).length;
        const totalTransferencias = transfers.length;
        const unidadesEnviadas = transfers.reduce((sum, t) => sum + t.totalUnidades, 0);

        return {
            totalTiendas,
            casaMatriz,
            sucursales,
            totalTransferencias,
            unidadesEnviadas
        };
    }
}

const Stores = new StoresService();
export default Stores;
