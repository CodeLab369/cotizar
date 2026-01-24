/**
 * NICMAT S.R.L. - Sistema de Cotización
 * Servicio: Inventario
 * @version 1.0.0
 */

import Storage from '../utils/storage.js';
import { generateId } from '../utils/helpers.js';
import Currency from '../utils/currency.js';

/**
 * Clase para gestionar el inventario
 */
class InventoryService {
    constructor() {
        this.storageKey = 'inventory';
    }

    /**
     * Obtiene todos los productos del inventario
     * @returns {Array} Lista de productos
     */
    getAll() {
        return Storage.get(this.storageKey, []);
    }

    /**
     * Obtiene un producto por ID
     * @param {string} id - ID del producto
     * @returns {Object|null} Producto encontrado o null
     */
    getById(id) {
        const inventory = this.getAll();
        return inventory.find(item => item.id === id) || null;
    }

    /**
     * Busca un producto por Marca + Amperaje
     * @param {string} marca - Marca del producto
     * @param {string} amperaje - Amperaje del producto
     * @returns {Object|null} Producto encontrado o null
     */
    findByMarcaAmperaje(marca, amperaje) {
        const inventory = this.getAll();
        const marcaNorm = (marca || '').trim().toLowerCase();
        const amperajeNorm = (amperaje || '').trim().toLowerCase();
        
        return inventory.find(item => 
            item.marca.toLowerCase() === marcaNorm && 
            item.amperaje.toLowerCase() === amperajeNorm
        ) || null;
    }

    /**
     * Reabastece un producto existente (suma cantidad)
     * @param {string} id - ID del producto
     * @param {number} cantidad - Cantidad a sumar
     * @param {Object} options - Opciones adicionales
     * @returns {Object|null} Producto actualizado o null
     */
    restock(id, cantidad, options = {}) {
        const inventory = this.getAll();
        const index = inventory.findIndex(item => item.id === id);

        if (index === -1) return null;

        const product = inventory[index];
        const nuevaCantidad = product.cantidad + (parseInt(cantidad) || 0);

        const updatedProduct = {
            ...product,
            cantidad: nuevaCantidad,
            updatedAt: Date.now()
        };

        // Actualizar precios si se especifica
        if (options.updatePrices) {
            if (options.costo !== undefined) {
                updatedProduct.costo = Currency.parse(options.costo) ?? product.costo;
            }
            if (options.precioVenta !== undefined) {
                updatedProduct.precioVenta = Currency.parse(options.precioVenta) ?? product.precioVenta;
            }
        }

        // Recalcular totales
        updatedProduct.costoTotal = Currency.round(updatedProduct.cantidad * updatedProduct.costo);
        updatedProduct.costoVenta = Currency.round(updatedProduct.cantidad * updatedProduct.precioVenta);

        inventory[index] = updatedProduct;
        Storage.set(this.storageKey, inventory);

        return updatedProduct;
    }

    /**
     * Agrega un nuevo producto
     * @param {Object} product - Datos del producto
     * @returns {Object} Producto creado
     */
    add(product) {
        const inventory = this.getAll();
        
        const newProduct = {
            id: generateId(),
            marca: product.marca?.trim() || '',
            amperaje: product.amperaje?.trim() || '',
            cantidad: parseInt(product.cantidad) || 0,
            costo: Currency.parse(product.costo) || 0,
            precioVenta: Currency.parse(product.precioVenta) || 0,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        // Calcular totales
        newProduct.costoTotal = Currency.round(newProduct.cantidad * newProduct.costo);
        newProduct.costoVenta = Currency.round(newProduct.cantidad * newProduct.precioVenta);

        inventory.push(newProduct);
        Storage.set(this.storageKey, inventory);

        return newProduct;
    }

    /**
     * Actualiza un producto existente
     * @param {string} id - ID del producto
     * @param {Object} data - Datos a actualizar
     * @returns {Object|null} Producto actualizado o null
     */
    update(id, data) {
        const inventory = this.getAll();
        const index = inventory.findIndex(item => item.id === id);

        if (index === -1) return null;

        const updatedProduct = {
            ...inventory[index],
            marca: data.marca?.trim() || inventory[index].marca,
            amperaje: data.amperaje?.trim() || inventory[index].amperaje,
            cantidad: parseInt(data.cantidad) ?? inventory[index].cantidad,
            costo: Currency.parse(data.costo) ?? inventory[index].costo,
            precioVenta: Currency.parse(data.precioVenta) ?? inventory[index].precioVenta,
            updatedAt: Date.now()
        };

        // Recalcular totales
        updatedProduct.costoTotal = Currency.round(updatedProduct.cantidad * updatedProduct.costo);
        updatedProduct.costoVenta = Currency.round(updatedProduct.cantidad * updatedProduct.precioVenta);

        inventory[index] = updatedProduct;
        Storage.set(this.storageKey, inventory);

        return updatedProduct;
    }

    /**
     * Elimina un producto
     * @param {string} id - ID del producto
     * @returns {boolean} true si se eliminó correctamente
     */
    delete(id) {
        const inventory = this.getAll();
        const filtered = inventory.filter(item => item.id !== id);

        if (filtered.length === inventory.length) return false;

        Storage.set(this.storageKey, filtered);
        return true;
    }

    /**
     * Elimina todos los productos
     * @returns {boolean} true si se eliminó correctamente
     */
    deleteAll() {
        Storage.set(this.storageKey, []);
        return true;
    }

    /**
     * Importa productos desde un array con opciones de reabastecimiento
     * @param {Array} products - Lista de productos a importar
     * @param {Object} options - Opciones de importación
     * @returns {Object} Resultado de la importación
     */
    import(products, options = {}) {
        const inventory = this.getAll();
        let added = 0;
        let restocked = 0;
        let errors = 0;

        const { restockExisting = false, updatePrices = false } = options;

        products.forEach(product => {
            try {
                if (!product.marca || !product.amperaje) {
                    errors++;
                    return;
                }

                const marca = String(product.marca || '').trim();
                const amperaje = String(product.amperaje || '').trim();
                const cantidad = parseInt(product.cantidad) || 0;
                const costo = parseFloat(product.costo) || 0;
                const precioVenta = parseFloat(product.precioVenta || product['precio_venta'] || product['Precio de Venta']) || 0;

                // Buscar si existe
                const existingIndex = inventory.findIndex(item =>
                    item.marca.toLowerCase() === marca.toLowerCase() &&
                    item.amperaje.toLowerCase() === amperaje.toLowerCase()
                );

                if (existingIndex !== -1 && restockExisting) {
                    // Reabastecer producto existente
                    const existing = inventory[existingIndex];
                    existing.cantidad += cantidad;
                    existing.updatedAt = Date.now();

                    if (updatePrices) {
                        existing.costo = costo;
                        existing.precioVenta = precioVenta;
                    }

                    existing.costoTotal = Currency.round(existing.cantidad * existing.costo);
                    existing.costoVenta = Currency.round(existing.cantidad * existing.precioVenta);

                    restocked++;
                } else {
                    // Crear nuevo producto
                    const newProduct = {
                        id: generateId(),
                        marca,
                        amperaje,
                        cantidad,
                        costo,
                        precioVenta,
                        createdAt: Date.now(),
                        updatedAt: Date.now()
                    };

                    newProduct.costoTotal = Currency.round(newProduct.cantidad * newProduct.costo);
                    newProduct.costoVenta = Currency.round(newProduct.cantidad * newProduct.precioVenta);

                    inventory.push(newProduct);
                    added++;
                }
            } catch (e) {
                errors++;
            }
        });

        Storage.set(this.storageKey, inventory);

        return { added, restocked, errors, total: products.length };
    }

    /**
     * Exporta el inventario como array
     * @returns {Array} Inventario para exportar
     */
    export() {
        return this.getAll().map(item => ({
            Marca: item.marca,
            Amperaje: item.amperaje,
            Cantidad: item.cantidad,
            Costo: item.costo,
            'Precio de Venta': item.precioVenta,
            'Costo Total': item.costoTotal,
            'Costo Venta': item.costoVenta
        }));
    }

    /**
     * Obtiene las marcas únicas
     * @returns {Array} Lista de marcas
     */
    getBrands() {
        const inventory = this.getAll();
        const brands = [...new Set(inventory.map(item => item.marca))];
        return brands.sort();
    }

    /**
     * Obtiene los amperajes por marca
     * @param {string} marca - Marca a filtrar (opcional)
     * @returns {Array} Lista de amperajes
     */
    getAmperajes(marca = null) {
        let inventory = this.getAll();
        
        if (marca) {
            inventory = inventory.filter(item => item.marca === marca);
        }

        const amperajes = [...new Set(inventory.map(item => item.amperaje))];
        return amperajes.sort((a, b) => {
            const numA = parseInt(a) || 0;
            const numB = parseInt(b) || 0;
            return numA - numB;
        });
    }

    /**
     * Filtra el inventario
     * @param {Object} filters - Filtros a aplicar
     * @returns {Array} Inventario filtrado
     */
    filter(filters = {}) {
        let inventory = this.getAll();

        // Filtro por búsqueda
        if (filters.search) {
            const search = filters.search.toLowerCase();
            inventory = inventory.filter(item =>
                item.marca.toLowerCase().includes(search) ||
                item.amperaje.toLowerCase().includes(search)
            );
        }

        // Filtro por marca
        if (filters.marca) {
            inventory = inventory.filter(item => item.marca === filters.marca);
        }

        // Filtro por amperaje
        if (filters.amperaje) {
            inventory = inventory.filter(item => item.amperaje === filters.amperaje);
        }

        // Filtro por cantidad
        if (filters.cantidadOperador && filters.cantidadValor !== undefined && filters.cantidadValor !== '') {
            const valor = parseInt(filters.cantidadValor);
            switch (filters.cantidadOperador) {
                case '=':
                    inventory = inventory.filter(item => item.cantidad === valor);
                    break;
                case '>':
                    inventory = inventory.filter(item => item.cantidad > valor);
                    break;
                case '<':
                    inventory = inventory.filter(item => item.cantidad < valor);
                    break;
                case '>=':
                    inventory = inventory.filter(item => item.cantidad >= valor);
                    break;
                case '<=':
                    inventory = inventory.filter(item => item.cantidad <= valor);
                    break;
            }
        }

        return inventory;
    }

    /**
     * Obtiene estadísticas del inventario
     * @returns {Object} Estadísticas
     */
    getStats() {
        const inventory = this.getAll();
        
        return {
            totalProductos: inventory.length,
            totalUnidades: inventory.reduce((sum, item) => sum + item.cantidad, 0),
            costoTotalInventario: inventory.reduce((sum, item) => sum + item.costoTotal, 0),
            valorVentaTotal: inventory.reduce((sum, item) => sum + item.costoVenta, 0),
            marcasUnicas: this.getBrands().length
        };
    }
}

// Crear instancia única
const Inventory = new InventoryService();

export default Inventory;
